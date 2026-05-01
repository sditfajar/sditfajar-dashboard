"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { FileDown } from "lucide-react";

import { RekapAbsensi } from "@/types/absensi";
import {
  getRekapAbsensiBulanan,
  getActiveSiswa,
} from "@/lib/firebase/absensi";
import { Timestamp } from "firebase/firestore";

const months = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString());

interface ClassAuditInfo {
  submittedBy: string;
  updatedAt: Date | null;
}

export function AbsensiLaporan() {
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedKelas, setSelectedKelas] = useState("Semua");
  
  const [data, setData] = useState<RekapAbsensi[]>([]);
  const [classAuditMap, setClassAuditMap] = useState<Record<string, ClassAuditInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExport = () => {
    const excelData = filteredData.map((row) => ({
      "NISN": row.studentId,
      "Nama Siswa": row.nama,
      "Kelas": row.kelas,
      "Hadir": row.hadir,
      "Sakit": row.sakit,
      "Izin": row.izin,
      "Alpa": row.alpa,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Absensi");
    
    XLSX.writeFile(workbook, `Laporan_Absensi_Bulan_${selectedMonth}_Tahun_${selectedYear}.xlsx`);
    
    setIsExportOpen(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const activeSiswa = await getActiveSiswa();
      const monthStr = selectedMonth.padStart(2, "0");
      const monthYear = `${monthStr}-${selectedYear}`;
      
      const absensiData = await getRekapAbsensiBulanan(monthYear);

      // Build audit trail per class: find the latest updatedAt per kelas
      const auditMap: Record<string, ClassAuditInfo> = {};
      absensiData.forEach((a: any) => {
        const kelas = a.kelas;
        if (!kelas) return;
        
        const submittedBy = a.submittedBy || "";
        let updatedAt: Date | null = null;
        
        if (a.updatedAt) {
          updatedAt = a.updatedAt instanceof Date 
            ? a.updatedAt 
            : (a.updatedAt as Timestamp).toDate();
        }

        if (!auditMap[kelas]) {
          auditMap[kelas] = { submittedBy, updatedAt };
        } else {
          // Keep the latest updatedAt per class
          if (updatedAt && (!auditMap[kelas].updatedAt || updatedAt > auditMap[kelas].updatedAt!)) {
            auditMap[kelas] = { submittedBy, updatedAt };
          }
        }
      });
      setClassAuditMap(auditMap);

      const rekap: RekapAbsensi[] = activeSiswa.map((siswa) => {
        const studentAbsensi = absensiData.filter((a) => a.studentId === siswa.nisn);
        
        let hadir = 0, sakit = 0, izin = 0, alpa = 0;
        studentAbsensi.forEach((a) => {
          if (a.status === "Hadir") hadir++;
          if (a.status === "Sakit") sakit++;
          if (a.status === "Izin") izin++;
          if (a.status === "Alpa") alpa++;
        });

        return {
          studentId: siswa.nisn,
          nama: siswa.namaLengkap,
          kelas: siswa.kelas,
          hadir,
          sakit,
          izin,
          alpa,
        };
      });

      setData(rekap);
    } catch (error) {
      console.error("Failed to load rekap:", error);
      alert("Gagal memuat rekapitulasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableClasses = Array.from(new Set(data.map((d) => d.kelas))).sort();
  const filteredData = selectedKelas === "Semua" ? data : data.filter((d) => d.kelas === selectedKelas);

  // Group filtered data by class for display
  const groupedByClass = filteredData.reduce((acc, row) => {
    if (!acc[row.kelas]) acc[row.kelas] = [];
    acc[row.kelas].push(row);
    return acc;
  }, {} as Record<string, RekapAbsensi[]>);

  const sortedClasses = Object.keys(groupedByClass).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Bulan:</span>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Pilih Bulan" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, idx) => (
                <SelectItem key={m} value={(idx + 1).toString()}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Tahun:</span>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Kelas:</span>
          <Select value={selectedKelas} onValueChange={setSelectedKelas}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semua">Semua Kelas</SelectItem>
              {availableClasses.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Kelas {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </div>

        <Button variant="outline" onClick={() => setIsExportOpen(true)} className="gap-2 bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300" disabled={filteredData.length === 0}>
          <FileDown className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {isLoading ? (
        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="h-40 flex flex-col items-center justify-center space-y-4 text-muted-foreground">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium animate-pulse">Memuat laporan...</p>
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="border rounded-lg overflow-hidden bg-background">
          <div className="h-24 flex items-center justify-center text-muted-foreground">
            Tidak ada data siswa.
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedClasses.map((cls) => {
            const classStudents = groupedByClass[cls];
            const audit = classAuditMap[cls];

            return (
              <div key={cls} className="border rounded-lg overflow-hidden bg-background">
                <div className="bg-muted/50 px-4 py-2 border-b">
                  <h3 className="font-semibold text-sm">Kelas {cls}</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">NISN</TableHead>
                        <TableHead className="min-w-[150px]">Nama Siswa</TableHead>
                        <TableHead className="text-center text-green-600">Hadir</TableHead>
                        <TableHead className="text-center text-blue-600">Sakit</TableHead>
                        <TableHead className="text-center text-yellow-600">Izin</TableHead>
                        <TableHead className="text-center text-red-600">Alpa</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classStudents.map((row) => (
                        <TableRow key={row.studentId}>
                          <TableCell className="font-medium">{row.studentId}</TableCell>
                          <TableCell>{row.nama}</TableCell>
                          <TableCell className="text-center font-medium">{row.hadir}</TableCell>
                          <TableCell className="text-center font-medium">{row.sakit}</TableCell>
                          <TableCell className="text-center font-medium">{row.izin}</TableCell>
                          <TableCell className="text-center font-medium">{row.alpa}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Audit Trail Info */}
                {audit && audit.submittedBy && (
                  <div className="px-4 py-2 border-t bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                      Data kelas ini diinput oleh: <span className="font-medium text-foreground/70">{audit.submittedBy}</span>
                      {audit.updatedAt && (
                        <> pada <span className="font-medium text-foreground/70">{format(audit.updatedAt, "dd MMM yyyy, HH:mm", { locale: id })} WIB</span></>
                      )}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Export</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin mengexport data laporan absensi ini ke format file Excel (.xlsx)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>
              Tidak
            </Button>
            <Button onClick={handleExport}>
              Yakin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
