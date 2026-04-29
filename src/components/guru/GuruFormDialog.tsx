"use client";

import { useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

const formSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  nip: z.string().optional(),
  photoURL: z.string().url("URL Foto tidak valid").optional().or(z.literal("")),
  gender: z.enum(["L", "P"], {
    required_error: "Pilih jenis kelamin",
    invalid_type_error: "Pilih jenis kelamin"
  }),
  position: z.string().min(1, "Posisi wajib diisi"),
  classTeacher: z.string().optional(),
  subject: z.string().optional(),
  phone: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional(), // Validation handled manually
  status: z.enum(["Aktif", "Cuti", "Pensiun"] as const),
});

export type GuruFormValues = z.infer<typeof formSchema>;

interface GuruFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: GuruFormValues) => Promise<void>;
  isLoading?: boolean;
  isEditing?: boolean;
  defaultValues?: any;
}

export function GuruFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  isEditing = false,
  defaultValues,
}: GuruFormDialogProps) {
  const form = useForm<GuruFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nip: "",
      photoURL: "",
      gender: "L",
      position: "",
      classTeacher: "",
      subject: "",
      phone: "",
      email: "",
      password: "",
      status: "Aktif",
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name || "",
        nip: defaultValues.nip || "",
        photoURL: defaultValues.photoURL || "",
        gender: defaultValues.gender || "L",
        position: defaultValues.position || "",
        classTeacher: defaultValues.classTeacher || "",
        subject: defaultValues.subject || "",
        phone: defaultValues.phone || "",
        email: defaultValues.email || "",
        password: "", // Jangan tampilkan password lama
        status: defaultValues.status || "Aktif",
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, defaultValues, form]);

  const handleSubmit = async (data: GuruFormValues) => {
    if (!isEditing && (!data.password || data.password.length < 6)) {
      form.setError("password", { message: "Password minimal 6 karakter untuk guru baru" });
      return;
    }
    if (isEditing && data.password && data.password.length > 0 && data.password.length < 6) {
      form.setError("password", { message: "Password minimal 6 karakter" });
      return;
    }
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-lg md:max-w-2xl mx-auto p-4 md:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Data Guru" : "Tambah Guru Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nama Lengkap & Gelar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Budi Santoso, S.Pd."
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
              name="nip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIP / NUPTK</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NIP (Opsional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih L/P" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="L">Laki-laki (L)</SelectItem>
                      <SelectItem value="P">Perempuan (P)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posisi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Posisi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Guru">Guru</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Karyawan">Karyawan</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <SelectValue placeholder="Pilih Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Cuti">Cuti</SelectItem>
                      <SelectItem value="Pensiun">Pensiun</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classTeacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wali Kelas</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 1A, atau -" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Pelajaran</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Matematika" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="08..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto Profil (URL)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Akses Login</h4>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="guru@sditfajar.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password {isEditing && "(Kosongkan jika tidak ingin diubah)"}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder={isEditing ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Guru")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
