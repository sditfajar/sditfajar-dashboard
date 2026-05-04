"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { siswaLinks } from "./SidebarSiswa";
import { SidebarNav } from "@/components/admin/SidebarNav";
import { SidebarProfile } from "@/components/admin/SidebarProfile";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export function NavbarSiswa() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:h-[60px] lg:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col w-[80vw] sm:w-[300px] p-0">
          <SheetHeader className="text-left p-6 pb-2">
            <Link href="/dashboard-siswa" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt="Logo SDIT Fajar"
                width={32}
                height={32}
                className="rounded-md"
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-normal text-gray-500 leading-tight">
                  Portal Siswa
                </span>
                <SheetTitle className="leading-tight mt-0 text-base">SDIT Fajar</SheetTitle>
              </div>
            </Link>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            <SidebarNav items={siswaLinks} onNavigate={() => setOpen(false)} />
          </div>
          <div className="mt-auto border-t">
            <SidebarProfile />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        {/* Placeholder for Search or other topbar actions */}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
