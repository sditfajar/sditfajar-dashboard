"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AbsensiGuruInput } from "@/components/guru/AbsensiGuruInput";
import { AbsensiGuruLaporan } from "@/components/guru/AbsensiGuruLaporan";
import { FadeIn } from "@/components/ui/fade-in";

export default function AbsensiGuruPage() {
  return (
    <div className="w-full overflow-x-hidden px-0 md:px-6 space-y-6">
      <FadeIn className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Absensi Geofencing Guru</h1>
          <p className="text-sm text-muted-foreground">
            Lakukan absensi mandiri dan pantau rekapitulasi absensi guru berbasis lokasi.
          </p>
        </div>
      </FadeIn>

      <FadeIn className="flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <Tabs defaultValue="input" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="input">Input Absensi</TabsTrigger>
            <TabsTrigger value="laporan">Laporan Absensi</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-0 outline-none">
            <AbsensiGuruInput />
          </TabsContent>

          <TabsContent value="laporan" className="mt-0 outline-none">
            <AbsensiGuruLaporan />
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
