"use client";

import { AbsensiGuruLaporan } from "@/components/guru/AbsensiGuruLaporan";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiGuruPage() {
  return (
    <div className="w-full overflow-x-hidden px-0 md:px-6 space-y-6">
      <FadeIn className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Laporan Absensi Guru</h1>
          <p className="text-sm text-muted-foreground">
            Pantau rekapitulasi absensi geofencing seluruh guru.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <AbsensiGuruLaporan />
      </FadeIn>
    </div>
  );
}
