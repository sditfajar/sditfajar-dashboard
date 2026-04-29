"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { adminLinks } from "./Sidebar";
import { SidebarNav } from "./SidebarNav";
import { ThemeToggle } from "./ThemeToggle";

import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

export function Navbar() {
  const pathname = usePathname();
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
    <header className="flex h-14 w-full items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 overflow-hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="flex flex-col w-[70vw] sm:w-[300px]">
          <SheetHeader className="text-left mb-4">
            <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <Image
                src="/favicon.png"
                alt="Logo SDIT Fajar"
                width={32}
                height={32}
                className="rounded-md"
              />
              <SheetTitle>SDIT Fajar Admin</SheetTitle>
            </Link>
          </SheetHeader>

          <div className="flex-1 overflow-auto py-2">
            <SidebarNav items={adminLinks} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1">
        {/* Placeholder for Search or other topbar actions */}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
    </header>
  );
}
