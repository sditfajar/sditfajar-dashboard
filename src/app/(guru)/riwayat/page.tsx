"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  setMonth,
  setYear,
  differenceInMinutes,
  isWeekend
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { onAuthStateChanged, User } from "firebase/auth";
import { TeacherAttendance } from "@/lib/firebase/guru-absensi";

export default function RiwayatBulananPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [history, setHistory] = useState<TeacherAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "M")); // 1-12
  const [selectedYear, setSelectedYear] = useState<string>(format(new Date(), "yyyy"));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const monthIdx = parseInt(selectedMonth) - 1;
    const year = parseInt(selectedYear);

    const start = startOfMonth(setYear(setMonth(new Date(), monthIdx), year));
    const end = endOfMonth(start);

    const q = query(
      collection(db, "absensi_guru"),
      where("uid", "==", currentUser.uid),
      where("timestamp", ">=", Timestamp.fromDate(start)),
      where("timestamp", "<=", Timestamp.fromDate(end)),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const toDate = (val: any) => val instanceof Timestamp ? val.toDate() : val;
        return {
          ...data,
          id: docSnap.id,
          waktu_masuk: toDate(data.waktu_masuk),
          waktu_pulang: toDate(data.waktu_pulang),
          timestamp: toDate(data.timestamp),
        } as TeacherAttendance;
      });
      setHistory(records);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching monthly history:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, selectedMonth, selectedYear]);

  // Generate all days in selected month for display
  const monthIdx = parseInt(selectedMonth) - 1;
  const year = parseInt(selectedYear);
  const monthStart = startOfMonth(setYear(setMonth(new Date(), monthIdx), year));
  const monthEnd = endOfMonth(monthStart);
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  const calculateDuration = (masuk: Date | null, pulang: Date | null) => {
    if (!masuk || !pulang) return null;
    const diff = differenceInMinutes(pulang, masuk);
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${hours}j ${mins}m`;
  };

  return (
    <div className="container mx-auto p-0 md:p-2 lg:p-2 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/absensi-guru">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Riwayat Absensi Bulanan</h1>
          <p className="text-muted-foreground text-sm">Lihat detail kehadiran Anda setiap bulannya.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 space-y-0">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <CardTitle>Filter Riwayat</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Tahun" />
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
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="min-w-[160px]">Hari/Tanggal</TableHead>
                  <TableHead>Jam Masuk</TableHead>
                  <TableHead>Jam Keluar</TableHead>
                  <TableHead className="text-right">Durasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memuat data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : history.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Tidak ada riwayat absensi untuk bulan ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  allDays.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const record = history.find(r => r.dateString === dateStr);
                    const isTodayWeekend = isWeekend(day);
                    const isSaturday = day.getDay() === 6;
                    const isSunday = day.getDay() === 0;
                    const weekendHighlight = isSaturday || isSunday;

                    return (
                      <TableRow
                        key={dateStr}
                        className={weekendHighlight ? "bg-red-500/10" : ""}
                      >
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(day, "EEEE, dd/MM/yyyy", { locale: id })}
                        </TableCell>

                        {isTodayWeekend ? (
                          <TableCell colSpan={3} className="text-center">
                            <Badge variant="destructive" className="bg-red-500/10 text-red-600 border-none shadow-none font-medium">
                              Libur
                            </Badge>
                          </TableCell>
                        ) : (
                          <>
                            <TableCell>
                              {record?.waktu_masuk ? format(record.waktu_masuk, "HH:mm") : "—"}
                            </TableCell>
                            <TableCell>
                              {record?.waktu_pulang ? (
                                format(record.waktu_pulang, "HH:mm")
                              ) : record?.waktu_masuk ? (
                                <span className="text-muted-foreground text-xs italic">Belum Pulang</span>
                              ) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {calculateDuration(record?.waktu_masuk || null, record?.waktu_pulang || null) || "—"}
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
