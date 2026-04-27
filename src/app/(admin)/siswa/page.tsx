"use client";

import { useState, useEffect } from "react";
import { SiswaDataTable } from "@/components/siswa/SiswaDataTable";
import { SiswaFormDialog, SiswaFormValues } from "@/components/siswa/SiswaFormDialog";
import { Siswa } from "@/types/siswa";
import { subscribeToSiswa, addSiswa, updateSiswa, deleteSiswa } from "@/lib/firebase/siswa";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { FadeIn } from "@/components/ui/fade-in";

export default function SiswaPage() {
  const [data, setData] = useState<Siswa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [successPopup, setSuccessPopup] = useState<{ open: boolean; title: string; description: string }>({
    open: false, title: "", description: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToSiswa((siswaData) => {
      setData(siswaData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddClick = () => {
    setEditingSiswa(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setIsDialogOpen(true);
  };

  const handleDelete = async (nisn: string) => {
    try {
      await deleteSiswa(nisn);
      toast.success("Data Dihapus", {
        description: "Data siswa berhasil dihapus dari sistem.",
      });
    } catch (error) {
      console.error("Error deleting siswa:", error);
      toast.error("Gagal menghapus data siswa.");
    }
  };

  const handleSubmitForm = async (formData: SiswaFormValues) => {
    try {
      if (editingSiswa) {
        await updateSiswa(editingSiswa.nisn, {
          namaLengkap: formData.namaLengkap,
          kelas: formData.kelas,
          namaWali: formData.namaWali,
          whatsappOrtu: formData.whatsappOrtu,
          status: formData.status,
        });
        toast.success("Data Diperbarui! ✏️", {
          description: `Data ${formData.namaLengkap} berhasil diperbarui.`,
        });
      } else {
        const exists = data.some((s) => s.nisn === formData.nisn);
        if (exists) {
          toast.error("NISN Sudah Terdaftar", {
            description: `NISN ${formData.nisn} sudah ada di sistem.`,
          });
          return;
        }
        await addSiswa(formData);
        toast.success("Siswa Ditambahkan! 🎉", {
          description: `${formData.namaLengkap} berhasil ditambahkan ke Kelas ${formData.kelas}.`,
        });
        setSuccessPopup({
          open: true,
          title: "Siswa Berhasil Ditambahkan!",
          description: `${formData.namaLengkap} telah terdaftar di Kelas ${formData.kelas}.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving siswa:", error);
      toast.error("Terjadi Kesalahan", {
        description: "Gagal menyimpan data. Silakan coba lagi.",
      });
    }
  };

  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Manajemen Siswa</h1>
      </FadeIn>

      <FadeIn className="flex flex-col flex-1 rounded-lg border shadow-sm p-4 md:p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
        <SiswaDataTable
          data={data}
          isLoading={isLoading}
          onAdd={handleAddClick}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      </FadeIn>

      <SiswaFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmitForm}
        defaultValues={editingSiswa}
        isEditing={!!editingSiswa}
      />

      <SuccessDialog
        open={successPopup.open}
        onOpenChange={(open) => setSuccessPopup((prev) => ({ ...prev, open }))}
        title={successPopup.title}
        description={successPopup.description}
      />
    </>
  );
}
