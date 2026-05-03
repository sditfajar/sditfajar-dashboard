"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

export function IdleLogout() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 30 menit dalam milidetik (1800 detik)
  const TIMEOUT_MS = 30 * 60 * 1000;

  const handleLogout = async () => {
    try {
      toast.error("Sesi Berakhir", {
        description: "Sesi Anda telah berakhir karena tidak ada aktivitas selama 30 menit.",
        duration: 5000,
      });
      await signOut(auth);
      await fetch("/api/auth/session", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error during auto-logout:", error);
    }
  };

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(handleLogout, TIMEOUT_MS);
  };

  useEffect(() => {
    // Jalankan timer saat komponen pertama kali di-mount
    resetTimer();

    // Daftar event yang dianggap sebagai aktivitas
    const events = ["mousemove", "keydown", "click", "scroll"];
    
    // Tambahkan event listener ke window
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Cleanup function untuk mencegah memory leak
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  // Komponen ini hanya berjalan di background dan tidak merender elemen UI apa pun
  return null;
}
