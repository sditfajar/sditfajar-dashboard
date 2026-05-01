"use client";

import { useEffect, useState } from "react";
import { AbsensiGuruInput } from "@/components/guru/AbsensiGuruInput";
import { FadeIn } from "@/components/ui/fade-in";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getMonthlyAttendance, TeacherAttendance } from "@/lib/firebase/guru-absensi";
import { History } from "lucide-react";

export default function AbsensiGuruPage() {
  const [history, setHistory] = useState<TeacherAttendance[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchHistory = async () => {
        const data = await getMonthlyAttendance(userId, currentMonth);
        setHistory(data);
      };
      fetchHistory();
    }
  }, [userId, currentMonth]);

  // Extract dates for highlighting
  const completeDates = history
    .filter((record) => record.waktu_masuk && record.waktu_pulang)
    .map((record) => new Date(record.timestamp as Date));

  const partialDates = history
    .filter((record) => record.waktu_masuk && !record.waktu_pulang)
    .map((record) => new Date(record.timestamp as Date));

  return (
    <div className="space-y-6">
      <FadeIn className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Absen Kehadiran Guru</h1>
          <p className="text-sm text-muted-foreground">
            Lakukan absensi kehadiran dengan verifikasi lokasi geofencing.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Absensi Form */}
        <FadeIn className="flex-1">
          <div className="rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm h-full">
            <AbsensiGuruInput />
          </div>
        </FadeIn>

        {/* History Calendar */}
        <FadeIn className="w-full lg:w-fit" delay={0.2}>
          <Card className="h-full shadow-md bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Riwayat Bulan Ini
              </CardTitle>
              <CardDescription className="text-xs">
                Indikator warna menunjukkan status kehadiran harian Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                onMonthChange={setCurrentMonth}
                month={currentMonth}
                modifiers={{
                  complete: completeDates,
                  partial: partialDates,
                }}
                modifiersClassNames={{
                  complete: "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-green-500 after:rounded-full font-bold text-primary",
                  partial: "after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-yellow-500 after:rounded-full font-bold text-yellow-600",
                }}
                className="rounded-md border shadow-sm pointer-events-none"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Lengkap (Masuk & Pulang)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Parsial (Hanya Masuk)</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  * Data diperbarui otomatis setelah Anda melakukan absensi.
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
