"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarCheck, Mail, ArrowUpRight, UploadCloud, MessageSquare } from "lucide-react";
import { getKontenBerita } from "@/lib/firebase/konten";
import { getPesanKontak } from "@/lib/firebase/pesan";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BULAN_AKADEMIK = [
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni"
];

export default function DashboardPage() {
  const [totalKonten, setTotalKonten] = useState(0);
  const [unreadPesan, setUnreadPesan] = useState(0);
  const [keuanganData, setKeuanganData] = useState<any[]>([]);
  const [kontenList, setKontenList] = useState<any[]>([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const konten = await getKontenBerita();
        setTotalKonten(konten.length);
        setKontenList(konten);
        const pesan = await getPesanKontak();
        setUnreadPesan(pesan.filter(p => p.status === "belum_dibaca").length);
      } catch (error) {
        console.error("Gagal memuat statistik", error);
      }
    };
    loadStats();

    // Subscribe to keuangan collection for real-time charts
    const unsub = onSnapshot(collection(db, "keuangan"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setKeuanganData(data);
    });

    return () => unsub();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentSemester = currentMonth >= 6 ? "Ganjil" : "Genap";

  const sppChartData = useMemo(() => {
    const counts = BULAN_AKADEMIK.map((bulan) => ({
      name: bulan.substring(0, 3),
      total: 0,
      fullMonthName: bulan
    }));

    keuanganData.forEach((k) => {
      k.tagihanBulanan?.forEach((tb: any) => {
        if (tb.status === "Lunas") {
          const idx = counts.findIndex((c) => c.fullMonthName === tb.bulan);
          if (idx !== -1) {
            counts[idx].total += tb.nominal;
          }
        }
      });
    });

    return counts;
  }, [keuanganData]);

  const semesterChartData = useMemo(() => {
    let lunas = 0;
    let belumLunas = 0;

    keuanganData.forEach((k) => {
      const currentSemesterData = k.tagihanSemesteran?.find((ts: any) => ts.semester === currentSemester);
      if (currentSemesterData) {
        if (currentSemesterData.status === "Lunas") lunas++;
        else belumLunas++;
      } else {
        belumLunas++;
      }
    });

    return [
      { name: "Lunas", value: lunas, color: "hsl(var(--primary))" },
      { name: "Belum Lunas", value: belumLunas, color: "hsl(var(--destructive))" }
    ];
  }, [keuanganData, currentSemester]);

  const newsChartData = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    const counts = months.map(m => ({ name: m, count: 0 }));

    kontenList.forEach(item => {
      if (item.tanggal) {
        const date = new Date(item.tanggal);
        const monthIdx = date.getMonth();
        if (monthIdx >= 0 && monthIdx < 12) {
          counts[monthIdx].count++;
        }
      }
    });

    return counts;
  }, [kontenList]);

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
    <div className="w-full overflow-x-hidden px-0 md:px-8 space-y-8">
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
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 to-green-600/5 p-8 border border-green-500/20 h-full transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 text-green-500/10 group-hover:text-green-500/20 transition-colors">
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
                  <div className="p-3 bg-green-500 text-white rounded-2xl shadow-lg shadow-green-500/30">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
                <div className="mt-8">
                  <h3 className="text-4xl font-black text-green-600 dark:text-green-400">{totalKonten}</h3>
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

        {/* 4. Financial Charts */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SPP Bulanan Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Tren SPP Bulanan (Lunas)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sppChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                      <YAxis
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        stroke="hsl(var(--muted-foreground))"
                        tickFormatter={(value) => `Rp${value / 1000}k`}
                      />
                      <RechartsTooltip
                        cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                        formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value) || 0)}
                        labelStyle={{ color: 'black' }}
                      />
                      <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tagihan Semester Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Rasio Tagihan Semester ({currentSemester})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={semesterChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {semesterChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: any) => [value + " Siswa"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* 5. News Publication Activity Chart */}
        <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-3">
          <Card className="shadow-sm border-green-500/20 bg-green-500/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Aktivitas Publikasi Berita</CardTitle>
                <p className="text-xs text-muted-foreground">Jumlah konten berita yang dipublikasikan per bulan.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 gap-2" asChild>
                  <Link href="/konten">
                    <UploadCloud className="h-4 w-4" />
                    Upload
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={newsChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                    <XAxis 
                      dataKey="name" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      stroke="hsl(var(--muted-foreground))" 
                    />
                    <YAxis
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      allowDecimals={false}
                    />
                    <RechartsTooltip
                      cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                      contentStyle={{ borderRadius: "8px", border: "1px solid rgba(34, 197, 94, 0.2)" }}
                      formatter={(value: any) => [value + " Berita", "Jumlah"]}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(142, 71%, 45%)" // Green-500 equivalent
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
