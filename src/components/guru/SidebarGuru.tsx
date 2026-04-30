"use client";

import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Calendar, Users, ClipboardList } from "lucide-react";
import { NavItem, SidebarNav } from "@/components/admin/SidebarNav";
import { SidebarProfile } from "@/components/admin/SidebarProfile";

export const guruLinks: NavItem[] = [
  { name: "Dashboard Guru", href: "/dashboard-guru", icon: LayoutDashboard },
  { name: "Jadwal Mengajar", href: "#", icon: Calendar, disabled: true },
  { name: "Daftar Siswa", href: "#", icon: Users, disabled: true },
  { name: "Absensi Siswa", href: "/absensi-siswa", icon: ClipboardList },
];

export function SidebarGuru() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex min-h-screen">
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
