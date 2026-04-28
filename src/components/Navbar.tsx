'use client';

import * as React from 'react';
import Link from 'next/link';
import { Menu, GraduationCap, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Beranda', href: '#' },
  { name: 'Berita', href: '#berita' },
  { name: 'Profil', href: '#profil' },
  { name: 'Akademik', href: '#akademik' },
  { name: 'Kontak', href: '#kontak' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/favicon.png" alt="SDIT Fajar Logo" width={40} height={40} className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight"></span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full" asChild>
              <Link href="/dashboard" title="Dashboard">
                <LogIn className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </Button>
          </div>
          <Button asChild>
            <Link href="/pendaftaran">Daftar Sekarang</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/dashboard" title="Dashboard">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="sr-only">
                <SheetTitle>Menu Navigasi</SheetTitle>
              </div>
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-lg font-medium text-foreground transition-colors hover:text-primary">
                    {link.name}
                  </Link>
                ))}
                <Button asChild className="mt-4 w-full">
                  <Link href="/pendaftaran">Daftar Sekarang</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
