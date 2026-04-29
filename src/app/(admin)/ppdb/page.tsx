"use client";

import { useState, useEffect } from "react";
import { getPPDBData } from "@/lib/firebase/ppdb";
import { CalonSiswa } from "@/types/ppdb";
import { PPDBDataTable } from "@/components/ppdb/PPDBDataTable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";

export default function AdminPPDBPage() {
  const [data, setData] = useState<CalonSiswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const ppdbData = await getPPDBData();
      setData(ppdbData);
    } catch (error) {
      console.error("Gagal memuat data PPDB", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Output Formulir Website</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data pendaftaran siswa baru tahun ajaran 2026/2027.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </FadeIn>

      <FadeIn className="flex flex-col flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <PPDBDataTable data={data} isLoading={isLoading} onRefresh={loadData} />
      </FadeIn>
    </>
  );
}
