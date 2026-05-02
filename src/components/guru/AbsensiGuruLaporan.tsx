"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Download, Search, Loader2, X, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  getDocs,
  writeBatch,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { TeacherAttendance } from "@/lib/firebase/guru-absensi";

const COLLECTION_NAME = "absensi_guru";

export function AbsensiGuruLaporan() {
  const [data, setData] = useState<TeacherAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetConfirmationText, setResetConfirmationText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  // Real-time listener using onSnapshot
  useEffect(() => {
    setIsLoading(true);

    const constraints = [];
    
    if (date?.from) {
      const start = new Date(date.from);
      start.setHours(0, 0, 0, 0);
      constraints.push(where("timestamp", ">=", Timestamp.fromDate(start)));
    }

    if (date?.to) {
      const end = new Date(date.to);
      end.setHours(23, 59, 59, 999);
      constraints.push(where("timestamp", "<=", Timestamp.fromDate(end)));
    }

    constraints.push(orderBy("timestamp", "desc"));

    const q = query(collection(db, COLLECTION_NAME), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: TeacherAttendance[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            ...d,
            id: docSnap.id,
            timestamp: d.timestamp ? (d.timestamp as Timestamp).toDate() : new Date(),
            waktu_masuk: d.waktu_masuk ? (d.waktu_masuk as Timestamp).toDate() : null,
            waktu_pulang: d.waktu_pulang ? (d.waktu_pulang as Timestamp).toDate() : null,
          } as TeacherAttendance;
        });
        setData(records);
        setIsLoading(false);
      },
      (error) => {
        console.error("Gagal memuat rekap absensi guru:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [date]);

  const toDate = (ts: any): Date => {
    if (!ts) return new Date();
    return ts instanceof Date ? ts : ts.toDate();
  };

  const formatTime = (ts: any): string => {
    if (!ts) return "—";
    const d = toDate(ts);
    return format(d, "HH:mm:ss", { locale: id });
  };

  const handleExport = () => {
    const excelData = filteredData.map((row) => ({
      "Tanggal": format(toDate(row.timestamp), "dd MMM yyyy", { locale: id }),
      "Nama Guru": row.teacherName,
      "Jam Masuk": formatTime(row.waktu_masuk),
      "Jam Pulang": formatTime(row.waktu_pulang),
      "Status": row.status,
      "Jarak (km)": row.distance.toFixed(3),
      "Lokasi (Lat, Lng)": `${row.latitude}, ${row.longitude}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi Guru");

    let filename = "Laporan_Absensi_Guru";
    if (date?.from) {
      filename += `_${format(date.from, "ddMMyyyy")}`;
      if (date?.to) {
        filename += `_sd_${format(date.to, "ddMMyyyy")}`;
      }
    }
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleResetAllData = async () => {
    if (resetConfirmationText !== "RESET") return;

    setIsResetting(true);
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.info("Data Kosong", { description: "Tidak ada data absensi untuk dihapus." });
        setIsResetting(false);
        setIsResetDialogOpen(false);
        return;
      }

      const docs = snapshot.docs;
      const batchSize = 500;

      // Delete in batches of 500
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = writeBatch(db);
        const chunk = docs.slice(i, i + batchSize);
        chunk.forEach((docSnap) => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }

      toast.success("Berhasil", { description: `${docs.length} data absensi telah dihapus secara permanen.` });
      setResetConfirmationText("");
      setIsResetDialogOpen(false);
    } catch (error) {
      console.error("Error resetting data:", error);
      toast.error("Gagal", { description: "Terjadi kesalahan saat menghapus data." });
    } finally {
      setIsResetting(false);
    }
  };

  const filteredData = data.filter((row) =>
    row.teacherName.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          {/* Pencarian Nama */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Nama Guru..."
              className="pl-8 pr-8"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            {searchName && (
              <button
                onClick={() => setSearchName("")}
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Date Range Picker */}
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[260px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pilih rentang tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Real-time indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">Real-time</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExport} className="gap-2 w-full sm:w-auto bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-white hover:shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300" disabled={filteredData.length === 0}>
            <Download className="h-4 w-4" />
            Export Excel
          </Button>

          <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2 w-full sm:w-auto bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300">
                <Trash2 className="h-4 w-4" />
                Reset Semua Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertDialogTitle>Hapus Semua Data Absensi?</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="space-y-3">
                  <p className="font-semibold text-foreground">Tindakan ini tidak bisa dibatalkan.</p>
                  <p>Semua riwayat absensi guru di dalam sistem akan dihapus secara permanen dari database.</p>
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-100 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm">
                    Ketik <strong>RESET</strong> di bawah ini untuk mengonfirmasi:
                  </div>
                  <Input
                    placeholder="Ketik RESET untuk konfirmasi"
                    value={resetConfirmationText}
                    onChange={(e) => setResetConfirmationText(e.target.value)}
                    className="mt-2"
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel onClick={() => setResetConfirmationText("")}>Batal</AlertDialogCancel>
                <Button
                  variant="destructive"
                  onClick={handleResetAllData}
                  disabled={resetConfirmationText !== "RESET" || isResetting}
                  className="gap-2"
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Hapus Permanen
                    </>
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[140px]">Tanggal</TableHead>
                <TableHead className="min-w-[180px]">Nama Guru</TableHead>
                <TableHead className="min-w-[100px]">Jam Masuk</TableHead>
                <TableHead className="min-w-[100px]">Jam Pulang</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jarak</TableHead>
                <TableHead className="text-right">Aksi Peta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium animate-pulse">Memuat laporan absensi...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    Tidak ada data absensi guru pada rentang tanggal tersebut.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => {
                  const dateObj = toDate(row.timestamp);
                  const hasMasuk = !!row.waktu_masuk;
                  const hasPulang = !!row.waktu_pulang;

                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(dateObj, "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell>{row.teacherName}</TableCell>
                      <TableCell>
                        {hasMasuk ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            {formatTime(row.waktu_masuk)} <span className="text-muted-foreground font-normal text-xs">WIB</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasPulang ? (
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {formatTime(row.waktu_pulang)} <span className="text-muted-foreground font-normal text-xs">WIB</span>
                          </span>
                        ) : (
                          <span className="text-amber-500 text-sm font-medium">Belum Pulang</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className={cn(
                            "text-white",
                            hasMasuk && hasPulang
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-amber-500 hover:bg-amber-600"
                          )}
                        >
                          {hasMasuk && hasPulang ? "Lengkap" : "Masuk"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          row.distance <= 0.1 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        )}>
                          {(row.distance * 1000).toFixed(0)}m
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          Lihat Peta
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
