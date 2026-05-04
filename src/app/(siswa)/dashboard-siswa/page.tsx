"use client";

import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { BookOpen } from "lucide-react";

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
        <Link href="/mata-pelajaran" className="group">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6 transition-all hover:shadow-md hover:border-green-500/50 group-hover:bg-green-500/5 h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold leading-none tracking-tight">Mata Pelajaran</h3>
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Lihat daftar pelajaran untuk kelas Anda.</p>
            <div className="mt-4 text-xs font-bold text-green-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Buka Mapel →
            </div>
          </div>
        </Link>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <h3 className="font-semibold leading-none tracking-tight">Pengumuman Terbaru</h3>
          <p className="text-sm text-muted-foreground mt-2">Tidak ada pengumuman.</p>
        </div>
      </FadeIn>
    </div>
  );
}
