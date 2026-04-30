"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import imageCompression from "browser-image-compression";
import { Trash2, Eye, Sparkles } from "lucide-react";
import { KontenBerita } from "@/types/konten";
import {
  getKontenBerita,
  addKontenBerita,
  deleteKontenBerita,
  uploadMediaBerita,
} from "@/lib/firebase/konten";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/success-dialog";

const formSchema = z.object({
  tanggal: z.date({ error: "Tanggal harus dipilih." }),
  judul: z.string().min(3, "Judul harus minimal 3 karakter."),
  deskripsiSingkat: z.string().min(10, "Deskripsi singkat minimal 10 karakter."),
  kontenLengkap: z.string().min(20, "Konten lengkap minimal 20 karakter."),
});

/** Tipe data untuk parameter addKontenBerita (tanpa id & createdAt). */
type KontenBeritaInput = Omit<KontenBerita, "id" | "createdAt">;

/** Tahapan proses submit untuk feedback UI pada tombol. */
type SubmitStage = "idle" | "compressing" | "uploading" | "saving";

export default function KontenPage() {
  const [data, setData] = useState<KontenBerita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState<SubmitStage>("idle");
  const [previewItem, setPreviewItem] = useState<KontenBerita | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"gambar" | "video" | "none">("none");
  const [successPopup, setSuccessPopup] = useState({
    open: false,
    title: "",
    description: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      deskripsiSingkat: "",
      kontenLengkap: "",
    },
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const kontenData = await getKontenBerita();
      setData(kontenData);
    } catch (error) {
      console.error("Gagal memuat konten:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2MB. Silakan kompres atau pilih file lain.");
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error("Format file harus gambar atau video (.mp4)");
      return;
    }

    setMediaFile(file);
    setMediaType(isImage ? "gambar" : "video");
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  /**
   * Kompresi gambar menggunakan browser-image-compression.
   * Berjalan di Web Worker agar tidak memblokir UI thread.
   */
  const compressImage = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) return file;

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    });

    // imageCompression mengembalikan Blob; bungkus ulang jadi File
    return new File([compressed], file.name, {
      type: compressed.type,
      lastModified: Date.now(),
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Tahap: Simpan ke Firestore
      setSubmitStage("saving");

      const kontenData: KontenBeritaInput = {
        tanggal: format(values.tanggal, "yyyy-MM-dd"),
        judul: values.judul,
        deskripsiSingkat: values.deskripsiSingkat,
        kontenLengkap: values.kontenLengkap,
        mediaType: "none",
      };

      await addKontenBerita(kontenData);

      toast.success("Konten berhasil ditambahkan!");
      setSuccessPopup({
        open: true,
        title: "Konten Berhasil Dipublikasikan!",
        description: `"${values.judul}" telah ditambahkan dan akan tampil di halaman utama.`,
      });
      form.reset();
      setIsFormOpen(false);
      loadData();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "Gagal menambahkan konten.";
      console.error("Submit konten error:", error);
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
      setSubmitStage("idle");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin hapus konten ini?")) return;
    try {
      await deleteKontenBerita(id);
      toast.success("Konten berhasil dihapus.");
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus konten.");
    }
  };

  return (
    <>
      <FadeIn className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Manajemen Konten</h1>
          <p className="text-sm text-muted-foreground">
            Kelola berita dan informasi yang tampil di halaman utama website.
          </p>
        </div>
      </FadeIn>

      {/* Action Grid with SVG Animation */}
      <FadeInStagger className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Tambah Konten Card */}
        <FadeIn>
          <button
            onClick={() => setIsFormOpen(true)}
            className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 sm:p-8 transition-all hover:border-primary/60 hover:bg-primary/10 dark:hover:bg-primary/20 hover:shadow-lg cursor-pointer w-full h-full min-h-[180px]"
          >
            <div className="relative">
              <svg
                className="h-16 w-16 text-primary/60 group-hover:text-primary transition-colors"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" className="animate-[spin_20s_linear_infinite]" />
                <path d="M32 20V44M20 32H44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="group-hover:stroke-[4] transition-all" />
              </svg>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-500 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm font-semibold text-primary/80 group-hover:text-primary transition-colors">
              Tambah Konten Baru
            </span>
          </button>
        </FadeIn>

        {/* Info Card - Total Berita */}
        <FadeIn>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 sm:p-8 h-full min-h-[180px]">
            <div className="relative">
              <svg
                className="h-16 w-16 text-blue-500/60"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="10" y="8" width="44" height="48" rx="4" stroke="currentColor" strokeWidth="2" />
                <line x1="18" y1="20" x2="46" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                <line x1="18" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse [animation-delay:200ms]" />
                <line x1="18" y1="36" x2="36" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse [animation-delay:400ms]" />
                <line x1="18" y1="44" x2="30" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse [animation-delay:600ms]" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{data.length}</p>
              <span className="text-sm text-muted-foreground">Total Berita</span>
            </div>
          </div>
        </FadeIn>

        {/* Info Card - Status */}
        <FadeIn>
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-6 sm:p-8 h-full min-h-[180px]">
            <div className="relative">
              <svg
                className="h-16 w-16 text-green-500/60"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" />
                <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_1.5s_ease-in-out_infinite]" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">Aktif</p>
              <span className="text-sm text-muted-foreground">Status Sistem</span>
            </div>
          </div>
        </FadeIn>
      </FadeInStagger>

      {/* Tabel Konten */}
      <FadeIn className="w-full flex flex-col flex-1 rounded-lg border shadow-sm p-3 sm:p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Judul</TableHead>
                <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Belum ada konten. Klik &quot;Tambah Konten Baru&quot; untuk mulai.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {item.tanggal
                        ? format(new Date(item.tanggal), "dd MMM yyyy", { locale: localeId })
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {item.judul}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate text-muted-foreground">
                      {item.deskripsiSingkat}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPreviewItem(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => item.id && handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </FadeIn>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95%] max-w-lg md:max-w-2xl mx-auto p-4 md:p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Konten Baru</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tanggal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Berita</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: localeId })
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Berita</FormLabel>
                    <FormControl>
                      <Input placeholder="Pendaftaran Gelombang 1 Dibuka" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deskripsiSingkat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Singkat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Segera daftarkan putra-putri Anda..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kontenLengkap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isi Berita Lengkap</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tulis isi berita secara detail..."
                        className="resize-none"
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {submitStage === "compressing"
                    ? "Mengompres..."
                    : submitStage === "uploading"
                      ? "Mengunggah..."
                      : submitStage === "saving"
                        ? "Menyimpan..."
                        : "Simpan Konten"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog (Full-page) */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="w-[95%] max-w-lg md:max-w-3xl mx-auto p-4 md:p-6 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{previewItem?.judul}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              {previewItem?.tanggal
                ? format(new Date(previewItem.tanggal), "dd MMMM yyyy", { locale: localeId })
                : ""}
            </p>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground italic mb-4">
              {previewItem?.deskripsiSingkat}
            </p>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {previewItem?.kontenLengkap}
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setPreviewItem(null)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={successPopup.open}
        onOpenChange={(open) => setSuccessPopup((prev) => ({ ...prev, open }))}
        title={successPopup.title}
        description={successPopup.description}
      />
    </>
  );
}
