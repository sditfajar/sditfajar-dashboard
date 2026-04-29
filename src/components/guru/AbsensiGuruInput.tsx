"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { recordTeacherAttendance } from "@/lib/firebase/guru-absensi";
import { SuccessDialog } from "@/components/ui/success-dialog";

// KOORDINAT SEKOLAH SDIT Fajar
const SCHOOL_LAT = -6.414005026796305;
const SCHOOL_LNG = 106.8654741102322;

// Diubah ke 0.05 untuk radius 50 Meter
const MAX_DISTANCE_KM = 0.05;

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function AbsensiGuruInput() {
  const [teacherName, setTeacherName] = useState("");
  const [isLocating, setIsLocating] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

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
        const { latitude, longitude } = position.coords;
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
    if (!teacherName.trim()) {
      toast.error("Nama Harus Diisi", { description: "Silakan masukkan nama Anda sebelum absen." });
      return;
    }

    if (distanceKm === null || userLocation === null) {
      toast.error("Lokasi Belum Ditemukan", { description: "Harap tunggu atau muat ulang lokasi Anda." });
      return;
    }

    if (distanceKm > MAX_DISTANCE_KM) {
      toast.error("Di Luar Jangkauan", { description: `Anda berada di luar radius sekolah (${distanceKm.toFixed(2)} km).` });
      return;
    }

    setIsSubmitting(true);
    try {
      await recordTeacherAttendance(teacherName, distanceKm, userLocation.lat, userLocation.lng);
      setSuccessPopup(true);
      setTeacherName("");
    } catch (error) {
      console.error("Gagal melakukan absensi:", error);
      toast.error("Gagal Absen", { description: "Terjadi kesalahan saat menyimpan data absensi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOutOfRange = distanceKm !== null && distanceKm > MAX_DISTANCE_KM;
  const isButtonDisabled = isLocating || !!locationError || isOutOfRange || isSubmitting;

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
              placeholder="Masukkan Nama Anda"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

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
                  <span className="font-medium">{distanceKm.toFixed(2)} km</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Batas Maksimal:</span>
                  <span className="font-medium">{MAX_DISTANCE_KM} km</span>
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
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={isButtonDisabled}
            onClick={handleAbsen}
          >
            {isSubmitting ? "Menyimpan..." : isOutOfRange ? "Di Luar Jangkauan" : "Absen Hadir"}
          </Button>
        </CardFooter>
      </Card>

      <SuccessDialog
        open={successPopup}
        onOpenChange={setSuccessPopup}
        title="Absensi Berhasil!"
        description="Data kehadiran Anda telah tercatat ke dalam sistem."
      />
    </>
  );
}
