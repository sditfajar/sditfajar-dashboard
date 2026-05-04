"use client";

import { FadeIn } from "@/components/ui/fade-in";

export default function KelasSayaPage() {
  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Kelas Saya</h1>
        <p className="text-muted-foreground mt-2">
          Materi pelajaran dan referensi kelas.
        </p>
      </FadeIn>
      
      <FadeIn delay={0.1} className="flex flex-col flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 bg-white/50 dark:bg-zinc-950/50 min-h-[400px]">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Belum Ada Materi</h3>
          <p className="text-muted-foreground max-w-sm">
            Guru belum memposting materi pelajaran untuk kelas ini. Silakan periksa kembali nanti.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
