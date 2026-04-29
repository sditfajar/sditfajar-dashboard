"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Newspaper, CalendarCheck, Mail, Users, ArrowUpRight, UploadCloud, BarChart3, MessageSquare } from "lucide-react";
import { getKontenBerita } from "@/lib/firebase/konten";
import { getPesanKontak } from "@/lib/firebase/pesan";

export default function DashboardPage() {
  const [totalKonten, setTotalKonten] = useState(0);
  const [unreadPesan, setUnreadPesan] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const konten = await getKontenBerita();
        setTotalKonten(konten.length);
        const pesan = await getPesanKontak();
        setUnreadPesan(pesan.filter(p => p.status === "belum_dibaca").length);
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      }
    };
    loadStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full overflow-x-hidden px-4 md:px-8 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Admin</h1>
          <p className="text-muted-foreground mt-1">
            Ringkasan data operasional dan aktivitas SDIT Fajar.
          </p>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* 1. Manajemen Konten Card */}
        <motion.div variants={itemVariants}>
          <Link href="/konten" className="group block h-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-8 border border-blue-500/20 h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
                <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8l-4 4v14a2 2 0 0 0 2 2z"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
                  />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-500/30">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
                <div className="mt-8">
                  <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400">{totalKonten}</h3>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Konten Berita</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 2. Pesan Kontak Card */}
        <motion.div variants={itemVariants}>
          <Link href="/pesan" className="group block h-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-8 border border-amber-500/20 h-full transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1">
              <div className="absolute -right-2 -bottom-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                >
                  <Mail width="160" height="160" strokeWidth="1" />
                </motion.div>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-start justify-between">
                  <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-500/30">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-amber-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
                <div className="mt-8">
                  <h3 className="text-4xl font-black text-amber-600 dark:text-amber-400">
                    {unreadPesan}
                    <span className="text-lg font-medium text-muted-foreground ml-2">Baru</span>
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Inbox Pesan</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 3. Manajemen Absensi Typography */}
        <motion.div variants={itemVariants}>
          <Link href="/absensi" className="group block h-full">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-8 border border-emerald-500/20 h-full transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <motion.svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <motion.rect x="3" y="4" width="18" height="18" rx="2" ry="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <motion.path d="M9 16l2 2 4-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.svg>
              </div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                <CalendarCheck className="w-12 h-12 text-emerald-500 mb-4 group-hover:scale-110 transition-transform duration-500" />
                <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
                  Absensi Siswa
                </h2>
                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:underline">
                  Kelola Kehadiran <ArrowUpRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 4. Custom Chart Animation (Col Span 2) */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
          <div className="rounded-3xl bg-card border shadow-sm p-6 sm:p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold">Tren Pendaftar PPDB</h3>
                <p className="text-sm text-muted-foreground">Statistik pendaftaran bulanan (Dummy Data)</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>

            <div className="flex-1 relative min-h-[250px] w-full flex items-end justify-between gap-2 sm:gap-4 pt-10">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between z-0">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full h-[1px] bg-border/50" />
                ))}
              </div>

              {/* Animated Bars */}
              {[
                { month: "Jan", value: 30 },
                { month: "Feb", value: 45 },
                { month: "Mar", value: 80 },
                { month: "Apr", value: 65 },
                { month: "Mei", value: 100 },
                { month: "Jun", value: 50 },
                { month: "Jul", value: 20 },
              ].map((data, idx) => (
                <div key={data.month} className="relative flex flex-col items-center justify-end h-full z-10 w-full group">
                  <div className="absolute -top-8 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    {data.value} Siswa
                  </div>
                  <motion.div
                    className="w-full max-w-[40px] bg-gradient-to-t from-primary/50 to-primary rounded-t-md"
                    initial={{ height: 0 }}
                    animate={{ height: `${data.value}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.1, type: "spring", bounce: 0.3 }}
                  />
                  <span className="mt-3 text-xs font-medium text-muted-foreground">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
