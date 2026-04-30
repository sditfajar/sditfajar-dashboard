"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Subject } from "@/lib/firebase/pembelajaran";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, BookOpen } from "lucide-react";

export default function GuruMapelPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mengambil data secara real-time dari koleksi 'subjects' (mapel)
    const q = query(collection(db, "subjects"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Subject)
        );
        // Urutkan di memory: pertama berdasarkan kelas, lalu nama mapel
        data.sort((a, b) => {
          if (a.kategori_kelas === b.kategori_kelas) {
            return a.nama_mapel.localeCompare(b.nama_mapel);
          }
          return a.kategori_kelas.localeCompare(b.kategori_kelas);
        });
        setSubjects(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Gagal mengambil data mapel:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper untuk membuat mock Kode Mapel dari nama dan kelas
  const getKodeMapel = (nama: string, kelas: string) => {
    const prefix = nama.substring(0, 3).toUpperCase();
    return `${prefix}-${kelas}`;
  };

  return (
    <div className="w-full overflow-hidden space-y-6">
      <FadeIn className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Daftar Mata Pelajaran</h1>
        <p className="text-sm text-muted-foreground">
          Berikut adalah daftar mata pelajaran yang terdaftar di sistem sekolah.
        </p>
      </FadeIn>

      <FadeIn className="w-full flex flex-col flex-1 rounded-lg border shadow-sm p-4 sm:p-6 bg-white dark:bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        {/* Wrapper overflow-x-auto agar tabel responsif di HP */}
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px] text-center">No</TableHead>
                <TableHead>Kode Mapel</TableHead>
                <TableHead>Nama Mata Pelajaran</TableHead>
                <TableHead>Keterangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Memuat data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : subjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <BookOpen className="h-10 w-10 opacity-20" />
                      <span>Belum ada mata pelajaran.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                subjects.map((mapel, index) => (
                  <TableRow 
                    key={mapel.id} 
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs bg-muted/30">
                        {getKodeMapel(mapel.nama_mapel, mapel.kategori_kelas)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{mapel.nama_mapel}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Kelas {mapel.kategori_kelas}</span>
                        <span className="text-muted-foreground text-xs">•</span>
                        <Badge 
                          variant={mapel.tipe === "Umum" ? "default" : "secondary"} 
                          className="text-xs font-medium"
                        >
                          {mapel.tipe}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </FadeIn>
    </div>
  );
}
