import Link from 'next/link';
import { GraduationCap, Facebook, Instagram, Twitter } from 'lucide-react';

import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-50 dark:bg-slate-950 dark:text-blue-200 py-12 border-t dark:border-blue-900/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo-sdit.png" alt="SDIT Fajar Logo" width={48} height={48} className="h-12 w-auto" />
              <span className="text-2xl font-bold tracking-tight"></span>
            </Link>
            <p className="text-slate-300 dark:text-blue-200/70 max-w-sm mb-6">Mewujudkan generasi Qur&apos;ani yang cerdas, mandiri, berprestasi, dan berwawasan global untuk masa depan gemilang.</p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 dark:bg-blue-900/30 p-2 rounded-full hover:bg-primary dark:hover:bg-blue-800 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="bg-slate-800 dark:bg-blue-900/30 p-2 rounded-full hover:bg-primary dark:hover:bg-blue-800 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="bg-slate-800 dark:bg-blue-900/30 p-2 rounded-full hover:bg-primary dark:hover:bg-blue-800 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-white dark:text-blue-100">Tautan Cepat</h4>
            <ul className="space-y-2 text-slate-300 dark:text-blue-200/70">
              <li>
                <Link href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#berita" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Berita Terbaru
                </Link>
              </li>
              <li>
                <Link href="#profil" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Profil Sekolah
                </Link>
              </li>
              <li>
                <Link href="#akademik" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Program Akademik
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-white dark:text-blue-100">Pendaftaran</h4>
            <ul className="space-y-2 text-slate-300 dark:text-blue-200/70">
              <li>
                <Link href="/pendaftaran" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Info Pendaftaran
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Biaya Pendidikan
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Formulir Online
                </Link>
              </li>
              <li>
                <Link href="/pendaftaran" className="hover:text-white dark:hover:text-blue-300 transition-colors">
                  Brosur Digital
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 dark:border-blue-900/30 pt-8 text-center md:flex md:justify-between items-center text-sm text-slate-400 dark:text-blue-300/60 flex-col sm:flex-row gap-4">
          <p>&copy; {new Date().getFullYear()} SDIT Fajar. Hak Cipta Dilindungi.</p>
          <div className="space-x-4">
            <Link href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-white dark:hover:text-blue-300 transition-colors">
              Syarat &amp; Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
