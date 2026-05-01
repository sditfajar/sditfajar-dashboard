"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface GuruDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guru: any | null; // using any for now or define an interface
}

export function GuruDetailDialog({ open, onOpenChange, guru }: GuruDetailDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (!guru) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] max-w-lg mx-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Detail Data Profile</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          <Avatar className="w-16 h-16 border shadow-sm">
            <AvatarImage src={guru.photoURL || ""} alt={guru.name} className="object-cover" />
            <AvatarFallback className="bg-muted">
              <User className="w-8 h-8 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{guru.name}</h3>
            <p className="text-sm text-muted-foreground">{guru.position} {guru.status === 'Aktif' ? '• Aktif' : `• ${guru.status}`}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
          <div>
            <p className="text-muted-foreground">NIP / NUPTK</p>
            <p className="font-medium">{guru.nip || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Jenis Kelamin</p>
            <p className="font-medium">{guru.gender === "L" ? "Laki-laki" : guru.gender === "P" ? "Perempuan" : guru.gender}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Wali Kelas</p>
            <p className="font-medium">{guru.classTeacher || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Mata Pelajaran</p>
            <p className="font-medium">{guru.subject || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Nomor WhatsApp</p>
            <p className="font-medium">{guru.phone || "-"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email (Login)</p>
            <p className="font-medium break-words">{guru.email || "-"}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <p className="text-muted-foreground text-sm mb-1">Password</p>
          <div className="flex items-center gap-2">
            <p className="font-medium bg-muted px-3 py-2 rounded-md flex-1 font-mono text-sm tracking-widest">
              {showPassword ? (guru.password || "Tidak tersedia") : "••••••••"}
            </p>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
