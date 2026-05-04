"use client";

import { useState, useMemo, useRef, Fragment } from "react";
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
import { MoreHorizontal, Edit, Trash2, Search, Plus, Filter, X, Download } from "lucide-react";
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
  const printRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.nama_mapel.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKelas = filterKelas === "semua" || item.kategori_kelas === filterKelas;
      return matchSearch && matchKelas;
    });
  }, [data, searchQuery, filterKelas]);

  const groupedData = useMemo(() => {
    const groups: Record<string, Subject[]> = {};
    filteredData.forEach((mapel) => {
      const kelas = mapel.kategori_kelas;
      if (!groups[kelas]) groups[kelas] = [];
      groups[kelas].push(mapel);
    });

    Object.keys(groups).forEach(kelas => {
      groups[kelas].sort((a, b) => a.nama_mapel.localeCompare(b.nama_mapel));
    });

    return groups;
  }, [filteredData]);

  const getKodeMapel = (nama: string, kelas: string) => {
    const prefix = nama.substring(0, 3).toUpperCase();
    return `${prefix}-${kelas}`;
  };

  const handleDownload = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow || !printRef.current) return;

    const tableHTML = printRef.current.innerHTML;
    const titleKelas = filterKelas === "semua" ? "Semua Kelas" : `Kelas ${filterKelas}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Daftar Mapel (${titleKelas}) - SDIT Fajar</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #111; }
            h2 { font-size: 18px; margin-bottom: 4px; }
            p { font-size: 13px; color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-weight: 600; border: 1px solid #e5e7eb; }
            td { padding: 7px 12px; border: 1px solid #e5e7eb; white-space: nowrap; }
            .group-row td { background: #eff6ff; font-weight: 600; color: #2563eb; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h2>Daftar Mata Pelajaran (${titleKelas})</h2>
          <p>SDIT Fajar &mdash; Dicetak pada ${new Date().toLocaleDateString("id-ID", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}</p>
          ${tableHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 400);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
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
        <div className="flex items-center gap-2 w-full lg:w-auto flex-col sm:flex-row">
          <Button
            onClick={handleDownload}
            disabled={isLoading || filteredData.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download Mapel
          </Button>
          <Button onClick={onAdd} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Tambah Mapel
          </Button>
        </div>
      </div>

      {/* Hidden table for print */}
      <div ref={printRef} className="hidden">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Kode Mapel</th>
              <th>Mata Pelajaran</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedData)
              .sort(([kelasA], [kelasB]) => kelasA.localeCompare(kelasB, undefined, { numeric: true }))
              .map(([kelas, mapelList]) => (
                <Fragment key={kelas}>
                  <tr className="group-row">
                    <td colSpan={4}>📖 Daftar Mapel Kelas {kelas}</td>
                  </tr>
                  {mapelList.map((mapel, index) => (
                    <tr key={mapel.id}>
                      <td>{index + 1}</td>
                      <td>{getKodeMapel(mapel.nama_mapel, mapel.kategori_kelas)}</td>
                      <td>{mapel.nama_mapel}</td>
                      <td>Kelas {mapel.kategori_kelas} • {mapel.tipe}</td>
                    </tr>
                  ))}
                </Fragment>
              ))}
          </tbody>
        </table>
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
              Object.entries(groupedData)
                .sort(([kelasA], [kelasB]) => kelasA.localeCompare(kelasB, undefined, { numeric: true }))
                .map(([kelas, mapelList]) => (
                  <Fragment key={kelas}>
                    <TableRow className="bg-primary/5 hover:bg-primary/5">
                      <TableCell colSpan={5} className="font-semibold py-3 text-primary">
                        <span className="flex items-center gap-2">
                          <span className="whitespace-nowrap">📖 Daftar Mapel Kelas {kelas}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                    {mapelList.map((mapel, index) => (
                      <TableRow key={mapel.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell className="font-semibold">{mapel.nama_mapel}</TableCell>
                        <TableCell>
                          Kelas {mapel.kategori_kelas}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={mapel.tipe === "Umum" ? "default" : mapel.tipe === "Agama" ? "outline" : "secondary"}
                            className={mapel.tipe === "Agama" ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : ""}
                          >
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
