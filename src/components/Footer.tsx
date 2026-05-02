import Link from 'next/link';
import { GraduationCap, Facebook, Instagram, Twitter } from 'lucide-react';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/favicon.png" alt="SDIT Fajar Logo" width={48} height={48} className="h-12 w-auto" />
              <span className="text-2xl font-bold tracking-tight text-primary">SDIT FAJAR</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">Mewujudkan generasi Qur&apos;ani yang cerdas, mandiri, berprestasi, dan berwawasan global untuk masa depan gemilang.</p>
            <div className="flex gap-4">
              <a href="#" className="bg-secondary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-secondary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-secondary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Tautan Cepat</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#berita" className="hover:text-primary transition-colors">
                  Berita Terbaru
                </Link>
              </li>
              <li>
                <Link href="#profil" className="hover:text-primary transition-colors">
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="#akademik" className="hover:text-primary transition-colors">
                  Program Akademik
                </Link>
              </li>
              <li>
                <Link href="#manajemen" className="hover:text-primary transition-colors">
                  Manajemen Sekolah
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-primary transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Pendaftaran</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                  Info Pendaftaran
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                  Biaya Pendidikan
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                  Formulir Online
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-primary transition-colors">
                  Brosur Digital
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center md:flex md:justify-between items-center text-sm text-muted-foreground flex-col sm:flex-row gap-4">
          <p>&copy; {new Date().getFullYear()} SDIT Fajar. Hak Cipta Dilindungi.</p>
          <div className="space-x-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
