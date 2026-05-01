"use client";

import {
  BookOpen,
  CheckCircle2,
  Sun,
  Layers,
  BookMarked,
  GraduationCap,
  Heart
} from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const programUnggulan = [
  "Pembelajaran Al-Qur'an dengan Metode 'Tilawati'",
  "Education Field Trip",
  "Pembinaan Karakter Siswa Sesuai dengan Ajaran Islam",
  "Lifeskill melalui Kegiatan Cookingday",
  "Marketday (Entrepreneurship)",
  "Pembiasaan Ibadah",
];

const morningActivity = [
  "Shalat Dhuha",
  "Dzikir Pagi",
  "Muroja'ah Yaumiyah",
  "Jum'at Bersih",
];

const konsepPembelajaran = [
  {
    icon: BookMarked,
    judul: "Pendidikan Al-Qur'an",
    deskripsi:
      "Siswa-siswi SDIT Fajar menghafal minimal 1 Juz Al-Qur'an (Juz 30) dengan metode 'Tilawati'.",
  },
  {
    icon: GraduationCap,
    judul: "Kurikulum Merdeka",
    deskripsi:
      "SDIT Fajar menerapkan Kurikulum Merdeka yang mengembangkan Projek Penguatan Profil Pelajar Pancasila.",
  },
  {
    icon: Heart,
    judul: "Pendidikan Karakter",
    deskripsi:
      "Pembelajaran berbasis karakter berdasarkan 6 Karakter Profil Pelajar Pancasila: Beriman, Bertaqwa kepada Tuhan YME dan Berakhlak Mulia, Berkebhinekaan Global, Gotong Royong, Mandiri, Kreatif, dan Bernalar Kritis.",
  },
];

// Galeri placeholder — ganti src dengan path nyata ketika foto tersedia
const galeri = [
  { src: "/galeri-1.jpg", alt: "Kegiatan Field Trip" },
  { src: "/galeri-2.jpg", alt: "Cookingday Siswa" },
  { src: "/galeri-3.jpg", alt: "Pembiasaan Ibadah" },
  { src: "/galeri-4.jpg", alt: "Marketday Siswa" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function GaleriCard({ src, alt }: { src: string; alt: string }) {
  return (
    <FadeIn className="relative aspect-square rounded-2xl overflow-hidden bg-primary/5 border border-border/50 shadow-sm group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {/* Overlay label saat foto belum tersedia */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-primary/40 pointer-events-none">
        <Layers className="w-8 h-8 mb-2" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-center px-2">{alt}</span>
      </div>
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md">
        {alt}
      </p>
    </FadeIn>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AcademicSection() {
  return (
    <section id="akademik" className="py-24 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-20">

        {/* ── BAGIAN ATAS: Program Unggulan ──────────────────────── */}
        <div>
          {/* Section header */}
          <FadeIn className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <BookOpen className="w-4 h-4" />
              Keunggulan Kami
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Program Unggulan
            </h2>
            <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
              Program-program terbaik yang kami rancang untuk membentuk generasi Qur'ani yang cerdas dan berkarakter.
            </p>
          </FadeIn>

          {/* Program list — 2 or 3 columns */}
          <FadeInStagger faster className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {programUnggulan.map((item, i) => (
              <FadeIn key={i} whileHover={{ y: -4, scale: 1.02 }} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-secondary/30 backdrop-blur-sm p-5 shadow-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-default">
                <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </span>
                <span className="font-medium leading-snug text-foreground/90">{item}</span>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30" />

        {/* ── BAGIAN BAWAH: Grid 2 Kolom ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* ── Kolom Kiri: Galeri Kegiatan ── */}
          <div className="space-y-4">
            <FadeIn>
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
                Galeri Kegiatan
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Sekilas dokumentasi kegiatan belajar dan program unggulan yang berlangsung di lingkungan SDIT Fajar.
              </p>
            </FadeIn>
            <FadeInStagger faster className="grid grid-cols-2 gap-4">
              {galeri.map((item, i) => (
                <GaleriCard key={i} src={item.src} alt={item.alt} />
              ))}
            </FadeInStagger>
          </div>

          {/* ── Kolom Kanan: Morning Activity + Konsep Pembelajaran ── */}
          <div className="space-y-10">
            {/* Morning Activity */}
            <FadeIn className="rounded-2xl border border-amber-400/30 bg-amber-50/50 dark:bg-amber-900/10 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-amber-400/20">
                  <Sun className="w-5 h-5 text-amber-500" />
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground uppercase">
                  Morning Activity
                </h3>
              </div>
              <FadeInStagger faster className="grid grid-cols-2 gap-3">
                {morningActivity.map((act, i) => (
                  <FadeIn key={i}>
                    <div className="flex items-center gap-2.5 rounded-xl border border-amber-300/40 bg-amber-400/10 px-3 py-2.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-sm font-semibold text-foreground/80">{act}</span>
                    </div>
                  </FadeIn>
                ))}
              </FadeInStagger>
            </FadeIn>

            {/* Konsep Pembelajaran */}
            <div className="space-y-4">
              <FadeIn>
                <h3 className="text-xl font-extrabold tracking-tight text-foreground uppercase">
                  Konsep Pembelajaran
                </h3>
              </FadeIn>
              <FadeInStagger faster className="space-y-4">
                {konsepPembelajaran.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <FadeIn key={i} whileHover={{ x: 4 }} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-secondary/30 p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 h-full">
                        <span className="mt-0.5 shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/15">
                          <Icon className="w-5 h-5 text-primary" />
                        </span>
                        <div>
                          <h4 className="font-bold text-foreground mb-1">{item.judul}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.deskripsi}</p>
                        </div>
                    </FadeIn>
                  );
                })}
              </FadeInStagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
