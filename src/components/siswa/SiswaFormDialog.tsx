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
  DialogDescription,
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
import { Switch } from "@/components/ui/switch";
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
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional(),
  buatAkunLms: z.boolean(),
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
      tempatLahir: "",
      tanggalLahir: "",
      buatAkunLms: false,
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
        tempatLahir: defaultValues.tempatLahir || "",
        tanggalLahir: defaultValues.tanggalLahir || "",
        buatAkunLms: false, // reset toggle on edit
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
      <DialogContent className="w-[95%] max-w-lg md:max-w-2xl mx-auto p-4 md:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Siswa" : "Tambah Siswa Baru"}</DialogTitle>
          <DialogDescription className="hidden">
            Formulir pengelolaan data siswa.
          </DialogDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tempatLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Lahir</FormLabel>
                    <FormControl>
                      <Input placeholder="Kota kelahiran" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tanggalLahir"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Lahir</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
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
            {!isEditing && (
              <FormField
                control={form.control}
                name="buatAkunLms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-blue-50/50 dark:bg-blue-950/20">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base font-semibold">Buat Akun LMS Siswa</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Siswa akan bisa login menggunakan email NISN. (Membutuhkan Tempat & Tanggal Lahir)
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-end pt-4">
              <Button type="submit">{isEditing ? "Simpan Perubahan" : "Simpan Siswa"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
