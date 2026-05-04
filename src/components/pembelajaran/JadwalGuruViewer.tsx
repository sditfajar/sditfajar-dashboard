"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Calendar as CalendarIcon, MapPin, Clock, Download } from "lucide-react";
import { Schedule, getSchedulesByTeacher } from "@/lib/firebase/pembelajaran";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { Fragment } from "react";

const hariOrder: Record<string, number> = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 7
};

export function JadwalGuruViewer() {
  const [data, setData] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [guruId, setGuruId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGuruId(user.uid);
      } else {
        setErrorMsg("Sesi login tidak ditemukan. Harap login kembali.");
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (guruId) {
      const fetchJadwal = async () => {
        setIsLoading(true);
        try {
          const schedules = await getSchedulesByTeacher(guruId);
          setData(schedules);
        } catch (error) {
          console.error("Gagal mengambil jadwal guru:", error);
          setErrorMsg("Terjadi kesalahan saat memuat jadwal.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchJadwal();
    }
  }, [guruId]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return item.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mapelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hari.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery]);

  // Group by Hari for Guru view
  const groupedData = useMemo(() => {
    const groups: Record<string, Schedule[]> = {};
    filteredData.forEach((jadwal) => {
      const hari = jadwal.hari;
      if (!groups[hari]) {
        groups[hari] = [];
      }
      groups[hari].push(jadwal);
    });

    Object.keys(groups).forEach(hari => {
      groups[hari].sort((a, b) => a.jamMulai.localeCompare(b.jamMulai));
    });

    return groups;
  }, [filteredData]);

  const handleDownload = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow || !printRef.current) return;

    const tableHTML = printRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Jadwal Mengajar Saya - SDIT Fajar</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #111; }
            h2 { font-size: 18px; margin-bottom: 4px; }
            p { font-size: 13px; color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-weight: 600; border: 1px solid #e5e7eb; }
            td { padding: 7px 12px; border: 1px solid #e5e7eb; white-space: nowrap; }
            .group-row td { background: #eff6ff; font-weight: 600; color: #2563eb; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h2>Jadwal Mengajar Saya</h2>
          <p>SDIT Fajar &mdash; Dicetak pada ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
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

  if (errorMsg) {
    return (
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-destructive font-medium">{errorMsg}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: Search + Download */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari hari, kelas, atau mapel..."
            className="pl-8 pr-8 text-xs sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          onClick={handleDownload}
          disabled={isLoading || filteredData.length === 0}
          className="shrink-0 bg-green-600 hover:bg-green-700 text-white gap-2 text-xs sm:text-sm"
        >
          <Download className="h-4 w-4" />
          Download Jadwal
        </Button>
      </div>

      {/* Scrollable table */}
      <div className="w-full overflow-x-auto rounded-md border bg-white dark:bg-zinc-950 shadow-sm">
        {/* Hidden div used for print content */}
        <div ref={printRef} className="hidden">
          <table>
            <thead>
              <tr>
                <th>Hari</th>
                <th>Waktu</th>
                <th>Kelas</th>
                <th>Mata Pelajaran</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedData)
                .sort(([hariA], [hariB]) => (hariOrder[hariA] || 99) - (hariOrder[hariB] || 99))
                .map(([hari, jadwalList]) => (
                  <Fragment key={hari}>
                    <tr className="group-row">
                      <td colSpan={4}>📅 Jadwal Hari {hari}</td>
                    </tr>
                    {jadwalList.map((jadwal) => (
                      <tr key={jadwal.id}>
                        <td>{jadwal.hari}</td>
                        <td>{jadwal.jamMulai} - {jadwal.jamSelesai}</td>
                        <td>Kelas {jadwal.kelas}</td>
                        <td>{jadwal.mapelName}</td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
            </tbody>
          </table>
        </div>

        {/* Visible table */}
        <Table className="text-xs sm:text-sm">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Hari</TableHead>
              <TableHead className="whitespace-nowrap">Waktu</TableHead>
              <TableHead className="whitespace-nowrap">Kelas</TableHead>
              <TableHead className="whitespace-nowrap">Mapel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Memuat jadwal Anda...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  Tidak ada jadwal mengajar yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedData)
                .sort(([hariA], [hariB]) => (hariOrder[hariA] || 99) - (hariOrder[hariB] || 99))
                .map(([hari, jadwalList]) => (
                  <Fragment key={hari}>
                    <TableRow className="bg-primary/5 hover:bg-primary/5">
                      <TableCell colSpan={4} className="font-semibold text-xs sm:text-sm py-3 text-primary">
                        <span className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 shrink-0" />
                          <span className="whitespace-nowrap">Jadwal Hari {hari}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                    {jadwalList.map((jadwal) => (
                      <TableRow key={jadwal.id}>
                        <TableCell className="whitespace-nowrap font-medium text-muted-foreground pl-8">
                          {jadwal.hari}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            {jadwal.jamMulai} - {jadwal.jamSelesai}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-semibold">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            Kelas {jadwal.kelas}
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap font-medium">
                          {jadwal.mapelName}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
