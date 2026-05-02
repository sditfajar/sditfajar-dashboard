"use client";

import { AbsensiGuruInput } from "@/components/guru/AbsensiGuruInput";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiGuruPage() {
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

      {/* Main Absensi Form & History Table */}
      <FadeIn>
        <div className="w-full">
          <AbsensiGuruInput />
        </div>
      </FadeIn>
    </div>
  );
}
