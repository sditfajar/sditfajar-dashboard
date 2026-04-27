"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { SiswaWithAbsensi, AbsensiStatus } from "@/types/absensi";
import {
  getActiveSiswa,
  getAbsensiByDate,
  saveAbsensi,
  formatDateOnly,
  formatMonthYear,
} from "@/lib/firebase/absensi";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/success-dialog";

export function AbsensiInput() {
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<SiswaWithAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; title: string; description: string }>({
    open: false, title: "", description: "",
  });

  // Group by class
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.kelas]) {
      acc[student.kelas] = [];
    }
    acc[student.kelas].push(student);
    return acc;
  }, {} as Record<string, SiswaWithAbsensi[]>);

  const classes = Object.keys(groupedStudents).sort();

  useEffect(() => {
    loadData(date);
  }, [date]);

  const loadData = async (selectedDate: Date) => {
    setIsLoading(true);
    try {
      const activeSiswa = await getActiveSiswa();
      const dateStr = formatDateOnly(selectedDate);
      const existingAbsensi = await getAbsensiByDate(dateStr);

      const merged: SiswaWithAbsensi[] = activeSiswa.map((siswa) => {
        const abs = existingAbsensi.find((a) => a.studentId === siswa.nisn);
        return {
          ...siswa,
          absensiStatus: abs ? abs.status : "",
        };
      });

      setStudents(merged);
    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Gagal memuat data absensi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (nisn: string, status: AbsensiStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.nisn === nisn ? { ...s, absensiStatus: status } : s))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dateStr = formatDateOnly(date);
      const monthYear = formatMonthYear(date);

      const recordsToSave = students
        .filter((s) => s.absensiStatus !== "")
        .map((s) => ({
          studentId: s.nisn,
          nama: s.namaLengkap,
          kelas: s.kelas,
          status: s.absensiStatus,
          dateString: dateStr,
        }));

      await saveAbsensi(dateStr, monthYear, recordsToSave);
      toast.success("Absensi Tersimpan! ✅", {
        description: `Absensi tanggal ${dateStr} berhasil disimpan untuk ${recordsToSave.length} siswa.`,
      });
      setSuccessPopup({
        open: true,
        title: "Absensi Berhasil Disimpan!",
        description: `Data kehadiran tanggal ${dateStr} telah tersimpan untuk ${recordsToSave.length} siswa.`,
      });
    } catch (error) {
      console.error("Gagal menyimpan absensi:", error);
      toast.error("Gagal Menyimpan", {
        description: "Terjadi kesalahan saat menyimpan absensi. Silakan coba lagi.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">Pilih Tanggal:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={handleSave} disabled={isSaving || isWeekend}>
          {isSaving ? "Menyimpan..." : "Simpan Absensi"}
        </Button>
      </div>

      {isWeekend ? (
        <div className="p-8 text-center border rounded-lg bg-muted/50">
          <p className="text-muted-foreground">
            Hari Libur - Tidak ada jadwal absensi
          </p>
        </div>
      ) : isLoading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          Memuat data...
        </div>
      ) : (
        <div className="space-y-8">
          {classes.map((cls) => (
            <div key={cls} className="border rounded-lg overflow-hidden bg-background">
              <div className="bg-muted/50 px-4 py-2 border-b">
                <h3 className="font-semibold text-sm">Kelas {cls}</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] min-w-[100px]">NISN</TableHead>
                      <TableHead className="min-w-[150px]">Nama Siswa</TableHead>
                      <TableHead className="min-w-[300px]">Status Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedStudents[cls].map((siswa) => (
                      <TableRow key={siswa.nisn}>
                        <TableCell className="font-medium">{siswa.nisn}</TableCell>
                        <TableCell>{siswa.namaLengkap}</TableCell>
                        <TableCell>
                          <RadioGroup
                            className="flex items-center gap-4"
                            value={siswa.absensiStatus}
                            onValueChange={(val) =>
                              handleStatusChange(siswa.nisn, val as AbsensiStatus)
                            }
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Hadir" id={`H-${siswa.nisn}`} />
                              <Label htmlFor={`H-${siswa.nisn}`} className="font-normal cursor-pointer text-green-600">Hadir</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Sakit" id={`S-${siswa.nisn}`} />
                              <Label htmlFor={`S-${siswa.nisn}`} className="font-normal cursor-pointer text-blue-600">Sakit</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Izin" id={`I-${siswa.nisn}`} />
                              <Label htmlFor={`I-${siswa.nisn}`} className="font-normal cursor-pointer text-yellow-600">Izin</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Alpa" id={`A-${siswa.nisn}`} />
                              <Label htmlFor={`A-${siswa.nisn}`} className="font-normal cursor-pointer text-red-600">Alpa</Label>
                            </div>
                          </RadioGroup>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg">
              Tidak ada siswa aktif ditemukan.
            </div>
          )}
        </div>
      )}
      </div>

      <SuccessDialog
        open={successPopup.open}
        onOpenChange={(open) => setSuccessPopup((prev) => ({ ...prev, open }))}
        title={successPopup.title}
        description={successPopup.description}
      />
    </>
  );
}
