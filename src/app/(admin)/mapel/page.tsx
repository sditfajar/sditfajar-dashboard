"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { MapelDataTable } from "@/components/pembelajaran/MapelDataTable";
import { MapelFormDialog } from "@/components/pembelajaran/MapelFormDialog";
import { getSubjects, addSubject, updateSubject, deleteSubject, Subject } from "@/lib/firebase/pembelajaran";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/success-dialog";

export default function MapelPage() {
  const [data, setData] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMapel, setSelectedMapel] = useState<Subject | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchMapel = async () => {
    setIsLoading(true);
    try {
      const subjects = await getSubjects();
      setData(subjects);
    } catch (error) {
      console.error("Gagal mengambil data mapel", error);
      toast.error("Gagal memuat mata pelajaran");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  const handleAdd = () => {
    setSelectedMapel(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEdit = (mapel: Subject) => {
    setSelectedMapel(mapel);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      toast.success("Mata pelajaran berhasil dihapus");
      fetchMapel();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus mata pelajaran");
    }
  };

  const handleSubmit = async (values: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedMapel?.id) {
        await updateSubject(selectedMapel.id, values);
      } else {
        await addSubject(values);
      }
      setIsFormOpen(false);
      setShowSuccess(true);
      fetchMapel();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan mata pelajaran");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-0 md:px-6 space-y-6">
      <FadeIn className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Mata Pelajaran</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola daftar mata pelajaran yang diajarkan di sekolah.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <MapelDataTable
          data={data}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </FadeIn>

      <MapelFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isEditing={isEditing}
        defaultValues={selectedMapel}
      />

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Berhasil!"
        description={isEditing ? "Mata pelajaran berhasil diperbarui." : "Mata pelajaran baru berhasil ditambahkan."}
      />
    </div>
  );
}
