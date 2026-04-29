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
import { MoreHorizontal, Edit, Trash2, Search, Plus, Filter, Eye } from "lucide-react";

interface GuruDataTableProps {
  data: any[]; // using any for now, better to define a Teacher interface
  onEdit: (guru: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onView: (guru: any) => void;
  isLoading: boolean;
}

export function GuruDataTable({
  data,
  onEdit,
  onDelete,
  onAdd,
  onView,
  isLoading,
}: GuruDataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPosisi, setFilterPosisi] = useState<string>("semua");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aktif":
        return "default";
      case "Cuti":
        return "secondary";
      case "Pensiun":
        return "destructive";
      default:
        return "outline";
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = item.name?.toLowerCase().includes(searchLower) || false;
      const matchPosisi = filterPosisi === "semua" || item.position === filterPosisi;
      return matchSearch && matchPosisi;
    });
  }, [data, searchQuery, filterPosisi]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari Nama Guru..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterPosisi} onValueChange={setFilterPosisi}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Semua Posisi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Posisi</SelectItem>
              <SelectItem value="Guru">Guru</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
              <SelectItem value="Karyawan">Karyawan</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAdd} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Tambah Guru
        </Button>
      </div>

      <div className="w-full overflow-x-auto rounded-md border bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No</TableHead>
              <TableHead>NIP / NUPTK</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center">L/P</TableHead>
              <TableHead>Posisi</TableHead>
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
                  Tidak ada data guru ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((guru, index) => (
                <TableRow key={guru.id}>
                  <TableCell className="text-center font-medium">{index + 1}</TableCell>
                  <TableCell>{guru.nip || "-"}</TableCell>
                  <TableCell>{guru.name}</TableCell>
                  <TableCell className="text-center">{guru.gender}</TableCell>
                  <TableCell>{guru.position}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(guru.status)}
                      className={guru.status === "Aktif" ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                    >
                      {guru.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => onView(guru)}
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
                          <DropdownMenuItem onClick={() => onEdit(guru)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setItemToDelete(guru.id)}
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
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data guru beserta akun login yang terhubung akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (itemToDelete) onDelete(itemToDelete);
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
