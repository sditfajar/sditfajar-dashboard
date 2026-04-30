"use client";

import { AbsensiGuruInput } from "@/components/guru/AbsensiGuruInput";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiGuruPage() {
  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Absen Kehadiran Guru</h1>
          <p className="text-sm text-muted-foreground">
            Lakukan absensi kehadiran dengan verifikasi lokasi geofencing.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <AbsensiGuruInput />
      </FadeIn>
    </>
  );
}
