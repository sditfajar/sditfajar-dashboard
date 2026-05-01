"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Calendar, Users, ClipboardList, MapPinCheck, BookOpen, Newspaper } from "lucide-react";
import { NavItem, SidebarNav } from "@/components/admin/SidebarNav";
import { SidebarProfile } from "@/components/admin/SidebarProfile";

export const guruLinks: NavItem[] = [
  { name: "Dashboard Guru", href: "/dashboard-guru", icon: LayoutDashboard },
  { name: "Mata Pelajaran", href: "/mapel-guru", icon: BookOpen },
  { name: "Jadwal Mengajar", href: "/jadwal-guru", icon: Calendar },
  { name: "Daftar Siswa", href: "#", icon: Users, disabled: true },
  { name: "Absen Kehadiran", href: "/absensi-guru", icon: MapPinCheck },
  { name: "Absensi Siswa", href: "/absensi-siswa", icon: ClipboardList },
  { name: "Konten", icon: Newspaper, disabled: true },
];

export function SidebarGuru() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background h-screen sticky top-0">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard-guru" className="flex items-center gap-2 font-semibold">
          <span className="text-lg flex items-center">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={30}
              height={30}
              className="h-6 w-6 mr-2 object-contain"
            />
            Portal Guru
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-2">
        <SidebarNav items={guruLinks} />
      </div>
      <SidebarProfile />
    </aside>
  );
}
