"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { getSchedulesByKelas, Schedule } from "@/lib/firebase/pembelajaran";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, Calendar, Clock, MapPin, User, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function JadwalPelajaranSiswaPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentKelas, setStudentKelas] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      
      try {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        let kelas = "";
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          kelas = userData.kelas || "";
          
          if (!kelas && user.email) {
            const nisn = user.email.split("@")[0];
            const siswaDocSnap = await getDoc(doc(db, "siswa", nisn));
            if (siswaDocSnap.exists()) {
              kelas = siswaDocSnap.data().kelas || "";
            }
          }
        }
        
        setStudentKelas(kelas);
        
        if (kelas) {
          const data = await getSchedulesByKelas(kelas);
          const hariOrder = { "Senin": 1, "Selasa": 2, "Rabu": 3, "Kamis": 4, "Jumat": 5, "Sabtu": 6 };
          data.sort((a, b) => {
            if (a.hari !== b.hari) {
              return (hariOrder[a.hari as keyof typeof hariOrder] || 99) - (hariOrder[b.hari as keyof typeof hariOrder] || 99);
            }
            return a.jamMulai.localeCompare(b.jamMulai);
          });
          setSchedules(data);
        }
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => unsub();
  }, []);

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.hari]) acc[schedule.hari] = [];
    acc[schedule.hari].push(schedule);
    return acc;
  }, {} as Record<string, Schedule[]>);

  const hariOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const sortedDays = Object.keys(groupedSchedules).sort(
    (a, b) => hariOrder.indexOf(a) - hariOrder.indexOf(b)
  );

  const getDayColors = (hari: string) => {
    switch(hari) {
      case "Senin": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400";
      case "Selasa": return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400";
      case "Rabu": return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-400";
      case "Kamis": return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400";
      case "Jumat": return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400";
      case "Sabtu": return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-400";
      default: return "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              Jadwal Pelajaran Kelas{" "}
              {studentKelas ? (
                <span>{studentKelas}</span>
              ) : (
                <span className="text-muted-foreground/50 text-2xl">...</span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Jadwal belajar kamu untuk Kelas {studentKelas || "-"}. Semangat belajar ya! 🚀
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl border border-blue-500/20 shadow-sm">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-blue-600 font-medium animate-pulse text-lg">Mencari jadwal belajarmu...</p>
        </div>
      ) : !studentKelas ? (
        <FadeIn className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/30">
          <div className="text-6xl mb-4">🤔</div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">Ups! Kelas Kamu Belum Terdaftar</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Sistem belum bisa menemukan kelas kamu. Silakan hubungi admin atau guru agar kamu bisa melihat jadwal pelajaran.
          </p>
        </FadeIn>
      ) : schedules.length === 0 ? (
        <FadeIn className="text-center py-20 border-2 border-dashed rounded-3xl bg-blue-50/50 dark:bg-blue-950/10">
          <div className="text-6xl mb-4">🎈</div>
          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-2">Hore! Belum Ada Jadwal</h3>
          <p className="text-blue-600/80 dark:text-blue-400/80 max-w-sm mx-auto">
            Jadwal pelajaran untuk Kelas {studentKelas} belum ditambahkan oleh Bapak/Ibu Guru. Main dulu yuk!
          </p>
        </FadeIn>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedDays.map((hari, dayIndex) => (
            <FadeIn key={hari} delay={dayIndex * 0.1}>
              <Card className={`overflow-hidden border-2 shadow-sm transition-all hover:shadow-md ${getDayColors(hari).replace('text-', 'hover:border-')}`}>
                <div className={`p-4 font-bold text-xl border-b flex items-center justify-between ${getDayColors(hari)}`}>
                  <span>{hari}</span>
                  <div className="bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm rounded-full p-1.5">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {groupedSchedules[hari].map((schedule, i) => (
                      <div key={schedule.id || i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="font-bold text-lg text-slate-800 dark:text-slate-200 flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                              {schedule.mapelName || "Pelajaran"}
                            </div>
                            <div className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                              <User className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                              {schedule.guruName || "Guru Belum Ditentukan"}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5" />
                              {schedule.jamMulai} - {schedule.jamSelesai}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              Kelas {schedule.kelas}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
