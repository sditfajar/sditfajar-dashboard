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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { CreditCard, Loader2 } from "lucide-react";

// Types
interface Siswa {
  id: string;
  namaLengkap: string;
  kelas: string;
}

interface TagihanBulanan {
  bulan: string;
  nominal: number;
  status: "Lunas" | "Belum Lunas";
  tanggalBayar: any | null;
}

interface Keuangan {
  id: string;
  studentId: string;
  namaLengkap: string;
  kelas: string;
  tagihanBulanan: TagihanBulanan[];
  tagihanSemesteran: any[];
}

const BULAN_AKADEMIK = [
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni"
];

export default function SPPBulananPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [keuangan, setKeuangan] = useState<Record<string, Keuangan>>({});
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState<Keuangan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTagihan, setTempTagihan] = useState<TagihanBulanan[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<string>("semua");

  const uniqueClasses = useMemo(() => {
    const classes = new Set(siswa.map(s => s.kelas).filter(Boolean));
    return Array.from(classes).sort();
  }, [siswa]);

  const filteredSiswa = useMemo(() => {
    if (selectedKelas === "semua") return siswa;
    return siswa.filter(s => s.kelas === selectedKelas);
  }, [siswa, selectedKelas]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Siswa
      const siswaSnapshot = await getDocs(collection(db, "siswa"));
      const siswaData: Siswa[] = [];
      siswaSnapshot.forEach((doc) => {
        siswaData.push({ id: doc.id, ...doc.data() } as Siswa);
      });

      // Fetch Keuangan
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
        semester,
        nominal: 1200000,
        status: "Belum Lunas",
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
    setTempTagihan([...k.tagihanBulanan]);
    setIsModalOpen(true);
  };

  const handleToggleLunas = (index: number) => {
    const updated = [...tempTagihan];
    const isLunas = updated[index].status === "Lunas";

    updated[index].status = isLunas ? "Belum Lunas" : "Lunas";
    updated[index].tanggalBayar = isLunas ? null : Timestamp.now();

    setTempTagihan(updated);
  };

  const saveSPP = async () => {
    if (!selectedStudent) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "keuangan", selectedStudent.id);
      await updateDoc(docRef, {
        tagihanBulanan: tempTagihan,
      });

      setKeuangan((prev) => ({
        ...prev,
        [selectedStudent.id]: {
          ...selectedStudent,
          tagihanBulanan: tempTagihan,
        },
      }));

      setIsModalOpen(false);
      toast.success("Data SPP berhasil diperbarui");
    } catch (error) {
      console.error("Error saving SPP:", error);
      toast.error("Gagal menyimpan data SPP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartData = useMemo(() => {
    const counts = BULAN_AKADEMIK.map((bulan) => ({
      name: bulan.substring(0, 3),
      total: 0,
      fullMonthName: bulan
    }));

    Object.values(keuangan).forEach((k) => {
      k.tagihanBulanan?.forEach((tb) => {
        if (tb.status === "Lunas") {
          const idx = counts.findIndex((c) => c.fullMonthName === tb.bulan);
          if (idx !== -1) {
            counts[idx].total += tb.nominal;
          }
        }
      });
    });

    return counts;
  }, [keuangan]);

  const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });
  const totalThisMonth = useMemo(() => {
    let total = 0;
    Object.values(keuangan).forEach((k) => {
      k.tagihanBulanan?.forEach((tb) => {
        if (tb.status === "Lunas" && tb.bulan.toLowerCase() === currentMonthName.toLowerCase()) {
          total += tb.nominal;
        }
      });
    });
    return total;
  }, [keuangan, currentMonthName]);

  return (
    <div className="flex-1 space-y-4 md:p-2 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SPP Bulanan</h2>
          <p className="text-muted-foreground">Kelola pembayaran SPP bulanan siswa.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-5 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Tren Pemasukan SPP</CardTitle>
            <CardDescription>
              Total pembayaran SPP (Lunas) per bulan dalam tahun ajaran ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                  formatter={(value: any) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value) || 0)}
                  labelStyle={{ color: 'black' }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Bulan Ini: {currentMonthName}</CardTitle>
            <CardDescription>
              Total pemasukan SPP bulan ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalThisMonth)}
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
            <CardDescription>Daftar siswa dan status tagihan SPP bulanan.</CardDescription>
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
                    <TableHead>Status Bulan Ini ({currentMonthName})</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSiswa.map((s) => {
                    const k = keuangan[s.id];
                    let statusBulanIni = "Belum Lunas";
                    if (k && k.tagihanBulanan) {
                      const tb = k.tagihanBulanan.find((t) => t.bulan.toLowerCase() === currentMonthName.toLowerCase());
                      if (tb) statusBulanIni = tb.status;
                    }

                    return (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.namaLengkap}</TableCell>
                        <TableCell>{s.kelas || "-"}</TableCell>
                        <TableCell>
                          {k ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBulanIni === 'Lunas' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'}`}>
                              {statusBulanIni}
                            </span>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Belum ada tagihan</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {k ? (
                            <Button variant="outline" size="sm" onClick={() => openKelolaModal(k)}>
                              Kelola SPP
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
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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

      {/* Modal Kelola SPP */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kelola SPP - {selectedStudent?.namaLengkap}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
            {tempTagihan.map((tb, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium">{tb.bulan}</span>
                  <span className="text-xs text-muted-foreground">
                    Rp350.000
                    {tb.tanggalBayar && tb.status === "Lunas" && (
                      <span className="ml-2 block sm:inline">
                        (Dibayar: {tb.tanggalBayar?.toDate ? tb.tanggalBayar.toDate().toLocaleDateString('id-ID') : new Date(tb.tanggalBayar).toLocaleDateString('id-ID')})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${tb.status === "Lunas" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {tb.status}
                  </span>
                  <button
                    onClick={() => handleToggleLunas(idx)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${tb.status === "Lunas" ? "bg-green-500" : "bg-gray-200 dark:bg-slate-700"
                      }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tb.status === "Lunas" ? "translate-x-5" : "translate-x-0"
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
            <Button onClick={saveSPP} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
