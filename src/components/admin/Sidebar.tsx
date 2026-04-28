"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, UserCog, CreditCard, Newspaper, FileText, ClipboardList, MessageSquare } from "lucide-react";

export const adminLinks = [
  { name: "Dashboard Admin", href: "/admin", icon: LayoutDashboard },
  { name: "Manajemen Siswa", href: "/siswa", icon: Users },
  { name: "Manajemen Guru", href: "/guru", icon: UserCog },
  { name: "Absensi", href: "/absensi", icon: ClipboardList },
  { name: "Pembayaran", href: "/pembayaran", icon: CreditCard },
  { name: "Manajemen Konten", href: "/konten", icon: Newspaper },
  { name: "Manajemen PPDB", href: "/ppdb", icon: FileText },
  { name: "Pesan Kontak", href: "/pesan", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex min-h-screen">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-lg flex items-center"><Image src="/favicon.png" alt="Logo" width={30} height={30} className="h-6 w-6 mr-2 object-contain" />SDIT Fajar Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  isActive ? "bg-muted text-primary" : ""
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
