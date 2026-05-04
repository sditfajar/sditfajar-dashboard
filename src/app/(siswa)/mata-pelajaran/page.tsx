"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { getSubjectsByKategori, Subject } from "@/lib/firebase/pembelajaran";
import { FadeIn } from "@/components/ui/fade-in";
import { SubjectCard } from "@/components/pembelajaran/SubjectCard";
import { Loader2, BookOpen, GraduationCap } from "lucide-react";

export default function MataPelajaranSiswaPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
          const kategori = kelas.match(/\d+/)?.[0] || kelas;
          const data = await getSubjectsByKategori(kategori);
          setSubjects(data);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    });
    
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Mata Pelajaran</h1>
            <p className="text-muted-foreground mt-1">
              Daftar mata pelajaran yang Anda pelajari di Kelas {studentKelas || "-"}.
            </p>
          </div>
          <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl border border-green-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </FadeIn>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-green-600" />
          <p className="text-muted-foreground font-medium animate-pulse">Memuat data pelajaran...</p>
        </div>
      ) : subjects.length === 0 ? (
        <FadeIn className="text-center py-20 border rounded-3xl bg-muted/30">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground">
            {studentKelas 
              ? `Belum ada mata pelajaran terdaftar untuk Kelas ${studentKelas}.`
              : "Data kelas Anda tidak ditemukan. Silakan hubungi admin."}
          </p>
        </FadeIn>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject, index) => (
            <FadeIn key={subject.id} delay={index * 0.05}>
              <SubjectCard
                title={subject.nama_mapel}
                description={`Tersedia untuk kategori Kelas ${subject.kategori_kelas}`}
                badgeText={subject.tipe}
                badgeVariant={subject.tipe === "Agama" ? "outline" : "default"}
                badgeClassName={subject.tipe === "Agama" ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" : undefined}
                href={`#`}
                role="siswa"
                actionText="Lihat Materi"
                disabled={false}
              />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
