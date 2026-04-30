"use client";

import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
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
import { Subject } from "@/lib/firebase/pembelajaran";

interface MapelDataTableProps {
  data: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  isLoading: boolean;
}

export function MapelDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  isLoading,
}: MapelDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKelas, setFilterKelas] = useState<string>("semua");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKelas = filterKelas === "semua" || item.kategori_kelas === filterKelas;
      return matchSearch && matchKelas;
    });
  }, [data, searchQuery, filterKelas]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Mata Pelajaran..."
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
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kelas</SelectItem>
              <SelectItem value="1">Kelas 1</SelectItem>
              <SelectItem value="2">Kelas 2</SelectItem>
              <SelectItem value="3">Kelas 3</SelectItem>
              <SelectItem value="4">Kelas 4</SelectItem>
              <SelectItem value="5">Kelas 5</SelectItem>
              <SelectItem value="6">Kelas 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Tambah Mapel
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Tipe</TableHead>
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
                  Tidak ada data mapel ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((mapel, index) => (
                <TableRow key={mapel.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{mapel.nama_mapel}</TableCell>
                  <TableCell>
                    Kelas {mapel.kategori_kelas}
                  </TableCell>
                  <TableCell>
                    <Badge variant={mapel.tipe === "Umum" ? "default" : "secondary"}>
                      {mapel.tipe}
                    </Badge>
                  </TableCell>
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
                          <DropdownMenuItem onClick={() => onEdit(mapel)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setItemToDelete(mapel.id || null)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Mata Pelajaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Mata pelajaran akan dihapus secara permanen dari sistem.
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
