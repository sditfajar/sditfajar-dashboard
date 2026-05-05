"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2, ArrowRight, X, Newspaper, Search } from "lucide-react";
import { KontenBerita } from "@/types/konten";
import { getKontenBerita } from "@/lib/firebase/konten";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const ITEMS_PER_PAGE = 16;

export default function BeritaPage() {
  const [news, setNews] = useState<KontenBerita[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<KontenBerita | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getKontenBerita();
        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: id });
    } catch (e) {
      return dateStr;
    }
  };

  const filteredNews = news.filter((item) => 
    item.judul.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.deskripsiSingkat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 bg-secondary/30 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Semua Berita & Informasi
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Jelajahi kumpulan berita terbaru, pengumuman, dan artikel seputar kegiatan belajar mengajar di SDIT Fajar.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Cari judul atau deskripsi berita..." 
                className="pl-12 h-12 rounded-full border-primary/20 focus-visible:ring-primary/30 bg-background/80 backdrop-blur-sm shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">Memuat berita...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-20 border rounded-2xl bg-background/50 backdrop-blur-sm border-dashed">
              <p className="text-muted-foreground italic">
                {searchQuery ? "Tidak ada berita yang sesuai dengan pencarian Anda." : "Belum ada berita yang dipublikasikan."}
              </p>
            </div>
          ) : (
            <>
              <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
                {currentNews.map((item) => (
                  <FadeIn key={item.id}>
                    <Card className="group flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-background/60 backdrop-blur-xl border-border/50 overflow-hidden">
                      <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity z-10 relative" />
                      <CardHeader className="pt-6">
                        <div className="flex items-center text-xs font-medium text-primary/80 mb-3">
                          <Calendar className="mr-2 h-3.5 w-3.5" />
                          {formatDate(item.tanggal)}
                        </div>
                        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors leading-tight">
                          {item.judul}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {item.deskripsiSingkat}
                        </p>
                      </CardContent>
                      <CardFooter className="pt-4 border-t border-border/10">
                        <Button 
                          onClick={() => setSelectedNews(item)}
                          variant="ghost" 
                          className="p-0 h-auto text-sm text-primary font-semibold hover:text-primary/80 hover:bg-transparent group/btn"
                        >
                          Baca selengkapnya 
                          <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </FadeIn>
                ))}
              </FadeInStagger>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />

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
    </div>
  );
}
