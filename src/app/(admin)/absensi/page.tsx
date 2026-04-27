"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AbsensiInput } from "@/components/absensi/AbsensiInput";
import { AbsensiLaporan } from "@/components/absensi/AbsensiLaporan";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiPage() {
  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Manajemen Absensi</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kehadiran harian dan lihat rekapitulasi absensi siswa.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="input">Input Harian</TabsTrigger>
            <TabsTrigger value="laporan">Laporan Bulanan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="mt-0 outline-none">
            <AbsensiInput />
          </TabsContent>
          
          <TabsContent value="laporan" className="mt-0 outline-none">
            <AbsensiLaporan />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </>
  );
}
