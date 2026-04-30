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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Edit, Trash2, Search, Plus, Filter, X } from "lucide-react";
import { Schedule } from "@/lib/firebase/pembelajaran";

interface JadwalDataTableProps {
  data: Schedule[];
  onEdit: (schedule: Schedule) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading: boolean;
}

const hariOrder: Record<string, number> = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 7
};

export function JadwalDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}: JadwalDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("semua");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const uniqueKelas = useMemo(() => {
    const kelasSet = new Set(data.map((s) => s.kelas).filter(Boolean));
    return Array.from(kelasSet).sort((a, b) => a.localeCompare(b, "id", { numeric: true }));
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = 
        item.mapelName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.guruName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKelas = filterKelas === "semua" || item.kelas === filterKelas;
      return matchSearch && matchKelas;
    });
  }, [data, searchQuery, filterKelas]);

  // Group by Kelas, then sort by Hari and jamMulai
  const groupedData = useMemo(() => {
    const groups: Record<string, Schedule[]> = {};
    filteredData.forEach((jadwal) => {
      const kelasName = jadwal.kelas || "Tanpa Kelas";
      if (!groups[kelasName]) {
        groups[kelasName] = [];
      }
      groups[kelasName].push(jadwal);
    });

    // Sort items within each group
    Object.keys(groups).forEach(kelas => {
      groups[kelas].sort((a, b) => {
        const hariDiff = (hariOrder[a.hari] || 99) - (hariOrder[b.hari] || 99);
        if (hariDiff !== 0) return hariDiff;
        return a.jamMulai.localeCompare(b.jamMulai);
      });
    });

    return groups;
  }, [filteredData]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Mapel atau Guru..."
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-foreground"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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
          Tambah Jadwal
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hari</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Guru Pengajar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada jadwal ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(groupedData)
                .sort(([kelasA], [kelasB]) => kelasA.localeCompare(kelasB, "id", { numeric: true }))
                .map(([kelas, jadwalList]) => (
                  <Fragment key={kelas}>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell colSpan={5} className="font-semibold text-sm py-3 text-muted-foreground">
                        Jadwal Kelas {kelas}
                      </TableCell>
                    </TableRow>
                    {jadwalList.map((jadwal) => (
                      <TableRow key={jadwal.id}>
                        <TableCell className="font-medium">{jadwal.hari}</TableCell>
                        <TableCell>
                          {jadwal.jamMulai} - {jadwal.jamSelesai}
                        </TableCell>
                        <TableCell className="font-semibold">{jadwal.mapelName}</TableCell>
                        <TableCell>{jadwal.guruName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Buka menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onEdit(jadwal)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => setItemToDelete(jadwal.id || null)}
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

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal Mengajar?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Jadwal ini akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) onDelete(itemToDelete);
                setItemToDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
