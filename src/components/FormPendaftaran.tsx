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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitPendaftaran } from "@/lib/firebase/ppdb";

const formSchema = z.object({
  namaLengkap: z.string().min(2, { message: "Nama lengkap harus diisi." }),
  tempatLahir: z.string().min(2, { message: "Tempat lahir harus diisi." }),
  tanggalLahir: z.date({ error: "Tanggal lahir harus dipilih." }),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"], { error: "Pilih jenis kelamin." }),
  alamatLengkap: z.string().min(10, { message: "Alamat lengkap harus diisi detail." }),
  namaAyah: z.string().min(2, { message: "Nama Ayah Kandung harus diisi." }),
  namaIbu: z.string().min(2, { message: "Nama Ibu Kandung harus diisi." }),
  waOrtu: z.string().min(10, { message: "Nomor WA harus valid (min 10 angka)." }),
});

export function FormPendaftaran() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

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

      // fileKK dan fileAkta di-set null karena unggah dokumen dihilangkan
      await submitPendaftaran(dataToSave, null, null);
      
      setIsSuccessPopupOpen(true);
      
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

      <AlertDialog open={isSuccessPopupOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Pendaftaran Berhasil!</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground mt-2">
              Data pendaftaran Anda telah masuk ke sistem kami. 
              <br/><br/>
              Langkah selanjutnya, <b>Wajib melampirkan dokumen</b> berikut:
              <ul className="list-disc ml-5 mt-2 mb-2 font-medium">
                <li>Kartu Keluarga (KK)</li>
                <li>Akta Kelahiran</li>
                <li>Ijazah SD</li>
              </ul>
              Silakan kirim dokumen tersebut melalui WhatsApp ke Admin Pendaftaran SDIT Fajar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction asChild className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-base font-semibold">
              <a 
                href="https://wa.me/6289517795206?text=Assalamu%27alaikum%20Admin%2C%20saya%20sudah%20mengisi%20formulir%20pendaftaran%20Siswa%20Baru.%20Berikut%20saya%20lampirkan%20dokumen%20pendukung%20(KK%2C%20Akta%2C%20dan%20Ijazah%20SD)."
                target="_blank"
                rel="noopener noreferrer"
              >
                Kirim Dokumen via WhatsApp
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
