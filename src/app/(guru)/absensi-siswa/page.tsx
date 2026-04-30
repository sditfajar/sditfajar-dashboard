"use client";

import { AbsensiSiswaInput } from "@/components/guru/AbsensiSiswaInput";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiSiswaPage() {
  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Absensi Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kehadiran harian siswa. Data yang sudah disimpan akan otomatis terkunci.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <AbsensiSiswaInput />
      </FadeIn>
    </>
  );
}
