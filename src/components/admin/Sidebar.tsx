"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserCog,
  CreditCard,
  Newspaper,
  FileText,
  ClipboardList,
  MessageSquare,
  Settings,
} from "lucide-react";
import { NavItem, SidebarNav } from "./SidebarNav";

export const adminLinks: NavItem[] = [
  { name: "Dashboard Admin", href: "/admin", icon: LayoutDashboard },
  {
    name: "Manajemen Siswa",
    icon: Users,
    children: [
      { name: "Data Siswa", href: "/siswa" },
      { name: "Absensi Siswa", href: "/absensi" },
      { name: "Pembayaran Siswa", href: "/pembayaran" },
      { name: "Data Siswa Lainnya", disabled: true },
    ],
  },
  {
    name: "Manajemen Guru",
    icon: UserCog,
    children: [
      { name: "Data Guru", href: "/guru" },
      { name: "Absensi Guru", href: "/guru/absensi" },
    ],
  },
  {
    name: "Manajemen Konten",
    icon: Newspaper,
    children: [
      { name: "Konten", href: "/konten" },
    ],
  },
  {
    name: "Manajemen PPDB",
    icon: FileText,
    children: [
      { name: "Formulir Website", href: "/ppdb" },
    ],
  },
  { name: "Pesan Kontak", href: "/pesan", icon: MessageSquare },
  { name: "Setting", icon: Settings, disabled: true },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex min-h-screen">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-lg flex items-center">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={30}
              height={30}
              className="h-6 w-6 mr-2 object-contain"
            />
            <div className="flex flex-col leading-tight">
              {/* edited */}
              <span className="text-[11px] font-normal text-gray-500">Dashboard Admin</span>
              <span>SDIT Fajar</span>
            </div>
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4 px-2">
        <SidebarNav items={adminLinks} />
      </div>
    </aside>
  );
}
