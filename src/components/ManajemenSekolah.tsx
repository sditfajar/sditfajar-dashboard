"use client";

import Image from "next/image";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

const guruList = [
  { nama: "Ummi Nining Juningsih, S.Ag.", jabatan: "Kepala Sekolah", image: "/guru-1.jpg" },
  { nama: "Bu Herlin Ruswanti, S.Pd, Gr.", jabatan: "Guru BK", image: "/guru-2.jpg" },
  { nama: "Pa Alfa Muhdina, S.Pd", jabatan: "Kedisiplinan", image: "/guru-3.jpg" },
  { nama: "Bu Mia Nurdiana, S.Pd", jabatan: "Bendahara Sekolah", image: "/guru-4.jpg" },
  { nama: "Pa Esa Pandu Imansyah", jabatan: "Kesehatan", image: "/guru-5.jpg" },
  { nama: "Bu Nurul Fitri, S.Pd, Gr", jabatan: "Kurikulum", image: "/guru-6.jpg" },
  { nama: "Pa Nasrullah, S.Pd, Gr", jabatan: "Kesiswaan", image: "/guru-7.jpg" },
  { nama: "Ust. M.Padil Riswandi, S.E", jabatan: "OPS, PJOK", image: "/guru-8.jpg" },
  { nama: "Ustadzah Viny Virzanah", jabatan: "Ubuddiyah, B. Arab", image: "/guru-9.jpg" },
  { nama: "Ustadzah Risma, S.Pd", jabatan: "Kesiswaan", image: "/guru-10.jpg" },
  { nama: "Ustadzah Rizky", jabatan: "Perpustakaan, TU", image: "/guru-11.jpg" },
  { nama: "Bu Wartiah", jabatan: "Kebersihan", image: "/guru-12.jpg" },
  { nama: "Pak Martalih", jabatan: "Keamanan", image: "/guru-13.jpg" },
  { nama: "Ustadzah Diandra", jabatan: "B. Inggris", image: "/guru-14.jpg" },
  { nama: "Ustadzah Rifka Rahmawati", jabatan: "B. Sunda", image: "/guru-15.jpg" },
  { nama: "Bu Ustadzah Risma", jabatan: "Koordinator, Guru Tilawati", image: "/guru-16.jpg" },
];

function getInitials(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function AvatarFallback({ nama }: { nama: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-500/40 text-green-700 dark:text-green-400 font-bold text-lg">
      {getInitials(nama)}
    </div>
  );
}

function GuruCard({ guru }: { guru: (typeof guruList)[0] }) {
  return (
    <div className="group flex flex-row items-center gap-4 rounded-2xl border border-border/60 bg-background/70 backdrop-blur-sm p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:border-green-500/30">
      {/* Foto */}
      <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-green-500/50 transition-all duration-300">
        <Image
          src={guru.image}
          alt={guru.nama}
          fill
          className="object-cover"
          onError={(e) => {
            // handled by fallback div below
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        <AvatarFallback nama={guru.nama} />
      </div>

      {/* Teks */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground leading-tight line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
          {guru.nama}
        </p>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{guru.jabatan}</p>
      </div>
    </div>
  );
}

export function ManajemenSekolah() {
  return (
    <section id="manajemen" className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <FadeIn className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-600 dark:text-green-400">
            Tim Pengajar
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Manajemen Sekolah
          </h2>
          <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl/relaxed">
            Kenali para pendidik dan tenaga kependidikan yang berdedikasi membimbing generasi terbaik di SDIT Fajar.
          </p>
        </FadeIn>

        {/* Grid Card */}
        <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {guruList.map((guru, index) => (
            <FadeIn key={index}>
              <GuruCard guru={guru} />
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
