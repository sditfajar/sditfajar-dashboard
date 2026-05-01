"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs, doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Loader2, CreditCard } from "lucide-react";

// Types
interface Siswa {
  id: string;
  namaLengkap: string;
  kelas: string;
}

interface TagihanSemesteran {
  semester: "Ganjil" | "Genap";
  nominal: number;
  status: "Lunas" | "Belum Lunas";
  tanggalBayar: any | null;
}

interface Keuangan {
  id: string;
  studentId: string;
  namaLengkap: string;
  kelas: string;
  tagihanBulanan: any[];
  tagihanSemesteran: TagihanSemesteran[];
}

const BULAN_AKADEMIK = [
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni"
];

export default function TagihanSemesterPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [keuangan, setKeuangan] = useState<Record<string, Keuangan>>({});
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<Keuangan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTagihan, setTempTagihan] = useState<TagihanSemesteran[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string>("semua");

  const uniqueClasses = useMemo(() => {
    const classes = new Set(siswa.map(s => s.kelas).filter(Boolean));
    return Array.from(classes).sort();
  }, [siswa]);

  const filteredSiswa = useMemo(() => {
    if (selectedKelas === "semua") return siswa;
    return siswa.filter(s => s.kelas === selectedKelas);
  }, [siswa, selectedKelas]);

  // Tentukan semester berjalan
  const currentMonth = new Date().getMonth(); // 0-11
  // Juli (6) - Desember (11) = Ganjil
  // Januari (0) - Juni (5) = Genap
  const isGanjil = currentMonth >= 6 && currentMonth <= 11;
  const currentSemester = isGanjil ? "Ganjil" : "Genap";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const siswaSnapshot = await getDocs(collection(db, "siswa"));
      const siswaData: Siswa[] = [];
      siswaSnapshot.forEach((doc) => {
        siswaData.push({ id: doc.id, ...doc.data() } as Siswa);
      });

      const keuanganSnapshot = await getDocs(collection(db, "keuangan"));
      const keuanganData: Record<string, Keuangan> = {};
      keuanganSnapshot.forEach((doc) => {
        keuanganData[doc.id] = { id: doc.id, ...doc.data() } as Keuangan;
      });

      setSiswa(siswaData);
      setKeuangan(keuanganData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTagihan = async (s: Siswa) => {
    try {
      const defaultTagihanBulanan = BULAN_AKADEMIK.map((bulan) => ({
        bulan,
        nominal: 350000,
        status: "Belum Lunas",
        tanggalBayar: null,
      }));

      const defaultTagihanSemesteran = ["Ganjil", "Genap"].map((semester) => ({
        semester: semester as "Ganjil" | "Genap",
        nominal: 1200000,
        status: "Belum Lunas" as "Belum Lunas",
        tanggalBayar: null,
      }));

      const newDoc = {
        studentId: s.id,
        namaLengkap: s.namaLengkap,
        kelas: s.kelas || "-",
        tagihanBulanan: defaultTagihanBulanan,
        tagihanSemesteran: defaultTagihanSemesteran,
      };

      await setDoc(doc(db, "keuangan", s.id), newDoc);
      
      setKeuangan((prev) => ({
        ...prev,
        [s.id]: { id: s.id, ...newDoc } as Keuangan,
      }));
      
      toast.success(`Tagihan untuk ${s.namaLengkap} berhasil digenerate`);
    } catch (error) {
      console.error("Error generating tagihan:", error);
      toast.error("Gagal men-generate tagihan");
    }
  };

  const openKelolaModal = (k: Keuangan) => {
    setSelectedStudent(k);
    const existingSemesteran = k.tagihanSemesteran || ["Ganjil", "Genap"].map((semester) => ({
      semester: semester as "Ganjil" | "Genap", nominal: 1200000, status: "Belum Lunas" as "Belum Lunas", tanggalBayar: null
    }));
    setTempTagihan([...existingSemesteran]);
    setIsModalOpen(true);
  };

  const handleToggleLunas = (index: number) => {
    const updated = [...tempTagihan];
    const isLunas = updated[index].status === "Lunas";
    
    updated[index].status = isLunas ? "Belum Lunas" : "Lunas";
    updated[index].tanggalBayar = isLunas ? null : Timestamp.now();
    
    setTempTagihan(updated);
  };

  const saveSemesteran = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "keuangan", selectedStudent.id);
      await updateDoc(docRef, {
        tagihanSemesteran: tempTagihan,
      });
      
      setKeuangan((prev) => ({
        ...prev,
        [selectedStudent.id]: {
          ...selectedStudent,
          tagihanSemesteran: tempTagihan,
        },
      }));
      
      setIsModalOpen(false);
      toast.success("Data Semesteran berhasil diperbarui");
    } catch (error) {
      console.error("Error saving semesteran:", error);
      toast.error("Gagal menyimpan data semesteran");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chart data preparation
  const chartData = useMemo(() => {
    let lunas = 0;
    let belumLunas = 0;

    Object.values(keuangan).forEach((k) => {
      const currentSemesterData = k.tagihanSemesteran?.find(ts => ts.semester === currentSemester);
      if (currentSemesterData) {
        if (currentSemesterData.status === "Lunas") lunas++;
        else belumLunas++;
      } else {
        belumLunas++;
      }
    });

    return [
      { name: "Lunas", value: lunas, color: "hsl(var(--primary))" },
      { name: "Belum Lunas", value: belumLunas, color: "hsl(var(--destructive))" }
    ];
  }, [keuangan, currentSemester]);

  const totalPemasukanSemesterIni = useMemo(() => {
    let total = 0;
    Object.values(keuangan).forEach((k) => {
      const currentSemesterData = k.tagihanSemesteran?.find(ts => ts.semester === currentSemester);
      if (currentSemesterData && currentSemesterData.status === "Lunas") {
        total += currentSemesterData.nominal;
      }
    });
    return total;
  }, [keuangan, currentSemester]);

  return (
    <div className="flex-1 space-y-4 md:p-2 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tagihan Semester</h2>
          <p className="text-muted-foreground">Kelola tagihan semesteran siswa (Ganjil & Genap).</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-5 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Rasio Lunas vs Belum Lunas</CardTitle>
            <CardDescription>
              Semester {currentSemester} Tahun Ajaran Berjalan
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2 flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [value + " Siswa"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Semester {currentSemester}</CardTitle>
            <CardDescription>
              Total pemasukan semester ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPemasukanSemesterIni)}
            </div>
            <div className="mt-4 flex items-center justify-center p-6 bg-muted/50 rounded-lg">
              <CreditCard className="w-16 h-16 text-primary/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Data Pembayaran Siswa</CardTitle>
            <CardDescription>Status tagihan semesteran Ganjil & Genap per siswa.</CardDescription>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {uniqueClasses.map((kelas) => (
                  <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status Ganjil</TableHead>
                    <TableHead>Status Genap</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSiswa.map((s) => {
                    const k = keuangan[s.id];
                    let statusGanjil = "Belum Lunas";
                    let statusGenap = "Belum Lunas";
                    
                    if (k && k.tagihanSemesteran) {
                      const tg = k.tagihanSemesteran.find(ts => ts.semester === "Ganjil");
                      const te = k.tagihanSemesteran.find(ts => ts.semester === "Genap");
                      if (tg) statusGanjil = tg.status;
                      if (te) statusGenap = te.status;
                    }

                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.namaLengkap}</TableCell>
                        <TableCell>{s.kelas || "-"}</TableCell>
                        <TableCell>
                          {k ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusGanjil === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'}`}>
                              {statusGanjil}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {k ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusGenap === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'}`}>
                              {statusGenap}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {k ? (
                            <Button variant="outline" size="sm" onClick={() => openKelolaModal(k)}>
                              Kelola Semester
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => handleGenerateTagihan(s)}>
                              Generate Tagihan
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredSiswa.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Belum ada data siswa.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Kelola Semesteran */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kelola Semester - {selectedStudent?.namaLengkap}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {tempTagihan.map((ts, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium">Semester {ts.semester}</span>
                  <span className="text-xs text-muted-foreground">
                    Rp1.200.000
                    {ts.tanggalBayar && ts.status === "Lunas" && (
                      <span className="ml-2 block sm:inline">
                        (Dibayar: {ts.tanggalBayar?.toDate ? ts.tanggalBayar.toDate().toLocaleDateString('id-ID') : new Date(ts.tanggalBayar).toLocaleDateString('id-ID')})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${ts.status === "Lunas" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {ts.status}
                  </span>
                  <button
                    onClick={() => handleToggleLunas(idx)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      ts.status === "Lunas" ? "bg-green-500" : "bg-gray-200 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        ts.status === "Lunas" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Batal
            </Button>
            <Button onClick={saveSemesteran} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
