"use client";

import { useState, useEffect } from "react";
import { format, isToday as checkIsToday, isBefore, startOfToday } from "date-fns";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hadir": return "text-green-600 font-semibold";
    case "Sakit": return "text-blue-600 font-semibold";
    case "Izin": return "text-orange-600 font-semibold";
    case "Alpa": return "text-red-600 font-semibold";
    default: return "";
  }
};

export function AbsensiSiswaInput() {
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<SiswaWithAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; title: string; description: string }>({
    open: false, title: "", description: "",
  });
  const [selectedClass, setSelectedClass] = useState<string>("Semua");
  const [hasData, setHasData] = useState(false);
  const [forceInputWeekend, setForceInputWeekend] = useState(false);
  const [guruName, setGuruName] = useState<string>("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [keterangan, setKeterangan] = useState("");

  useEffect(() => {
    const savedClass = localStorage.getItem("last_selected_class");
    if (savedClass) {
      setSelectedClass(savedClass);
    } else {
      // Kunjungan pertama: default ke kelas pertama yang tersedia
      setSelectedClass("1A");
      localStorage.setItem("last_selected_class", "1A");
    }
  }, []);

  // Fetch guru name from auth session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const cachedProfile = sessionStorage.getItem(`profile_${user.uid}`);
        if (cachedProfile) {
          const p = JSON.parse(cachedProfile);
          setGuruName(p.displayName || user.displayName || "Guru");
        } else {
          try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              setGuruName(data.name || user.displayName || "Guru");
            } else {
              setGuruName(user.displayName || "Guru");
            }
          } catch {
            setGuruName(user.displayName || "Guru");
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    localStorage.setItem("last_selected_class", value);
  };

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
      setHasData(existingAbsensi.length > 0);
      setForceInputWeekend(false);

      if (existingAbsensi.length > 0) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }

      const merged: SiswaWithAbsensi[] = activeSiswa.map((siswa) => {
        const abs = existingAbsensi.find((a) => a.studentId === siswa.nisn);
        return {
          ...siswa,
          absensiStatus: abs ? abs.status : "Hadir",
          submittedBy: abs?.submittedBy,
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
    if (isLocked) return;
    setStudents((prev) =>
      prev.map((s) => (s.nisn === nisn ? { ...s, absensiStatus: status } : s))
    );
  };

  const handleSaveClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmSave = async () => {
    if (isLocked) return;
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
          keterangan: keterangan,
        }));

      await saveAbsensi(dateStr, monthYear, recordsToSave, guruName || "Guru");
      setIsLocked(true);
      setIsConfirmOpen(false);
      setKeterangan("");
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
  const today = startOfToday();
  const isPastDate = isBefore(date, today);

  const displayedClasses = selectedClass === "Semua" 
    ? classes 
    : classes.filter((c) => c === selectedClass);

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm whitespace-nowrap">Tanggal:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
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
            
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm whitespace-nowrap">Kelas:</span>
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c} value={c}>
                      Kelas {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Button className="hidden md:inline-flex" onClick={handleSaveClick} disabled={isSaving || isLocked || isPastDate}>
              {isSaving ? "Menyimpan..." : (isLocked ? "Terkunci" : "Simpan Absensi")}
            </Button>
            {isLocked && (
              <span className="text-sm text-amber-600 font-medium hidden md:block">
                Terkunci (Read-Only)
              </span>
            )}
          </div>
        </div>

      {isWeekend && !hasData && !forceInputWeekend ? (
        <div className="p-8 text-center border rounded-lg bg-muted/50 space-y-4">
          <p className="text-muted-foreground">
            Hari Libur - Secara default tidak ada jadwal absensi.
          </p>
          <Button variant="outline" onClick={() => setForceInputWeekend(true)}>
            Input Manual Absen Ekskul
          </Button>
        </div>
      ) : isLoading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-4 text-muted-foreground border rounded-lg bg-muted/20">
          <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-sm font-medium animate-pulse">Memuat data absensi...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {displayedClasses.map((cls) => (
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
                      <TableHead className="min-w-[150px] md:min-w-[300px]">Status Kehadiran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupedStudents[cls].map((siswa) => (
                      <TableRow key={siswa.nisn}>
                        <TableCell className="font-medium">{siswa.nisn}</TableCell>
                        <TableCell>{siswa.namaLengkap}</TableCell>
                        <TableCell>
                          {/* Desktop View */}
                          <div className="hidden md:block">
                            <RadioGroup
                              className="flex items-center gap-4"
                              value={siswa.absensiStatus}
                              onValueChange={(val) =>
                                handleStatusChange(siswa.nisn, val as AbsensiStatus)
                              }
                              disabled={isLocked || isPastDate}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Hadir" id={`H-${siswa.nisn}`} disabled={isLocked || isPastDate} />
                                <Label htmlFor={`H-${siswa.nisn}`} className={cn("font-normal cursor-pointer text-green-600", (isLocked || isPastDate) && "opacity-50")}>Hadir</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Sakit" id={`S-${siswa.nisn}`} disabled={isLocked || isPastDate} />
                                <Label htmlFor={`S-${siswa.nisn}`} className={cn("font-normal cursor-pointer text-blue-600", (isLocked || isPastDate) && "opacity-50")}>Sakit</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Izin" id={`I-${siswa.nisn}`} disabled={isLocked || isPastDate} />
                                <Label htmlFor={`I-${siswa.nisn}`} className={cn("font-normal cursor-pointer text-yellow-600", (isLocked || isPastDate) && "opacity-50")}>Izin</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Alpa" id={`A-${siswa.nisn}`} disabled={isLocked || isPastDate} />
                                <Label htmlFor={`A-${siswa.nisn}`} className={cn("font-normal cursor-pointer text-red-600", (isLocked || isPastDate) && "opacity-50")}>Alpa</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          
                          {/* Mobile View */}
                          <div className="md:hidden">
                            <Select 
                              value={siswa.absensiStatus} 
                              onValueChange={(val) => handleStatusChange(siswa.nisn, val as AbsensiStatus)}
                              disabled={isLocked || isPastDate}
                            >
                              <SelectTrigger className={cn("w-[110px]", getStatusColor(siswa.absensiStatus))}>
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Hadir" className="text-green-600">Hadir</SelectItem>
                                <SelectItem value="Sakit" className="text-blue-600">Sakit</SelectItem>
                                <SelectItem value="Izin" className="text-yellow-600">Izin</SelectItem>
                                <SelectItem value="Alpa" className="text-red-600">Alpa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {siswa.submittedBy && (
                            <div className="text-xs text-gray-500 opacity-75 mt-2 md:mt-1">
                              Diinput oleh: {siswa.submittedBy}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
          {displayedClasses.length === 0 && classes.length > 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg">
              Tidak ada siswa untuk kelas ini.
            </div>
          )}
          {classes.length === 0 && (
            <div className="text-center p-8 text-muted-foreground border rounded-lg">
              Tidak ada siswa aktif ditemukan.
            </div>
          )}

          {/* Mobile Submit Button at bottom */}
          {displayedClasses.length > 0 && (
            <div className="md:hidden mt-6 flex flex-col gap-2">
              {isLocked && (
                <div className="text-sm text-amber-600 font-medium text-center">
                  Data Terkunci (Read-Only)
                </div>
              )}
              <Button className="w-full" onClick={handleSaveClick} disabled={isSaving || isLocked || isPastDate}>
                {isSaving ? "Menyimpan..." : (isLocked ? "Terkunci" : "Simpan Absensi")}
              </Button>
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

      {/* Confirmation Dialog with Keterangan */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi Simpan Absensi</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyimpan data absensi ini? Data yang sudah dikumpulkan akan terkunci.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="keterangan" className="mb-2 block">Keterangan (Opsional)</Label>
            <Textarea
              id="keterangan"
              placeholder="Contoh: Budi izin karena acara keluarga, Andi sakit demam..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} disabled={isSaving}>Batal</Button>
            <Button onClick={handleConfirmSave} disabled={isSaving}>
              {isSaving ? "Menyimpan..." : "Kumpulkan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
