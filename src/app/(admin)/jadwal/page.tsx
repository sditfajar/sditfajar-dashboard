"use client";

import { useState, useEffect } from "react";
import { FadeIn } from "@/components/ui/fade-in";
import { JadwalDataTable } from "@/components/pembelajaran/JadwalDataTable";
import { JadwalFormDialog } from "@/components/pembelajaran/JadwalFormDialog";
import { getSchedules, addSchedule, updateSchedule, deleteSchedule, Schedule } from "@/lib/firebase/pembelajaran";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/success-dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function JadwalPage() {
  const [data, setData] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJadwal, setSelectedJadwal] = useState<Schedule | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchJadwal = async () => {
    setIsLoading(true);
    try {
      const schedules = await getSchedules();
      setData(schedules);
    } catch (error) {
      console.error("Gagal mengambil data jadwal", error);
      toast.error("Gagal memuat jadwal mengajar");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const handleAdd = () => {
    setSelectedJadwal(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEdit = (schedule: Schedule) => {
    setSelectedJadwal(schedule);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSchedule(id);
      toast.success("Jadwal berhasil dihapus");
      fetchJadwal();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus jadwal");
    }
  };

  const handleSubmit = async (values: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
    setIsSubmitting(true);
    try {
      if (isEditing && selectedJadwal?.id) {
        await updateSchedule(selectedJadwal.id, values);
      } else {
        await addSchedule(values);
      }
      setIsFormOpen(false);
      setShowSuccess(true);
      fetchJadwal();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan jadwal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden px-0 md:px-6 space-y-6">
      <FadeIn className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Jadwal Mengajar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola jadwal mengajar, ploting guru, dan mata pelajaran di setiap kelas.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="print:hidden shrink-0">
          <Printer className="mr-2 h-4 w-4" />
          Print Jadwal
        </Button>
      </FadeIn>

      <FadeIn>
        <JadwalDataTable
          data={data}
          isLoading={isLoading}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </FadeIn>

      <JadwalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        isEditing={isEditing}
        defaultValues={selectedJadwal}
      />

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Berhasil!"
        description={isEditing ? "Jadwal berhasil diperbarui." : "Jadwal baru berhasil ditambahkan."}
      />
    </div>
  );
}
