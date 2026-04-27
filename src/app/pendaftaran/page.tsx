import { FormPendaftaran } from "@/components/FormPendaftaran";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PendaftaranPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              Tahun Ajaran 2026/2027
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-lg">
              Silakan isi formulir di bawah ini dengan data yang sebenarnya. Siapkan juga file hasil scan/foto Kartu Keluarga dan Akta Kelahiran.
            </p>
          </div>

          <FormPendaftaran />
        </div>
      </main>

      <Footer />
    </div>
  );
}
