"use client";

import { useEffect, useState, useMemo } from "react";
import { db } from "@/lib/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface RiwayatPayment {
  id: string;
  namaLengkap: string;
  kelas: string;
  tanggalBayar: Date;
  jenisPembayaran: string;
  jumlah: number;
}

export default function RiwayatKeuanganPage() {
  const [data, setData] = useState<RiwayatPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState<string>("semua");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const keuanganSnapshot = await getDocs(collection(db, "keuangan"));
        const riwayat: RiwayatPayment[] = [];

        keuanganSnapshot.forEach((doc) => {
          const k = doc.data();
          
          if (k.tagihanBulanan) {
            k.tagihanBulanan.forEach((tb: any) => {
              if (tb.status === "Lunas" && tb.tanggalBayar) {
                const date = tb.tanggalBayar.toDate ? tb.tanggalBayar.toDate() : new Date(tb.tanggalBayar);
                riwayat.push({
                  id: `${doc.id}-spp-${tb.bulan}`,
                  namaLengkap: k.namaLengkap,
                  kelas: k.kelas || "-",
                  tanggalBayar: date,
                  jenisPembayaran: `SPP ${tb.bulan}`,
                  jumlah: tb.nominal
                });
              }
            });
          }

          if (k.tagihanSemesteran) {
            k.tagihanSemesteran.forEach((ts: any) => {
              if (ts.status === "Lunas" && ts.tanggalBayar) {
                const date = ts.tanggalBayar.toDate ? ts.tanggalBayar.toDate() : new Date(ts.tanggalBayar);
                riwayat.push({
                  id: `${doc.id}-sem-${ts.semester}`,
                  namaLengkap: k.namaLengkap,
                  kelas: k.kelas || "-",
                  tanggalBayar: date,
                  jenisPembayaran: `Semester ${ts.semester}`,
                  jumlah: ts.nominal
                });
              }
            });
          }
        });

        // Sort descending by tanggalBayar
        riwayat.sort((a, b) => b.tanggalBayar.getTime() - a.tanggalBayar.getTime());
        setData(riwayat);
      } catch (error) {
        console.error("Error fetching riwayat:", error);
        toast.error("Gagal memuat data riwayat");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const uniqueKelas = useMemo(() => {
    const classes = new Set(data.map(item => item.kelas));
    return Array.from(classes).sort();
  }, [data]);

  const filteredData = useMemo(() => {
    if (selectedKelas === "semua") return data;
    return data.filter(item => item.kelas === selectedKelas);
  }, [data, selectedKelas]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKelas]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  return (
    <div className="flex-1 space-y-4 md:p-2 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Riwayat Pembayaran</h2>
          <p className="text-muted-foreground">Rekapitulasi seluruh transaksi SPP dan Semesteran yang lunas.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Data Transaksi</CardTitle>
            <CardDescription>Menampilkan {filteredData.length} transaksi yang berhasil.</CardDescription>
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {uniqueKelas.map(k => (
                  <SelectItem key={k} value={k}>Kelas {k}</SelectItem>
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
            <div className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Tanggal Bayar</TableHead>
                      <TableHead>Jenis Pembayaran</TableHead>
                      <TableHead className="text-right">Jumlah (Rp)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.namaLengkap}</TableCell>
                        <TableCell>{item.kelas}</TableCell>
                        <TableCell>
                          {item.tanggalBayar.toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.jenisPembayaran.startsWith("SPP") 
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          }`}>
                            {item.jenisPembayaran}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.jumlah)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Belum ada data riwayat pembayaran.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Halaman {currentPage} dari {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Selanjutnya
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
