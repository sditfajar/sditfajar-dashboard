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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Schedule, Subject, TeacherInfo, getSubjects, getTeachersForDropdown } from "@/lib/firebase/pembelajaran";

interface JadwalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => void;
  isLoading: boolean;
  isEditing: boolean;
  defaultValues: Schedule | null;
}

export function JadwalFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  isEditing,
  defaultValues,
}: JadwalFormDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Omit<Schedule, "id" | "createdAt" | "updatedAt">>();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<TeacherInfo[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const [fetchedSubjects, fetchedTeachers] = await Promise.all([
            getSubjects(),
            getTeachersForDropdown()
          ]);
          setSubjects(fetchedSubjects);
          setTeachers(fetchedTeachers);
        } catch (error) {
          console.error("Gagal memuat data referensi", error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();

      if (defaultValues && isEditing) {
        setValue("hari", defaultValues.hari);
        setValue("jamMulai", defaultValues.jamMulai);
        setValue("jamSelesai", defaultValues.jamSelesai);
        setValue("mapelId", defaultValues.mapelId);
        setValue("guruId", defaultValues.guruId);
        setValue("kelas", defaultValues.kelas);
        setValue("mapelName", defaultValues.mapelName);
        setValue("guruName", defaultValues.guruName);
      } else {
        reset();
      }
    }
  }, [open, defaultValues, isEditing, setValue, reset]);

  const handleMapelChange = (val: string) => {
    const selected = subjects.find(s => s.id === val);
    setValue("mapelId", val, { shouldValidate: true });
    if (selected) setValue("mapelName", selected.nama_mapel);
  };

  const handleGuruChange = (val: string) => {
    const selected = teachers.find(t => t.id === val);
    setValue("guruId", val, { shouldValidate: true });
    if (selected) setValue("guruName", selected.name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Jadwal Mengajar" : "Tambah Jadwal Mengajar"}</DialogTitle>
        </DialogHeader>
        
        {loadingData ? (
          <div className="flex flex-col items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Memuat data referensi...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hari</label>
                <Select 
                  value={watch("hari") || ""} 
                  onValueChange={(val) => setValue("hari", val, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Hari" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Senin">Senin</SelectItem>
                    <SelectItem value="Selasa">Selasa</SelectItem>
                    <SelectItem value="Rabu">Rabu</SelectItem>
                    <SelectItem value="Kamis">Kamis</SelectItem>
                    <SelectItem value="Jumat">Jumat</SelectItem>
                    <SelectItem value="Sabtu">Sabtu</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("hari", { required: "Hari wajib dipilih" })} />
                {errors.hari && <p className="text-xs text-destructive">{errors.hari.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Kelas</label>
                <Input
                  {...register("kelas", { required: "Kelas wajib diisi" })}
                  placeholder="Contoh: 1A, 2B"
                />
                {errors.kelas && <p className="text-xs text-destructive">{errors.kelas.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Waktu Mulai (Bebas)</label>
                <Input
                  {...register("jamMulai", { required: "Waktu mulai wajib diisi" })}
                  placeholder="Contoh: 08:00"
                />
                {errors.jamMulai && <p className="text-xs text-destructive">{errors.jamMulai.message}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Waktu Selesai (Bebas)</label>
                <Input
                  {...register("jamSelesai", { required: "Waktu selesai wajib diisi" })}
                  placeholder="Contoh: 09:30"
                />
                {errors.jamSelesai && <p className="text-xs text-destructive">{errors.jamSelesai.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Mata Pelajaran</label>
              <Select 
                value={watch("mapelId") || ""} 
                onValueChange={handleMapelChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Mapel" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id as string}>
                      {subject.nama_mapel} (Kelas {subject.kategori_kelas})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("mapelId", { required: "Mapel wajib dipilih" })} />
              {errors.mapelId && <p className="text-xs text-destructive">{errors.mapelId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Guru</label>
              <Select 
                value={watch("guruId") || ""} 
                onValueChange={handleGuruChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("guruId", { required: "Guru wajib dipilih" })} />
              {errors.guruId && <p className="text-xs text-destructive">{errors.guruId.message}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Simpan Perubahan" : "Simpan Jadwal"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
