"use client";

import { useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, BookOpen, Download } from "lucide-react";

export default function GuruMapelPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, "subjects"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Subject)
        );
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

  const getKodeMapel = (nama: string, kelas: string) => {
    const prefix = nama.substring(0, 3).toUpperCase();
    return `${prefix}-${kelas}`;
  };

  const handleDownload = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow || !printRef.current) return;

    const tableHTML = printRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daftar Mata Pelajaran - SDIT Fajar</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #111; }
            h2 { font-size: 18px; margin-bottom: 4px; }
            p { font-size: 13px; color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-weight: 600; border: 1px solid #e5e7eb; }
            td { padding: 7px 12px; border: 1px solid #e5e7eb; white-space: nowrap; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h2>Daftar Mata Pelajaran</h2>
          <p>SDIT Fajar &mdash; Dicetak pada ${new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="w-full overflow-hidden space-y-6">
      {/* Header + Download button */}
      <FadeIn className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">Daftar Mata Pelajaran</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Berikut adalah daftar mata pelajaran yang terdaftar di sistem sekolah.
          </p>
        </div>

        <Button
          onClick={handleDownload}
          disabled={isLoading || subjects.length === 0}
          className="shrink-0 bg-green-600 hover:bg-green-700 text-white gap-2 text-xs sm:text-sm self-start sm:self-auto"
        >
          <Download className="h-4 w-4" />
          Download Mapel
        </Button>
      </FadeIn>

      <FadeIn className="w-full flex flex-col flex-1 rounded-lg border shadow-sm p-4 sm:p-6 bg-white dark:bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        {/* Hidden table for print */}
        <div ref={printRef} className="hidden">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Kode Mapel</th>
                <th>Nama Mata Pelajaran</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((mapel, index) => (
                <tr key={mapel.id}>
                  <td>{index + 1}</td>
                  <td>{getKodeMapel(mapel.nama_mapel, mapel.kategori_kelas)}</td>
                  <td>{mapel.nama_mapel}</td>
                  <td>Kelas {mapel.kategori_kelas} • {mapel.tipe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visible scrollable table */}
        <div className="w-full overflow-x-auto rounded-md border">
          <Table className="text-xs sm:text-sm">
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px] sm:w-[80px] text-center whitespace-nowrap">No</TableHead>
                <TableHead className="whitespace-nowrap">Kode Mapel</TableHead>
                <TableHead className="whitespace-nowrap">Mapel</TableHead>
                <TableHead className="whitespace-nowrap">Keterangan</TableHead>
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
                    <TableCell className="text-center whitespace-nowrap font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant="outline" className="font-mono text-xs bg-muted/30">
                        {getKodeMapel(mapel.nama_mapel, mapel.kategori_kelas)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold">
                      {mapel.nama_mapel}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>Kelas {mapel.kategori_kelas}</span>
                        <span className="text-muted-foreground">•</span>
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
