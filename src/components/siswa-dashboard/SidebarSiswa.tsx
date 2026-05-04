"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Bell,
  Calendar,
} from "lucide-react";
import { NavItem, SidebarNav } from "@/components/admin/SidebarNav";
import { SidebarProfile } from "@/components/admin/SidebarProfile";

export const siswaLinks: NavItem[] = [
  { name: "Dashboard", href: "/dashboard-siswa", icon: LayoutDashboard },
  { name: "Mata Pelajaran", href: "/mata-pelajaran", icon: BookOpen },
  { name: "Jadwal Pelajaran", href: "/jadwal-siswa", icon: Calendar },
  { name: "Tugas Saya", href: "/tugas-saya", icon: ClipboardList },
  { name: "Pengumuman", href: "/pengumuman", icon: Bell },
];

export function SidebarSiswa() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background h-screen sticky top-0">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard-siswa" className="flex items-center gap-2 font-semibold">
          <span className="text-lg flex items-center">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8 mr-2 object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-normal text-gray-500">Portal Siswa</span>
              <span>SDIT Fajar</span>
            </div>
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-2">
        <SidebarNav items={siswaLinks} />
      </div>
      <SidebarProfile />
    </aside>
  );
}
