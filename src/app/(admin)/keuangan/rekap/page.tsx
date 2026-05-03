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
import { Loader2, Check, X } from "lucide-react";

interface Siswa {
  id: string;
  nisn: string;
  namaLengkap: string;
  kelas: string;
  whatsappOrtu: string;
}

interface TagihanBulanan {
  bulan: string;
  nominal: number;
  status: "Lunas" | "Belum Lunas";
  tanggalBayar: any | null;
}

interface TagihanSemesteran {
  semester: string;
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
  tagihanSemesteran: TagihanSemesteran[];
}

// Mengikuti tahun akademik sekolah di Indonesia (Juli - Juni)
const BULAN_AKADEMIK = [
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni"
];

const SEMESTER = ["Ganjil", "Genap"];

export default function RekapTagihanPage() {
  const [dataRekap, setDataRekap] = useState<(Siswa & { keuangan: Keuangan })[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedKelas, setSelectedKelas] = useState<string>("semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("semua");
  const [selectedSemester, setSelectedSemester] = useState<string>("Ganjil");

  useEffect(() => {
    const saved = localStorage.getItem("rekap_semester_filter");
    if (saved === "Ganjil" || saved === "Genap") {
      setSelectedSemester(saved);
    } else {
      const month = new Date().getMonth();
      if (month >= 6) {
        setSelectedSemester("Ganjil");
      } else {
        setSelectedSemester("Genap");
      }
    }
    fetchData();
  }, []);

  const handleSemesterChange = (val: string) => {
    setSelectedSemester(val);
    localStorage.setItem("rekap_semester_filter", val);
  };

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

      // Gabungkan data Siswa dan Keuangan (hanya yang sudah ada di koleksi keuangan)
      const rekapData = siswaData
        .filter(s => keuanganData[s.id])
        .map(s => ({
          ...s,
          keuangan: keuanganData[s.id]
        }));

      setDataRekap(rekapData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueClasses = useMemo(() => {
    const classes = new Set(dataRekap.map(d => d.kelas).filter(Boolean));
    return Array.from(classes).sort();
  }, [dataRekap]);

  const formatWhatsAppNumber = (number: string) => {
    if (!number) return "";
    let formatted = number.replace(/\D/g, ""); // Hilangkan karakter selain angka
    if (formatted.startsWith("0")) {
      formatted = "62" + formatted.substring(1); // Ubah 0 jadi 62
    }
    return formatted;
  };

  const getTunggakanList = (keuangan: Keuangan, semester: string) => {
    const tunggakan: string[] = [];
    const bulanVisible = semester === "Ganjil" 
      ? ["Juli", "Agustus", "September", "Oktober", "November", "Desember"] 
      : ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];

    keuangan.tagihanBulanan?.forEach(tb => {
      if (tb.status === "Belum Lunas" && bulanVisible.includes(tb.bulan)) {
        tunggakan.push(`Bulan ${tb.bulan}`);
      }
    });
    keuangan.tagihanSemesteran?.forEach(ts => {
      if (ts.status === "Belum Lunas" && ts.semester === semester) {
        tunggakan.push(`Semester ${ts.semester}`);
      }
    });
    return tunggakan;
  };

  const createWhatsAppLink = (siswa: Siswa, keuangan: Keuangan, semester: string) => {
    const waNumber = formatWhatsAppNumber(siswa.whatsappOrtu);
    if (!waNumber) return "#";

    const tunggakan = getTunggakanList(keuangan, semester);
    const tunggakanText = tunggakan.length > 0 ? tunggakan.map(t => `- ${t}`).join("\n") : "tidak ada";

    // Template Pesan Sesuai Permintaan
    const message = `Assalamu'alaikum wr. wb.\n\nBapak/Ibu wali dari ananda *${siswa.namaLengkap}*, kami menginformasikan bahwa terdapat tagihan administrasi sekolah yang belum diselesaikan untuk:\n\n${tunggakanText}\n\nMohon kerjasamanya untuk segera melakukan penyelesaian pembayaran. Terima kasih.\n\nSalam,\nAdmin Keuangan SDIT Fajar`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  const filteredData = useMemo(() => {
    return dataRekap.filter(d => {
      const matchKelas = selectedKelas === "semua" || d.kelas === selectedKelas;

      const tunggakan = getTunggakanList(d.keuangan, selectedSemester);
      const isLunasSemua = tunggakan.length === 0;

      let matchStatus = true;
      if (selectedStatus === "lunas_semua") matchStatus = isLunasSemua;
      if (selectedStatus === "ada_tunggakan") matchStatus = !isLunasSemua;

      return matchKelas && matchStatus;
    });
  }, [dataRekap, selectedKelas, selectedStatus, selectedSemester]);

  return (
    <div className="flex-1 min-w-0 w-full max-w-full space-y-4 md:p-2 pt-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rekap Tagihan</h2>
          <p className="text-muted-foreground">Rekapitulasi pembayaran bulanan dan semesteran seluruh siswa.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm w-full max-w-full overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Data Rekapitulasi</CardTitle>
            <CardDescription>Menampilkan {filteredData.length} siswa.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedSemester} onValueChange={handleSemesterChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Pilih Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
                <SelectItem value="Genap">Semester Genap</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedKelas} onValueChange={setSelectedKelas}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {uniqueClasses.map((kelas) => (
                  <SelectItem key={kelas} value={kelas}>{kelas}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Status Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Status</SelectItem>
                <SelectItem value="lunas_semua">Lunas Semua</SelectItem>
                <SelectItem value="ada_tunggakan">Ada Tunggakan</SelectItem>
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
            <div className="rounded-md border overflow-x-auto relative">
              <Table className="min-w-max">
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="sticky left-0 bg-muted/50 z-20 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Nama Siswa</TableHead>
                    <TableHead>No. WA Wali</TableHead>
                    <TableHead>Kelas</TableHead>
                    {(selectedSemester === "Ganjil" 
                      ? ["Juli", "Agustus", "September", "Oktober", "November", "Desember"] 
                      : ["Januari", "Februari", "Maret", "April", "Mei", "Juni"]
                    ).map(bulan => (
                      <TableHead key={bulan} className="text-center">{bulan}</TableHead>
                    ))}
                    <TableHead className="text-center">Sem. {selectedSemester}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((d) => {
                    const k = d.keuangan;
                    const waLink = createWhatsAppLink(d, k, selectedSemester);
                    const formattedWa = formatWhatsAppNumber(d.whatsappOrtu);
                    
                    const bulanVisible = selectedSemester === "Ganjil" 
                      ? ["Juli", "Agustus", "September", "Oktober", "November", "Desember"] 
                      : ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];

                    return (
                      <TableRow key={d.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur z-10 w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                          {d.namaLengkap}
                        </TableCell>
                        <TableCell>
                          {d.whatsappOrtu ? (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 hover:underline transition-colors font-medium flex items-center gap-1"
                              title="Kirim Pesan WhatsApp"
                            >
                              {formattedWa}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-xs italic">Kosong</span>
                          )}
                        </TableCell>
                        <TableCell>{d.kelas || "-"}</TableCell>

                        {bulanVisible.map(bulan => {
                          const tb = k.tagihanBulanan?.find(t => t.bulan === bulan);
                          const isLunas = tb?.status === "Lunas";
                          return (
                            <TableCell key={bulan} className="text-center">
                              {isLunas ? (
                                <div className="flex justify-center"><Check className="w-5 h-5 text-green-500" /></div>
                              ) : (
                                <div className="flex justify-center"><X className="w-5 h-5 text-red-500" /></div>
                              )}
                            </TableCell>
                          )
                        })}

                        {(() => {
                          const ts = k.tagihanSemesteran?.find(t => t.semester === selectedSemester);
                          const isLunas = ts?.status === "Lunas";
                          return (
                            <TableCell className="text-center border-l bg-muted/10">
                              {isLunas ? (
                                <div className="flex justify-center"><Check className="w-5 h-5 text-green-500" /></div>
                              ) : (
                                <div className="flex justify-center"><X className="w-5 h-5 text-red-500" /></div>
                              )}
                            </TableCell>
                          )
                        })()}

                      </TableRow>
                    );
                  })}
                  {filteredData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={18} className="text-center py-8 text-muted-foreground">
                        Belum ada data rekap tagihan untuk kriteria ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
