"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Subject } from "@/lib/firebase/pembelajaran";

interface MapelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Subject, "id" | "createdAt" | "updatedAt">) => void;
  isLoading: boolean;
  isEditing: boolean;
  defaultValues: Subject | null;
}

export function MapelFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  isEditing,
  defaultValues,
}: MapelFormDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Omit<Subject, "id" | "createdAt" | "updatedAt">>();

  useEffect(() => {
    if (open) {
      if (defaultValues && isEditing) {
        setValue("nama_mapel", defaultValues.nama_mapel);
        setValue("kategori_kelas", defaultValues.kategori_kelas);
        setValue("tipe", defaultValues.tipe);
      } else {
        reset();
      }
    }
  }, [open, defaultValues, isEditing, setValue, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Mata Pelajaran</label>
            <Input
              {...register("nama_mapel", { required: "Nama mapel wajib diisi" })}
              placeholder="Contoh: Matematika"
            />
            {errors.nama_mapel && <p className="text-xs text-destructive">{errors.nama_mapel.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Kategori Kelas</label>
            <Select 
              value={watch("kategori_kelas") || ""} 
              onValueChange={(val) => setValue("kategori_kelas", val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Kelas 1</SelectItem>
                <SelectItem value="2">Kelas 2</SelectItem>
                <SelectItem value="3">Kelas 3</SelectItem>
                <SelectItem value="4">Kelas 4</SelectItem>
                <SelectItem value="5">Kelas 5</SelectItem>
                <SelectItem value="6">Kelas 6</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("kategori_kelas", { required: "Kelas wajib dipilih" })} />
            {errors.kategori_kelas && <p className="text-xs text-destructive">{errors.kategori_kelas.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipe Mata Pelajaran</label>
            <Select 
              value={watch("tipe") || ""} 
              onValueChange={(val) => setValue("tipe", val as "Umum" | "Agama", { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Umum">Umum</SelectItem>
                <SelectItem value="Agama">Agama</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" {...register("tipe", { required: "Tipe wajib dipilih" })} />
            {errors.tipe && <p className="text-xs text-destructive">{errors.tipe.message}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Simpan Perubahan" : "Simpan Mapel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
