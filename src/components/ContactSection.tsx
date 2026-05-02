'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addPesanKontak } from '@/lib/firebase/pesan';
import { FadeIn, FadeInStagger } from '@/components/ui/fade-in';

export function ContactSection() {
  const [formData, setFormData] = useState({
    nama: '',
    kontak: '',
    pesan: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.kontak || !formData.pesan) {
      toast.error('Harap isi semua kolom formulir.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addPesanKontak(formData);
      toast.success('Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.');
      setFormData({ nama: '', kontak: '', pesan: '' });
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="kontak" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Hubungi Kami</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">Punya pertanyaan seputar pendaftaran atau program sekolah? Jangan ragu untuk menghubungi kami.</p>
        </FadeIn>

        <FadeInStagger className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info & Map */}
          <FadeIn className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <MapPin className="h-5 w-5" />
                  <h4 className="font-bold text-foreground">Alamat</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">Jl. Jati III No.04 RT 07/07, Jatijajar, Kec. Tapos, Kota Depok, Jawa Barat 16466</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Phone className="h-5 w-5" />
                  <h4 className="font-bold text-foreground">Telepon / WA</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  (021) 1234-5678
                  <br />
                  0812-3456-7890 (WA)
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Mail className="h-5 w-5" />
                  <h4 className="font-bold text-foreground">Email</h4>
                </div>
                <p className="text-muted-foreground text-sm">info@sditfajar.sch.id</p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Clock className="h-5 w-5" />
                  <h4 className="font-bold text-foreground">Jam Operasional</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  Senin - Jumat: 07.00 - 15.00
                  <br />
                  Sabtu: 08.00 - 12.00 (Hanya untuk pendaftaran)
                </p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="w-full h-[300px] rounded-lg overflow-hidden border border-border shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.841574984789!2d106.86300851164633!3d-6.414396693549666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eb077a79bd15%3A0xa7a986c15f4b33ae!2sSDIT%20FAJAR%20%7C%20Sekolah%20Dasar%20Islam%20Terpadu!5e0!3m2!1sid!2sid!4v1777253929898!5m2!1sid!2sid"
                title="Peta Lokasi SDIT Fajar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <FadeIn className="bg-secondary/30 rounded-2xl p-8 border border-border shadow-sm">
            <h3 className="text-2xl font-extrabold mb-6">Kirim Pesan</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nama Lengkap
                </label>
                <Input id="name" placeholder="Masukkan nama Anda" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  Email / No. WhatsApp
                </label>
                <Input id="contact" placeholder="Email atau nomor yang bisa dihubungi" value={formData.kontak} onChange={(e) => setFormData({ ...formData, kontak: e.target.value })} disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Pesan
                </label>
                <Textarea id="message" placeholder="Tuliskan pertanyaan atau pesan Anda..." rows={5} value={formData.pesan} onChange={(e) => setFormData({ ...formData, pesan: e.target.value })} disabled={isSubmitting} />
              </div>
              <Button type="submit" className="w-full h-11 text-base mt-2 bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  'Kirim Pesan'
                )}
              </Button>
            </form>
          </FadeIn>
        </FadeInStagger>
      </div>
    </section>
  );
}
