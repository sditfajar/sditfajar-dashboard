"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Loader2, X, Newspaper } from "lucide-react";
import { KontenBerita } from "@/types/konten";
import { getKontenBeritaPublic, getYoutubeEmbedUrl } from "@/lib/firebase/konten";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

export function NewsSection() {
  const [news, setNews] = useState<KontenBerita[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<KontenBerita | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
  const [youtubeLoading, setYoutubeLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, ytUrl] = await Promise.all([
          getKontenBeritaPublic(6),
          getYoutubeEmbedUrl(),
        ]);
        setNews(data);
        if (ytUrl) {
          setYoutubeUrl(ytUrl);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setYoutubeLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: id });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section id="berita" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-50">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <FadeIn className="mb-16 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          {/* Teks: Judul & Deskripsi */}
          <div className="flex-1 flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400 mb-2">
              Update Terbaru
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 leading-tight">
              Berita & Informasi #berita
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Ikuti perkembangan terbaru, pengumuman, dan prestasi dari SDIT Fajar. Dapatkan informasi terkini seputar kegiatan belajar mengajar dan agenda sekolah kami.
            </p>
            <div className="pt-4 hidden md:block">
              <Button className="rounded-full px-8">Jelajahi Semua Berita</Button>
            </div>
          </div>

          {/* Media: YouTube Video Embed */}
          <div className="flex-1 w-full">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-primary/10 bg-black/5 group">
              {youtubeLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                  <Loader2 className="h-8 w-8 text-primary/40 animate-spin" />
                </div>
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={youtubeUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title="Video Profil SDIT Fajar"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </FadeIn>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Memuat berita terbaru...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20 border rounded-2xl bg-background/50 backdrop-blur-sm border-dashed">
            <p className="text-muted-foreground italic">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <FadeInStagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <FadeIn key={item.id}>
                <Card 
                  className="group flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-background/60 backdrop-blur-xl border-border/50 overflow-hidden"
                >
                  <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 relative" />
                  

                  
                  <CardHeader className="pt-6">
                    <div className="flex items-center text-sm font-medium text-primary/80 mb-3">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(item.tanggal)}
                    </div>
                    <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors leading-tight">
                      {item.judul}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.deskripsiSingkat}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-border/10">
                    <Button 
                      onClick={() => setSelectedNews(item)}
                      variant="ghost" 
                      className="p-0 h-auto text-primary font-semibold hover:text-primary/80 hover:bg-transparent group/btn"
                    >
                      Baca selengkapnya 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </FadeIn>
            ))}
          </FadeInStagger>
        )}
        
        {news.length > 0 && (
          <FadeIn className="mt-16 flex justify-center">
            <Button variant="outline" size="lg" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Lihat Semua Berita
            </Button>
          </FadeIn>
        )}
      </div>

      {/* Reading Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="max-w-[100vw] w-full h-screen sm:max-w-4xl sm:h-[90vh] overflow-y-auto p-0 gap-0 rounded-none sm:rounded-2xl border-none sm:border shadow-2xl bg-background/95 backdrop-blur-xl">
          <div className="sticky top-0 z-50 flex items-center justify-between p-4 sm:p-6 bg-background/80 backdrop-blur-md border-b">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Informasi Sekolah</span>
              <DialogTitle className="text-lg sm:text-xl font-bold line-clamp-1">Detail Berita</DialogTitle>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </div>

          <div className="p-6 sm:p-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
              <Calendar className="h-4 w-4" />
              <span>{selectedNews ? formatDate(selectedNews.tanggal) : ""}</span>
              <span className="mx-2">•</span>
              <span>SDIT Fajar</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-8 leading-[1.1]">
              {selectedNews?.judul}
            </h1>



            <div className="mb-10 p-6 bg-muted/50 rounded-2xl border-l-4 border-primary">
              <p className="text-lg font-medium leading-relaxed italic text-foreground/80">
                {selectedNews?.deskripsiSingkat}
              </p>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-img:rounded-2xl prose-a:text-primary">
              <div className="whitespace-pre-wrap text-foreground/90 leading-loose text-lg">
                {selectedNews?.kontenLengkap}
              </div>
            </div>

            <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Admin SDIT Fajar</p>
                  <p className="text-sm text-muted-foreground">Tim Redaksi & Informasi</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedNews(null)}
                variant="outline" 
                className="rounded-full"
              >
                Kembali ke Berita
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
