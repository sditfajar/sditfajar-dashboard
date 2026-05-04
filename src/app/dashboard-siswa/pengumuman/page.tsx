"use client";

import { FadeIn } from "@/components/ui/fade-in";

export default function PengumumanPage() {
  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Pengumuman</h1>
        <p className="text-muted-foreground mt-2">
          Informasi penting dari sekolah.
        </p>
      </FadeIn>
      
      <FadeIn delay={0.1} className="flex flex-col flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-white/50 dark:bg-zinc-950/50 min-h-[400px]">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Belum Ada Pengumuman</h3>
          <p className="text-muted-foreground max-w-sm">
            Tidak ada pengumuman terbaru untuk saat ini.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
