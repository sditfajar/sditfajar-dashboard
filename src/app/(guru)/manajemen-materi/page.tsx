"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getSchedulesByTeacher, Schedule } from "@/lib/firebase/pembelajaran";
import { FadeIn } from "@/components/ui/fade-in";
import { SubjectCard } from "@/components/pembelajaran/SubjectCard";
import { Loader2, Library, GraduationCap } from "lucide-react";

export default function ManajemenMateriPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      
      try {
        const data = await getSchedulesByTeacher(user.uid);
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching teacher schedules:", error);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => unsub();
  }, []);

  // Group schedules by Subject and Class to avoid duplicate cards for different days
  const uniqueSubjects = schedules.reduce((acc, current) => {
    const key = `${current.mapelId}-${current.kelas}`;
    if (!acc[key]) {
      acc[key] = current;
    }
    return acc;
  }, {} as Record<string, Schedule>);

  const subjectList = Object.values(uniqueSubjects);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Materi</h1>
            <p className="text-muted-foreground mt-1">
              Kelola materi pembelajaran untuk mata pelajaran yang Anda ampu.
            </p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/20">
            <Library className="w-6 h-6" />
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Memuat data...</p>
        </div>
      ) : subjectList.length === 0 ? (
        <FadeIn className="text-center py-20 border rounded-3xl bg-muted/30">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground font-medium">Anda belum memiliki jadwal mengajar terdaftar.</p>
          <p className="text-sm text-muted-foreground mt-1">Silakan hubungi admin untuk pengaturan jadwal.</p>
        </FadeIn>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjectList.map((schedule, index) => (
            <FadeIn key={schedule.id || `${schedule.mapelId}-${schedule.kelas}`} delay={index * 0.05}>
              <SubjectCard
                title={schedule.mapelName}
                description={`Mata Pelajaran: ${schedule.mapelName}`}
                badgeText={`Kelas ${schedule.kelas}`}
                href="#"
                role="guru"
                actionText="Kelola Materi"
                disabled={true}
              />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
