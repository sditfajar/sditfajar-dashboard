"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { JadwalGuruViewer } from "@/components/pembelajaran/JadwalGuruViewer";

export default function JadwalGuruPage() {
  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Jadwal Mengajar Saya</h1>
          <p className="text-sm text-muted-foreground">
            Berikut adalah jadwal mengajar Anda yang telah disusun oleh Admin.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg p-2 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm border shadow-sm">
        <JadwalGuruViewer />
      </FadeIn>
    </>
  );
}
