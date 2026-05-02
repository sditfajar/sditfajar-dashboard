"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";
import { Loader2, User, Plus, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());


const formSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  nip: z.string().optional(),
  photoURL: z.string().optional().or(z.literal("")),
  gender: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

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
      setPreviewUrl(defaultValues.photoURL || null);
    } else if (!open) {
      form.reset();
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadedUrl(null);
    }
  }, [open, defaultValues, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File terlalu besar", { description: "Maksimal ukuran file adalah 5MB." });
        e.target.value = ""; // Reset input
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadedUrl(null); // Reset URL lama
      
      // Langsung upload di background agar cepat
      uploadImage(file).then(downloadUrl => {
        setUploadedUrl(downloadUrl);
      }).catch(() => {
        // Error sudah dihandle di uploadImage
      });
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `profil-guru/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error: any) => {
            console.error("Upload error:", error);
            let errorMessage = "Gagal mengunggah gambar.";
            if (error.code === 'storage/unauthorized') {
              errorMessage = "Akses ditolak. Cek Firebase Storage Rules Anda.";
            }
            toast.error("Upload Gagal", { description: errorMessage });
            setIsUploading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setIsUploading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (error: any) {
      console.error("Upload process error:", error);
      setIsUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (values: GuruFormValues) => {
    const data = { ...values };

    if (!isEditing && (!data.password || data.password.length < 6)) {
      form.setError("password", { message: "Password minimal 6 karakter untuk guru baru" });
      return;
    }
    if (isEditing && data.password && data.password.length > 0 && data.password.length < 6) {
      form.setError("password", { message: "Password minimal 6 karakter" });
      return;
    }

    try {
      // Jika sudah ada URL hasil upload background, gunakan itu
      if (selectedFile && uploadedUrl) {
        data.photoURL = uploadedUrl;
      } 
      // Jika belum ada tapi ada file, lakukan upload (atau tunggu jika sedang jalan)
      else if (selectedFile) {
        const url = await uploadImage(selectedFile);
        data.photoURL = url;
      }

      await onSubmit(data);
      form.reset();
      setPreviewUrl(null);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadedUrl(null);
      toast.success("Berhasil", { description: `Data guru ${isEditing ? 'diperbarui' : 'berhasil disimpan'}.` });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal Menyimpan", { description: "Terjadi kesalahan saat menyimpan data ke database." });
    }
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Posisi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Guru">Guru</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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

            <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-muted/20 rounded-2xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-background shadow-xl transition-all group-hover:ring-4 group-hover:ring-primary/10">
                  <AvatarImage src={previewUrl || ""} className="object-cover" />
                  <AvatarFallback className="bg-primary/5">
                    <User className="h-12 w-12 text-primary/20" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-full border-2 border-background shadow-lg cursor-pointer hover:scale-110 transition-transform active:scale-95">
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 text-white" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                      {uploadProgress}%
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-3 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                {isUploading ? "Mengunggah..." : (selectedFile ? "Foto Terpilih" : "Upload Foto")}
              </p>

            </div>

            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-muted-foreground mb-4">Akses Login</h4>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <br></br>{isEditing && "(Untuk Login di akun Guru)"}</FormLabel>
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
              <Button type="submit" disabled={isLoading || isUploading}>
                {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isUploading ? `Mengunggah ${uploadProgress}%` : (isLoading ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Guru"))}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
