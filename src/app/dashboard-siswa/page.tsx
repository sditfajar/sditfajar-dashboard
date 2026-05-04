"use client";

import { FadeIn } from "@/components/ui/fade-in";

export default function DashboardSiswaPage() {
  return (
    <div className="flex flex-col gap-6">
      <FadeIn>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Siswa</h1>
        <p className="text-muted-foreground mt-2">
          Selamat datang di Portal Pembelajaran SDIT Fajar.
        </p>
      </FadeIn>
      
      <FadeIn delay={0.1} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for Widgets */}
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight">Tugas Mendatang</h3>
          <p className="text-sm text-muted-foreground mt-2">Belum ada tugas baru.</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight">Jadwal Hari Ini</h3>
          <p className="text-sm text-muted-foreground mt-2">Memuat jadwal pelajaran...</p>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight">Pengumuman Terbaru</h3>
          <p className="text-sm text-muted-foreground mt-2">Tidak ada pengumuman.</p>
        </div>
      </FadeIn>
    </div>
  );
}
