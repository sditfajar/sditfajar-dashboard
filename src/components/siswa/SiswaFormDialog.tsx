"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Siswa } from "@/types/siswa";

// Helper: Title Case otomatis
const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const formSchema = z.object({
  nisn: z.string().min(1, "NISN wajib diisi"),
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  kelas: z.string().min(1, "Kelas wajib diisi"),
  namaWali: z.string().min(1, "Nama wali wajib diisi"),
  whatsappOrtu: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  status: z.enum(["Aktif", "Tidak Aktif", "Lulus"] as const),
});

export type SiswaFormValues = z.infer<typeof formSchema>;

interface SiswaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SiswaFormValues) => void;
  defaultValues?: Siswa | null;
  isEditing?: boolean;
}

export function SiswaFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isEditing = false,
}: SiswaFormDialogProps) {
  const form = useForm<SiswaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nisn: "",
      namaLengkap: "",
      kelas: "",
      namaWali: "",
      whatsappOrtu: "",
      status: "Aktif",
    },
  });

  useEffect(() => {
    if (defaultValues && open) {
      form.reset({
        nisn: defaultValues.nisn,
        namaLengkap: defaultValues.namaLengkap,
        kelas: defaultValues.kelas,
        namaWali: defaultValues.namaWali,
        whatsappOrtu: defaultValues.whatsappOrtu,
        status: defaultValues.status,
      });
    } else if (!open) {
      form.reset();
    }
  }, [defaultValues, open, form]);

  const handleSubmit = (data: SiswaFormValues) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Siswa" : "Tambah Siswa Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nisn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NISN</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NISN" {...field} disabled={isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama lengkap siswa"
                      {...field}
                      onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="kelas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Misal: 1A"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="namaWali"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Wali</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama wali/orang tua"
                      {...field}
                      onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="whatsappOrtu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Ortu</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                      <SelectItem value="Lulus" className="text-green-600 font-medium">Lulus</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit">{isEditing ? "Simpan Perubahan" : "Simpan Siswa"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
