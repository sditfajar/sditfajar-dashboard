"use client";

import { useState, useMemo, Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash2, Search, Plus, Filter, Eye } from "lucide-react";
import { Siswa } from "@/types/siswa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SiswaDataTableProps {
  data: Siswa[];
  onEdit: (siswa: Siswa) => void;
  onDelete: (nisn: string) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export function SiswaDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}: SiswaDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("semua");
  const [viewSiswa, setViewSiswa] = useState<Siswa | null>(null);

  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set(data.map((s) => s.kelas).filter(Boolean));
    return Array.from(kelasSet).sort((a, b) => a.localeCompare(b, "id", { numeric: true }));
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        item.namaLengkap.toLowerCase().includes(searchLower) ||
        item.nisn.toLowerCase().includes(searchLower);
      const matchKelas = filterKelas === "semua" || item.kelas === filterKelas;
      return matchSearch && matchKelas;
    });
  }, [data, searchQuery, filterKelas]);

  const groupedData = useMemo(() => {
    const groups: Record<string, Siswa[]> = {};
    filteredData.forEach((siswa) => {
      const kelasName = siswa.kelas || "Tanpa Kelas";
      if (!groups[kelasName]) {
        groups[kelasName] = [];
      }
      groups[kelasName].push(siswa);
    });
    return groups;
  }, [filteredData]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aktif":
        return "default"; // green/primary
      case "Alumni":
        return "secondary"; // yellow/gray
      case "Tidak Aktif":
        return "destructive"; // red
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Nama atau NISN..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterKelas} onValueChange={setFilterKelas}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kelas</SelectItem>
              {uniqueKelas.map((kelas) => (
                <SelectItem key={kelas} value={kelas}>
                  Kelas {kelas}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Tambah Siswa
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NISN</TableHead>
              <TableHead>Nama Lengkap</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Wali Murid</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data siswa ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedData)
                .sort(([kelasA], [kelasB]) => kelasA.localeCompare(kelasB))
                .map(([kelas, siswaList]) => (
                  <Fragment key={kelas}>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={7} className="font-semibold text-sm py-3 text-muted-foreground">
                        Kelas {kelas}
                      </TableCell>
                    </TableRow>
                    {siswaList.map((siswa) => (
                      <TableRow key={siswa.nisn}>
                        <TableCell className="font-medium">{siswa.nisn}</TableCell>
                        <TableCell>{siswa.namaLengkap}</TableCell>
                        <TableCell>{siswa.kelas}</TableCell>
                        <TableCell>{siswa.namaWali}</TableCell>
                        <TableCell>{siswa.whatsappOrtu}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={getStatusBadgeVariant(siswa.status)}
                            className={siswa.status === "Lulus" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                          >
                            {siswa.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setViewSiswa(siswa)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Buka menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(siswa)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => {
                                    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
                                      onDelete(siswa.nisn);
                                    }
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </Fragment>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewSiswa} onOpenChange={(open) => !open && setViewSiswa(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Siswa</DialogTitle>
          </DialogHeader>
          {viewSiswa && (
            <div className="space-y-4 py-4">
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold">{viewSiswa.namaLengkap}</h3>
                <p className="text-sm text-muted-foreground">NIS/NISN: {viewSiswa.nisn}</p>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <span className="text-muted-foreground block mb-1">Kelas</span>
                  <span className="font-medium">{viewSiswa.kelas}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Status</span>
                  <Badge 
                    variant={getStatusBadgeVariant(viewSiswa.status)}
                    className={viewSiswa.status === "Lulus" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  >
                    {viewSiswa.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Nama Wali</span>
                  <span className="font-medium">{viewSiswa.namaWali}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Kontak Wali</span>
                  <span className="font-medium">{viewSiswa.whatsappOrtu}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
