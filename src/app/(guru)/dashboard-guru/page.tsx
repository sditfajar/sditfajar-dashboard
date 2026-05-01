"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import {
  MapPinCheck,
  Calendar,
  BookOpen,
  ClipboardList,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

interface MenuCard {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  badge?: string;
}

const menuCards: MenuCard[] = [
  {
    title: "Absensi Guru",
    description: "Lakukan absensi masuk & pulang menggunakan sistem geofencing sekolah.",
    href: "/absensi-guru",
    icon: MapPinCheck,
    gradient: "from-emerald-500/10 via-green-500/5 to-transparent",
    iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    badge: "Real-time",
  },
  {
    title: "Jadwal Mengajar",
    description: "Lihat jadwal pelajaran dan kelas yang Anda ampu pada semester ini.",
    href: "/jadwal-guru",
    icon: Calendar,
    gradient: "from-blue-500/10 via-sky-500/5 to-transparent",
    iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Mata Pelajaran",
    description: "Daftar mata pelajaran yang Anda ajar beserta kurikulum dan silabus.",
    href: "/mapel-guru",
    icon: BookOpen,
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Absensi Siswa",
    description: "Input dan rekap kehadiran siswa secara langsung per kelas per hari.",
    href: "/absensi-siswa",
    icon: ClipboardList,
    gradient: "from-orange-500/10 via-amber-500/5 to-transparent",
    iconBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
    badge: "Input Harian",
  },
];

export default function DashboardGuruPage() {
  const [guruName, setGuruName] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [greeting, setGreeting] = useState("Selamat Datang");

  // Real-time clock
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setGreeting("Selamat Pagi");
    else if (hour >= 11 && hour < 15) setGreeting("Selamat Siang");
    else if (hour >= 15 && hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  // Fetch guru name
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const cached = sessionStorage.getItem(`profile_${user.uid}`);
        if (cached) {
          setGuruName(JSON.parse(cached).displayName || user.displayName || "Guru");
          return;
        }
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setGuruName(snap.data().name || user.displayName || "Guru");
        } else {
          setGuruName(user.displayName || "Guru");
        }
      } catch {
        setGuruName(user.displayName || "Guru");
      }
    });
    return () => unsub();
  }, []);

  const today = currentTime
    ? currentTime.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const timeStr = currentTime
    ? currentTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).replace(/\./g, ":")
    : "";

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 min-h-screen">
      {/* Header Section */}
      <FadeIn className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/8 via-background to-muted/30 p-6 md:p-8 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.08)_0%,_transparent_60%)]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Portal Guru — SDIT Fajar
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {greeting},{" "}
              <span className="text-primary">{guruName || "Guru"}</span> 👋
            </h1>
            <p className="text-sm text-muted-foreground">{today}</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-background/80 backdrop-blur px-4 py-3 shadow-sm self-start sm:self-auto">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xl font-mono font-bold text-primary tracking-widest tabular-nums">
              {timeStr}
            </span>
          </div>
        </div>
      </FadeIn>

      {/* Section Title */}
      <FadeIn delay={0.1}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Menu Utama
          </h2>
          <div className="flex-1 h-px bg-border" />
        </div>
      </FadeIn>

      {/* Menu Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {menuCards.map((card, i) => (
          <FadeIn key={card.href} delay={0.1 + i * 0.07}>
            <Link href={card.href} className="group block h-full">
              <div
                className={`
                  relative h-full rounded-xl border bg-gradient-to-br ${card.gradient} bg-background
                  p-5 shadow-sm
                  transition-all duration-300 ease-out
                  hover:shadow-md hover:-translate-y-1 hover:border-primary/30
                  hover:bg-gradient-to-br cursor-pointer
                  overflow-hidden
                `}
              >
                {/* Shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,_hsl(var(--primary)/0.06)_0%,_transparent_70%)]" />

                {/* Badge */}
                {card.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {card.badge}
                  </span>
                )}

                <div className="relative space-y-4">
                  {/* Icon */}
                  <div
                    className={`
                      inline-flex items-center justify-center w-11 h-11 rounded-xl ${card.iconBg}
                      transition-all duration-300
                      group-hover:scale-110 group-hover:shadow-sm
                    `}
                  >
                    <card.icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[-6deg]" />
                  </div>

                  {/* Text */}
                  <div className="space-y-1.5">
                    <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors duration-200">
                      {card.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-end">
                    <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground/60 group-hover:text-primary transition-all duration-200 translate-x-0 group-hover:translate-x-0.5">
                      Buka
                      <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>

      {/* Quick Info Strip */}
      <FadeIn delay={0.45}>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Tahun Ajaran", value: "2025 / 2026" },
            { label: "Semester", value: "Genap" },
            { label: "Status Anda", value: "Aktif Mengajar", accent: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3"
            >
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span
                className={`text-xs font-semibold ${
                  item.accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
