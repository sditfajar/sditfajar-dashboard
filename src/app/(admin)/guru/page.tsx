"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { GuruDataTable } from "@/components/guru/GuruDataTable";
import { GuruFormDialog, GuruFormValues } from "@/components/guru/GuruFormDialog";
import { GuruDetailDialog } from "@/components/guru/GuruDetailDialog";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "sonner";

export default function GuruPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [selectedGuru, setSelectedGuru] = useState<any>(null);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "users"), where("role", "==", "teacher"));
      const snapshot = await getDocs(q);
      const teachersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(teachersList);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      toast.error("Gagal mengambil data guru");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleFormSubmit = async (values: GuruFormValues) => {
    setIsSubmitting(true);
    try {
      const url = isEditing && selectedGuru ? `/api/admin/teachers/${selectedGuru.id}` : "/api/admin/teachers";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan guru");

      setIsFormOpen(false);
      setShowSuccess(true);
      fetchTeachers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan sistem");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus guru");

      toast.success("Data berhasil dihapus");
      fetchTeachers();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Gagal menghapus data");
    }
  };

  const handleEdit = (guru: any) => {
    setSelectedGuru(guru);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleView = (guru: any) => {
    setSelectedGuru(guru);
    setIsDetailOpen(true);
  };

  return (
    <>
      <FadeIn className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold md:text-2xl">Manajemen Guru</h1>
      </FadeIn>

      <FadeIn>
        <GuruDataTable
          data={data}
          isLoading={isLoading}
          onAdd={() => {
            setSelectedGuru(null);
            setIsEditing(false);
            setIsFormOpen(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </FadeIn>

      <GuruFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        isEditing={isEditing}
        defaultValues={selectedGuru}
      />

      <GuruDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        guru={selectedGuru}
      />

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Berhasil!"
        description={isEditing ? "Data guru berhasil diperbarui." : "Data guru baru berhasil ditambahkan dan akun berhasil dibuat."}
        actionLabel="Selesai"
        onAction={() => setShowSuccess(false)}
      />
    </>
  );
}
