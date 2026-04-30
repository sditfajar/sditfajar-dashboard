"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon, Download, Search, Loader2, RotateCcw } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import * as XLSX from "xlsx";
import { DateRange } from "react-day-picker";

import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
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

  // Real-time listener using onSnapshot
  useEffect(() => {
    setIsLoading(true);

    let q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));

    if (date?.from) {
      const start = new Date(date.from);
      start.setHours(0, 0, 0, 0);
      q = query(q, where("timestamp", ">=", Timestamp.fromDate(start)));
    }

    if (date?.to) {
      const end = new Date(date.to);
      end.setHours(23, 59, 59, 999);
      q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const records: TeacherAttendance[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            ...d,
            id: doc.id,
            timestamp: d.timestamp ? (d.timestamp as Timestamp).toDate() : new Date(),
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

  const toDate = (ts: any): Date => ts instanceof Date ? ts : ts.toDate();

  const handleExport = () => {
    const excelData = filteredData.map((row) => ({
      "Waktu Absen": format(toDate(row.timestamp), "dd MMM yyyy HH:mm:ss", { locale: id }),
      "Nama Guru": row.teacherName,
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
              className="pl-8"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
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

        <Button onClick={handleExport} className="gap-2 w-full sm:w-auto" disabled={filteredData.length === 0}>
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[180px]">Waktu Absen</TableHead>
                <TableHead className="min-w-[200px]">Nama Guru</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jarak dari Sekolah</TableHead>
                <TableHead className="text-right">Aksi Peta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm font-medium animate-pulse">Memuat laporan absensi...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Tidak ada data absensi guru pada rentang tanggal tersebut.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => {
                  const dateObj = toDate(row.timestamp);
                  return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(dateObj, "dd MMM yyyy", { locale: id })} <br/>
                      <span className="text-muted-foreground text-xs">{format(dateObj, "HH:mm:ss", { locale: id })} WIB</span>
                    </TableCell>
                    <TableCell>{row.teacherName}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium", 
                        row.distance <= 1.0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {row.distance.toFixed(3)} km
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
                )})
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
