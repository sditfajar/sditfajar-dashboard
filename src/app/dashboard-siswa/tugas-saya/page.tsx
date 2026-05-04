"use client";

import { FadeIn } from "@/components/ui/fade-in";

export default function TugasSayaPage() {
  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Tugas Saya</h1>
        <p className="text-muted-foreground mt-2">
          Daftar tugas yang harus dikerjakan.
        </p>
      </FadeIn>
      
      <FadeIn delay={0.1} className="flex flex-col flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-white/50 dark:bg-zinc-950/50 min-h-[400px]">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Semua Tugas Selesai! 🎉</h3>
          <p className="text-muted-foreground max-w-sm">
            Bagus sekali, kamu tidak memiliki tugas yang tertunda saat ini.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
