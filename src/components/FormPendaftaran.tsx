"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitPendaftaran } from "@/lib/firebase/ppdb";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const formSchema = z.object({
  namaLengkap: z.string().min(2, { message: "Nama lengkap harus diisi." }),
  tempatLahir: z.string().min(2, { message: "Tempat lahir harus diisi." }),
  tanggalLahir: z.date({ error: "Tanggal lahir harus dipilih." }),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"], { error: "Pilih jenis kelamin." }),
  alamatLengkap: z.string().min(10, { message: "Alamat lengkap harus diisi detail." }),
  namaAyah: z.string().min(2, { message: "Nama Ayah Kandung harus diisi." }),
  namaIbu: z.string().min(2, { message: "Nama Ibu Kandung harus diisi." }),
  waOrtu: z.string().min(10, { message: "Nomor WA harus valid (min 10 angka)." }),
  fileKK: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, "Maksimal ukuran file 2MB.")
    .refine((files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Format harus .jpg, .png, atau .pdf."),
  fileAkta: z
    .any()
    .optional()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, "Maksimal ukuran file 2MB.")
    .refine((files) => !files || files.length === 0 || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type), "Format harus .jpg, .png, atau .pdf."),
});

export function FormPendaftaran() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namaLengkap: "",
      tempatLahir: "",
      alamatLengkap: "",
      namaAyah: "",
      namaIbu: "",
      waOrtu: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      const fileKK = values.fileKK?.[0] || null;
      const fileAkta = values.fileAkta?.[0] || null;
      
      const dataToSave = {
        namaLengkap: values.namaLengkap,
        tempatLahir: values.tempatLahir,
        tanggalLahir: format(values.tanggalLahir, "yyyy-MM-dd"),
        jenisKelamin: values.jenisKelamin,
        alamatLengkap: values.alamatLengkap,
        namaAyah: values.namaAyah,
        namaIbu: values.namaIbu,
        waOrtu: values.waOrtu,
      };

      await submitPendaftaran(dataToSave, fileKK, fileAkta);
      
      toast.success("Pendaftaran Berhasil!", {
        description: "Data Anda telah masuk ke sistem kami. Tim kami akan segera menghubungi nomor WA yang terdaftar.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Pendaftaran Gagal", {
        description: "Terjadi kesalahan saat mengirim data. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 bg-card rounded-2xl shadow-xl border">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Formulir Pendaftaran Siswa Baru</h2>
        <p className="text-muted-foreground">Isi data di bawah ini dengan lengkap dan benar sesuai dengan dokumen resmi (KK / Akta).</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Diri Siswa */}
            <div className="space-y-6 md:col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">A. Data Diri Calon Siswa</h3>
            </div>

            <FormField
              control={form.control}
              name="namaLengkap"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nama Lengkap (Sesuai Akta Kelahiran)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tempatLahir"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempat Lahir</FormLabel>
                  <FormControl>
                    <Input placeholder="Kota/Kabupaten" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalLahir"
              render={({ field }) => (
                <FormItem className="flex flex-col pt-2">
                  <FormLabel>Tanggal Lahir</FormLabel>
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
                            format(field.value, "PPP", { locale: id })
                          ) : (
                            <span>Pilih tanggal lahir</span>
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
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
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
              name="jenisKelamin"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Jenis Kelamin</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Laki-laki" />
                        </FormControl>
                        <FormLabel className="font-normal">Laki-laki</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Perempuan" />
                        </FormControl>
                        <FormLabel className="font-normal">Perempuan</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alamatLengkap"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Sertakan nama jalan, RT/RW, kelurahan, kecamatan..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data Orang Tua */}
            <div className="space-y-6 md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold border-b pb-2">B. Data Orang Tua / Wali</h3>
            </div>

            <FormField
              control={form.control}
              name="namaAyah"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ayah Kandung</FormLabel>
                  <FormControl>
                    <Input placeholder="Sesuai KK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="namaIbu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ibu Kandung</FormLabel>
                  <FormControl>
                    <Input placeholder="Sesuai KK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="waOrtu"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nomor WhatsApp Aktif</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 081234567890" type="tel" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nomor ini akan dihubungi oleh panitia terkait info seleksi/wawancara.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Upload Dokumen */}
            <div className="space-y-6 md:col-span-2 mt-4">
              <h3 className="text-lg font-semibold border-b pb-2">C. Unggah Dokumen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Maksimal ukuran file adalah 2MB per dokumen. Format yang didukung: .jpg, .jpeg, .png, .pdf
              </p>
            </div>

            <FormField
              control={form.control}
              name="fileKK"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Kartu Keluarga (KK)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files)
                        }
                        {...fieldProps}
                        className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 cursor-pointer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileAkta"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Akta Kelahiran</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) =>
                        onChange(event.target.files && event.target.files)
                      }
                      {...fieldProps}
                      className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Kirim Pendaftaran
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
