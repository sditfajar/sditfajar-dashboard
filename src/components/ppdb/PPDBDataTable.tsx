"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FileText, ExternalLink, Loader2, Search, X } from "lucide-react";
import { CalonSiswa, PPDBStatus } from "@/types/ppdb";
import { updatePPDBStatus } from "@/lib/firebase/ppdb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PPDBDataTableProps {
  data: CalonSiswa[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function PPDBDataTable({ data, isLoading, onRefresh }: PPDBDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<CalonSiswa | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredData = data.filter((item) =>
    item.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (newStatus: PPDBStatus) => {
    if (!selectedStudent || !selectedStudent.id) return;
    
    try {
      setIsUpdating(true);
      await updatePPDBStatus(selectedStudent.id, newStatus);
      toast.success("Status berhasil diperbarui");
      setSelectedStudent({ ...selectedStudent, status: newStatus });
      onRefresh(); // reload parent data
    } catch (error) {
      console.error(error);
      toast.error("Gagal memperbarui status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: PPDBStatus) => {
    switch (status) {
      case "Baru":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Baru</Badge>;
      case "Diproses":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Diproses</Badge>;
      case "Diterima":
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Diterima</Badge>;
      case "Ditolak":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama calon siswa..."
            className="pl-8 pr-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tgl Daftar</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>L/P</TableHead>
                <TableHead>No. WA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    Tidak ada data pendaftar.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">
                      {row.createdAt instanceof Date 
                        ? format(row.createdAt, "dd MMM yyyy", { locale: id })
                        : row.createdAt?.toDate 
                          ? format(row.createdAt.toDate(), "dd MMM yyyy", { locale: id })
                          : "-"}
                    </TableCell>
                    <TableCell className="font-medium">{row.namaLengkap}</TableCell>
                    <TableCell>{row.jenisKelamin === "Laki-laki" ? "L" : "P"}</TableCell>
                    <TableCell>{row.waOrtu}</TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(row)}>
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Pendaftar</DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Nama Lengkap</p>
                  <p className="font-medium">{selectedStudent.namaLengkap}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Tempat, Tanggal Lahir</p>
                  <p>{selectedStudent.tempatLahir}, {format(new Date(selectedStudent.tanggalLahir), "dd MMMM yyyy", { locale: id })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Jenis Kelamin</p>
                  <p>{selectedStudent.jenisKelamin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Alamat</p>
                  <p>{selectedStudent.alamatLengkap}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Nama Ayah</p>
                  <p>{selectedStudent.namaAyah}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Nama Ibu</p>
                  <p>{selectedStudent.namaIbu}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">No. WhatsApp</p>
                  <p>{selectedStudent.waOrtu}</p>
                </div>
                <div className="flex gap-4 pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.urlKK} target="_blank" rel="noreferrer">
                      <FileText className="mr-2 h-4 w-4" /> Lihat KK
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedStudent.urlAkta} target="_blank" rel="noreferrer">
                      <FileText className="mr-2 h-4 w-4" /> Lihat Akta
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between border-t pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ubah Status:</span>
              <Select 
                value={selectedStudent?.status} 
                onValueChange={(val) => handleStatusChange(val as PPDBStatus)}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baru">Baru</SelectItem>
                  <SelectItem value="Diproses">Diproses</SelectItem>
                  <SelectItem value="Diterima">Diterima</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <Button variant="secondary" onClick={() => setSelectedStudent(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
