import { FadeIn } from "@/components/ui/fade-in";

export default function GuruPage() {
  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Manajemen Guru</h1>
      </FadeIn>
      <FadeIn className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-12 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Data Guru
          </h3>
          <p className="text-sm text-muted-foreground">
            Fitur CRUD Guru akan ditambahkan di sini.
          </p>
        </div>
      </FadeIn>
    </>
  );
}
