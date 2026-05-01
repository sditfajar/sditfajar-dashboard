"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, CheckCircle2, AlertCircle, Loader2, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getTodayAttendance, recordAbsenMasuk, recordAbsenPulang } from "@/lib/firebase/guru-absensi";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

// KOORDINAT SEKOLAH SDIT Fajar
const SCHOOL_LAT = -6.414005026796305;
const SCHOOL_LNG = 106.8654741102322;

// Radius 200 Meter
const MAX_DISTANCE_KM = 0.2;

type AbsenPhase = "loading" | "masuk" | "pulang" | "selesai";

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function AbsensiGuruInput() {
  const [teacherName, setTeacherName] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; title: string; description: string }>({
    open: false, title: "", description: "",
  });
  const [phase, setPhase] = useState<AbsenPhase>("loading");
  const [masukTime, setMasukTime] = useState<Date | null>(null);
  const [pulangTime, setPulangTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user profile from auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const cachedProfile = sessionStorage.getItem(`profile_${user.uid}`);
        if (cachedProfile) {
          const p = JSON.parse(cachedProfile);
          setTeacherName(p.displayName);
        } else {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              setTeacherName(data.name || user.displayName || "Guru");
            } else {
              setTeacherName(user.displayName || "Guru");
            }
          } catch {
            setTeacherName(user.displayName || "Guru");
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Check today's attendance status on mount + when user is known
  const checkTodayStatus = useCallback(async (uid: string) => {
    try {
      const todayDoc = await getTodayAttendance(uid);
      if (!todayDoc) {
        setPhase("masuk");
      } else if (todayDoc.waktu_masuk && !todayDoc.waktu_pulang) {
        setPhase("pulang");
        if (todayDoc.waktu_masuk instanceof Date) {
          setMasukTime(todayDoc.waktu_masuk);
        }
      } else if (todayDoc.waktu_masuk && todayDoc.waktu_pulang) {
        setPhase("selesai");
        if (todayDoc.waktu_masuk instanceof Date) {
          setMasukTime(todayDoc.waktu_masuk);
        }
        if (todayDoc.waktu_pulang instanceof Date) {
          setPulangTime(todayDoc.waktu_pulang);
        }
      } else {
        setPhase("masuk");
      }
    } catch (error) {
      console.error("Error checking today's attendance:", error);
      setPhase("masuk");
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      checkTodayStatus(currentUser.uid);
    }
  }, [currentUser, checkTodayStatus]);

  const checkLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    setDistanceKm(null);

    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung Geolocation.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        if (accuracy > 100) {
          setLocationError(`Akurasi lokasi terlalu buruk (${accuracy.toFixed(0)}m). Hindari penggunaan Fake GPS atau cari sinyal lebih baik.`);
          setIsLocating(false);
          return;
        }

        setUserLocation({ lat: latitude, lng: longitude });
        const distance = getDistanceFromLatLonInKm(latitude, longitude, SCHOOL_LAT, SCHOOL_LNG);
        setDistanceKm(distance);
        setIsLocating(false);
      },
      (error) => {
        let errorMsg = "Gagal mengambil lokasi.";
        if (error.code === 1) errorMsg = "Akses lokasi ditolak. Izinkan akses lokasi di browser Anda.";
        if (error.code === 2) errorMsg = "Posisi lokasi tidak tersedia.";
        if (error.code === 3) errorMsg = "Waktu permintaan lokasi habis.";
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    checkLocation();
  }, []);

  const handleAbsen = async () => {
    if (!currentUser) {
      toast.error("Sesi Login Tidak Ditemukan", { description: "Silakan login ulang." });
      return;
    }

    if (!teacherName.trim()) {
      toast.error("Nama Harus Diisi", { description: "Silakan masukkan nama Anda sebelum absen." });
      return;
    }

    if (distanceKm === null || userLocation === null) {
      toast.error("Lokasi Belum Ditemukan", { description: "Harap tunggu atau muat ulang lokasi Anda." });
      return;
    }

    if (distanceKm > MAX_DISTANCE_KM) {
      toast.error("Di Luar Jangkauan", { description: `Anda berada di luar radius sekolah (${(distanceKm * 1000).toFixed(0)}m).` });
      return;
    }

    setIsSubmitting(true);
    try {
      if (phase === "masuk") {
        await recordAbsenMasuk(currentUser.uid, teacherName, distanceKm, userLocation.lat, userLocation.lng);
        setPhase("pulang");
        setMasukTime(new Date());
        setSuccessPopup({
          open: true,
          title: "Absen Masuk Berhasil! 🟢",
          description: "Waktu masuk Anda telah tercatat. Jangan lupa absen pulang nanti.",
        });
      } else if (phase === "pulang") {
        await recordAbsenPulang(currentUser.uid);
        setPhase("selesai");
        setPulangTime(new Date());
        setSuccessPopup({
          open: true,
          title: "Absen Pulang Berhasil! 🔵",
          description: "Absensi hari ini sudah lengkap. Terima kasih!",
        });
      }
    } catch (error) {
      console.error("Gagal melakukan absensi:", error);
      toast.error("Gagal Absen", { description: "Terjadi kesalahan saat menyimpan data absensi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOutOfRange = distanceKm !== null && distanceKm > MAX_DISTANCE_KM;
  const isComplete = phase === "selesai";
  const isButtonDisabled = isLocating || !!locationError || isOutOfRange || isSubmitting || isComplete || phase === "loading";



  return (
    <>
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Absensi Geofencing Guru
          </CardTitle>
          <CardDescription>Pastikan Anda berada di area sekolah untuk melakukan absensi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama / ID Guru</label>
            <Input
              placeholder="Memuat nama..."
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              disabled={true}
            />
          </div>

          {/* Status Absen Hari Ini */}
          {phase !== "loading" && (
            <div className="rounded-lg border p-3 bg-muted/20">
              <h4 className="text-sm font-medium mb-2">Status Absen Hari Ini</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${phase === "masuk" ? "bg-gray-300" : "bg-green-500"}`} />
                  <span className="text-xs text-muted-foreground">
                    Masuk {masukTime ? `(${masukTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })})` : "—"}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">•</span>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${phase === "selesai" ? "bg-blue-500" : "bg-gray-300"}`} />
                  <span className="text-xs text-muted-foreground">
                    Pulang {phase === "selesai" ? "✓" : "—"}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border p-4 bg-muted/30">
            <h4 className="text-sm font-medium mb-3">Status Lokasi</h4>

            {isLocating ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Mencari lokasi Anda...
              </div>
            ) : locationError ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2 text-destructive text-sm font-medium">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{locationError}</span>
                </div>
                <Button variant="outline" size="sm" onClick={checkLocation} className="mt-2 w-fit">
                  Coba Lagi
                </Button>
              </div>
            ) : distanceKm !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jarak dari Sekolah:</span>
                  <span className="font-medium">{(distanceKm * 1000).toFixed(0)} meter</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Batas Maksimal:</span>
                  <span className="font-medium">{MAX_DISTANCE_KM * 1000} meter</span>
                </div>

                {isOutOfRange ? (
                  <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>Anda berada di luar jangkauan radius sekolah. Silakan mendekat ke sekolah untuk absen.</p>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <p>Lokasi valid. Anda dapat melakukan absensi.</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <Button variant="ghost" size="sm" onClick={checkLocation} className="text-xs h-8">
                    Perbarui Lokasi
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center w-full min-h-[32px] flex items-center justify-center">
            {currentTime && (
              <span className="text-2xl font-mono font-bold text-yellow-500 dark:text-yellow-400 animate-pulse tracking-widest drop-shadow-sm">
                {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).replace(/\./g, ':')}
              </span>
            )}
          </div>
          
          <div className="flex flex-col w-full gap-4">
            <Button
              className={`w-full transition-all duration-300 ${phase === "masuk" && !isButtonDisabled ? "animate-pulse ring-2 ring-primary ring-offset-2 shadow-lg" : ""}`}
              size="lg"
              disabled={phase !== "masuk" || isButtonDisabled}
              onClick={handleAbsen}
              variant="default"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isSubmitting && phase === "masuk" ? "Menyimpan..." : (
                masukTime 
                  ? `Masuk - ${masukTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
                  : "Absen Masuk"
              )}
            </Button>
            
            <Button
              className={`w-full transition-all duration-300 ${phase === "pulang" && !isButtonDisabled ? "animate-pulse ring-2 ring-primary ring-offset-2 shadow-lg" : ""}`}
              size="lg"
              disabled={phase !== "pulang" || isButtonDisabled}
              onClick={handleAbsen}
              variant={phase === "pulang" ? "default" : "outline"}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {isSubmitting && phase === "pulang" ? "Menyimpan..." : (
                pulangTime
                  ? `Keluar - ${pulangTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
                  : "Absen Keluar"
              )}
            </Button>
          </div>

          {phase === "selesai" && (
            <div className="w-full text-center mt-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md text-sm font-medium animate-in fade-in slide-in-from-bottom-2 flex items-center justify-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Anda sudah menyelesaikan absen hari ini
            </div>
          )}
        </CardFooter>
      </Card>

      <SuccessDialog
        open={successPopup.open}
        onOpenChange={(open) => setSuccessPopup((prev) => ({ ...prev, open }))}
        title={successPopup.title}
        description={successPopup.description}
      />
    </>
  );
}
