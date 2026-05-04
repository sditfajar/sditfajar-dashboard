"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Tugas, Schedule, getSchedulesByTeacher } from "@/lib/firebase/pembelajaran";

interface TugasFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Tugas, "id" | "createdAt" | "updatedAt" | "guruId">) => void;
  isLoading: boolean;
  isEditing: boolean;
  defaultValues: Tugas | null;
  guruId: string;
}

export function TugasFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  isEditing,
  defaultValues,
  guruId,
}: TugasFormDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Omit<Tugas, "id" | "createdAt" | "updatedAt" | "guruId">>();
  
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (open && guruId) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const fetchedSchedules = await getSchedulesByTeacher(guruId);
          // Filter unique combinations of mapelName and kelas
          const uniqueSchedules = fetchedSchedules.filter((v, i, a) => 
            a.findIndex(t => (t.mapelName === v.mapelName && t.kelas === v.kelas)) === i
          );
          setSchedules(uniqueSchedules);
        } catch (error) {
          console.error("Error fetching schedules for tugas:", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
      
      if (defaultValues) {
        reset({
          judul: defaultValues.judul,
          deskripsi: defaultValues.deskripsi,
          deadline: defaultValues.deadline,
          mapelName: defaultValues.mapelName,
          kelas: defaultValues.kelas,
          lampiranUrl: defaultValues.lampiranUrl || "",
        });
      } else {
        reset({
          judul: "",
          deskripsi: "",
          deadline: "",
          mapelName: "",
          kelas: "",
          lampiranUrl: "",
        });
      }
    }
  }, [open, defaultValues, reset, guruId]);

  const handleMapelKelasChange = (value: string) => {
    const [mapel, kelas] = value.split("|");
    setValue("mapelName", mapel);
    setValue("kelas", kelas);
  };

  const watchMapelName = watch("mapelName");
  const watchKelas = watch("kelas");
  const selectedComboValue = watchMapelName && watchKelas ? `${watchMapelName}|${watchKelas}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tugas" : "Tambah Tugas Baru"}</DialogTitle>
        </DialogHeader>
        
        {loadingData ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Tugas</label>
              <Input 
                {...register("judul", { required: "Judul tugas harus diisi" })} 
                placeholder="Contoh: Latihan Soal Matematika Bab 1"
              />
              {errors.judul && <p className="text-xs text-red-500">{errors.judul.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi / Instruksi</label>
              <Textarea 
                {...register("deskripsi", { required: "Deskripsi tugas harus diisi" })} 
                placeholder="Tuliskan instruksi tugas secara detail..."
                rows={4}
              />
              {errors.deskripsi && <p className="text-xs text-red-500">{errors.deskripsi.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mata Pelajaran & Kelas</label>
              <Select 
                value={selectedComboValue}
                onValueChange={handleMapelKelasChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Mata Pelajaran & Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem 
                      key={`${schedule.mapelName}|${schedule.kelas}`} 
                      value={`${schedule.mapelName}|${schedule.kelas}`}
                    >
                      {schedule.mapelName} - Kelas {schedule.kelas}
                    </SelectItem>
                  ))}
                  {schedules.length === 0 && (
                    <SelectItem value="none" disabled>
                      Belum ada jadwal mengajar terdaftar
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {/* Hidden inputs to capture form data for required validation if needed, or rely on onSubmit logic */}
              <input type="hidden" {...register("mapelName", { required: true })} />
              <input type="hidden" {...register("kelas", { required: true })} />
              {(errors.mapelName || errors.kelas) && (
                <p className="text-xs text-red-500">Mata pelajaran dan kelas harus dipilih</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Batas Waktu (Deadline)</label>
              <Input 
                type="date"
                {...register("deadline", { required: "Tenggat waktu harus diisi" })} 
              />
              {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Link Lampiran (Opsional)</label>
              <Input 
                type="url"
                {...register("lampiranUrl")} 
                placeholder="https://docs.google.com/... (Link Google Drive, dll)"
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Simpan Perubahan" : "Tambahkan Tugas"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
