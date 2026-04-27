"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { Eye, Trash2, Mail, Phone, MessageSquare, CheckCircle2, Circle } from "lucide-react";
import { PesanKontak } from "@/types/pesan";
import {
  getPesanKontak,
  updateStatusPesan,
  deletePesanKontak,
} from "@/lib/firebase/pesan";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/fade-in";

function toDate(value: Timestamp | Date | any): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (value?.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
}

export default function PesanPage() {
  const [data, setData] = useState<PesanKontak[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPesan, setSelectedPesan] = useState<PesanKontak | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pesanData = await getPesanKontak();
      setData(pesanData);
    } catch (error) {
      console.error("Gagal memuat pesan:", error);
      toast.error("Gagal memuat daftar pesan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: "belum_dibaca" | "sudah_dibaca") => {
    try {
      await updateStatusPesan(id, status);
      toast.success(status === "sudah_dibaca" ? "Pesan ditandai sudah dibaca" : "Pesan ditandai belum dibaca");
      loadData();
      if (selectedPesan && selectedPesan.id === id) {
        setSelectedPesan({ ...selectedPesan, status });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status pesan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin hapus pesan ini?")) return;
    try {
      await deletePesanKontak(id);
      toast.success("Pesan berhasil dihapus.");
      loadData();
      if (selectedPesan?.id === id) {
        setSelectedPesan(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus pesan.");
    }
  };

  const renderContactLink = (kontak: string) => {
    if (kontak.includes("@")) {
      return (
        <a href={`mailto:${kontak}`} className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1.5 font-medium transition-colors">
          <Mail className="h-3.5 w-3.5" /> {kontak}
        </a>
      );
    } else {
      let waNumber = kontak.replace(/\D/g, "");
      if (waNumber.startsWith("0")) {
        waNumber = "62" + waNumber.substring(1);
      }
      return (
        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 hover:underline flex items-center gap-1.5 font-medium transition-colors">
          <Phone className="h-3.5 w-3.5" /> {kontak}
        </a>
      );
    }
  };

  const unreadCount = data.filter(p => p.status === "belum_dibaca").length;

  return (
    <>
      <FadeIn className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pesan Kontak</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pesan masuk dari pengunjung website.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border shadow-sm">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{data.length} Total</span>
            <span className="text-xs text-muted-foreground">{unreadCount} Belum dibaca</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Tanggal</TableHead>
                <TableHead className="w-[200px]">Pengirim</TableHead>
                <TableHead className="w-[220px]">Kontak</TableHead>
                <TableHead>Pesan</TableHead>
                <TableHead className="text-right w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <span className="animate-pulse">Memuat data pesan...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Belum ada pesan yang masuk.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id} className={item.status === "belum_dibaca" ? "bg-primary/5 font-medium" : ""}>
                    <TableCell>
                      {item.status === "belum_dibaca" ? (
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <Circle className="h-3 w-3 fill-amber-600 text-amber-600" />
                          <span className="text-xs font-semibold">Baru</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">Terbaca</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {item.createdAt ? format(toDate(item.createdAt), "dd MMM yyyy, HH:mm", { locale: localeId }) : "-"}
                    </TableCell>
                    <TableCell className="font-semibold">{item.nama}</TableCell>
                    <TableCell>
                      {renderContactLink(item.kontak)}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                      {item.pesan}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPesan(item);
                            if (item.status === "belum_dibaca" && item.id) {
                              handleUpdateStatus(item.id, "sudah_dibaca");
                            }
                          }}
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => item.id && handleDelete(item.id)}
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </FadeIn>

      {/* Detail Dialog */}
      <Dialog open={!!selectedPesan} onOpenChange={(open) => !open && setSelectedPesan(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="border-b pb-4 mb-4">
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Detail Pesan
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Pengirim</p>
                <p className="font-medium">{selectedPesan?.nama}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Tanggal Masuk</p>
                <p className="text-sm">
                  {selectedPesan?.createdAt 
                    ? format(toDate(selectedPesan.createdAt), "dd MMMM yyyy, HH:mm", { locale: localeId })
                    : "-"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Kontak Balasan</p>
                <div>{selectedPesan?.kontak && renderContactLink(selectedPesan.kontak)}</div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Isi Pesan</p>
              <div className="p-4 bg-card border rounded-xl whitespace-pre-wrap text-sm leading-relaxed">
                {selectedPesan?.pesan}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex sm:justify-between items-center border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedPesan?.id) {
                  handleUpdateStatus(
                    selectedPesan.id,
                    selectedPesan.status === "sudah_dibaca" ? "belum_dibaca" : "sudah_dibaca"
                  );
                }
              }}
            >
              {selectedPesan?.status === "sudah_dibaca" ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
            </Button>
            <Button onClick={() => setSelectedPesan(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
