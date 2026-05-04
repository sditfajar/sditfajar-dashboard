"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getTugasByTeacher, addTugas, deleteTugas, Tugas } from "@/lib/firebase/pembelajaran";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { Plus, Trash2, Edit, FileText, Loader2, Link as LinkIcon, CalendarDays, BookOpen, MapPin } from "lucide-react";
import { TugasFormDialog } from "@/components/pembelajaran/TugasFormDialog";
import { toast } from "sonner";

export default function ManajemenTugasPage() {
  const [tugasList, setTugasList] = useState<Tugas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTugas, setEditingTugas] = useState<Tugas | null>(null);
  const [currentGuruId, setCurrentGuruId] = useState<string>("");

  const fetchTugas = async (guruId: string) => {
    setIsLoading(true);
    try {
      const data = await getTugasByTeacher(guruId);
      setTugasList(data);
    } catch (error) {
      console.error("Error fetching tugas:", error);
      toast({
        title: "Gagal memuat tugas",
        description: "Terjadi kesalahan saat mengambil data tugas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentGuruId(user.uid);
        fetchTugas(user.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleAddClick = () => {
    setEditingTugas(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (tugas: Tugas) => {
    setEditingTugas(tugas);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    
    try {
      await deleteTugas(id);
      setTugasList(tugasList.filter(t => t.id !== id));
      toast({
        title: "Berhasil dihapus",
        description: "Tugas telah dihapus dari sistem.",
      });
    } catch (error) {
      console.error("Error deleting tugas:", error);
      toast({
        title: "Gagal menghapus",
        description: "Terjadi kesalahan saat menghapus tugas.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (values: Omit<Tugas, "id" | "createdAt" | "updatedAt" | "guruId">) => {
    if (!currentGuruId) return;
    
    setIsSubmitting(true);
    try {
      if (editingTugas && editingTugas.id) {
        // Implementasi updateTugas jika diperlukan, saat ini hanya tambah/hapus di lib
        // Jika ada fungsi update, panggil di sini
        toast({
          title: "Belum Diimplementasikan",
          description: "Fungsi update tugas belum didukung sepenuhnya di demo ini.",
        });
      } else {
        const newId = await addTugas({
          ...values,
          guruId: currentGuruId,
        });
        toast({
          title: "Tugas ditambahkan",
          description: "Tugas baru berhasil disimpan ke sistem.",
        });
        fetchTugas(currentGuruId);
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting tugas:", error);
      toast({
        title: "Gagal menyimpan",
        description: "Terjadi kesalahan saat menyimpan tugas.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Tugas</h1>
          <p className="text-muted-foreground mt-1">
            Kelola tugas-tugas yang Anda berikan untuk siswa.
          </p>
        </div>
        <Button onClick={handleAddClick} className="w-full sm:w-auto gap-2">
          <Plus className="w-4 h-4" /> Tambah Tugas
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : tugasList.length === 0 ? (
        <FadeIn className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/30">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-medium">Belum ada tugas</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">
            Anda belum pernah membuat tugas untuk siswa. Klik tombol "Tambah Tugas" untuk mulai membuat tugas baru.
          </p>
        </FadeIn>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tugasList.map((tugas, idx) => (
            <FadeIn key={tugas.id} delay={idx * 0.05}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-tight line-clamp-2">{tugas.judul}</CardTitle>
                    <div className="flex gap-1 shrink-0">
                      {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary" onClick={() => handleEditClick(tugas)}>
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500" onClick={() => handleDelete(tugas.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 font-medium text-primary mt-2">
                    <BookOpen className="w-4 h-4" /> {tugas.mapelName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-3 text-sm space-y-4">
                  <p className="text-muted-foreground line-clamp-3">
                    {tugas.deskripsi}
                  </p>
                  
                  <div className="space-y-2 pt-2 border-t text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>Kelas: <span className="font-semibold text-slate-900 dark:text-slate-100">{tugas.kelas}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <CalendarDays className="w-4 h-4 text-orange-500" />
                      <span>Deadline: <span className="font-semibold text-slate-900 dark:text-slate-100">{tugas.deadline}</span></span>
                    </div>
                  </div>
                </CardContent>
                {tugas.lampiranUrl && (
                  <CardFooter className="pt-0 pb-4">
                    <a href={tugas.lampiranUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <LinkIcon className="w-4 h-4 mr-1.5" /> Buka Lampiran
                    </a>
                  </CardFooter>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      )}

      {currentGuruId && (
        <TugasFormDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
          isEditing={!!editingTugas}
          defaultValues={editingTugas}
          guruId={currentGuruId}
        />
      )}
    </div>
  );
}
