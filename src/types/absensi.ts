import { Timestamp } from "firebase/firestore";
import { Siswa } from "./siswa";

export type AbsensiStatus = "Hadir" | "Sakit" | "Izin" | "Alpa" | "";

export interface Absensi {
  attendanceId: string; // Format: {nisn}_{YYYY-MM-DD}
  studentId: string; // Reference ke NISN
  nama: string;
  kelas: string;
  status: AbsensiStatus;
  date: Timestamp | Date;
  dateString: string; // Format: YYYY-MM-DD
  monthYear: string; // Format: MM-YYYY
  submittedBy?: string;
  keterangan?: string;
}

// Untuk UI Input
export interface SiswaWithAbsensi extends Siswa {
  absensiStatus: AbsensiStatus;
  attendanceId?: string;
  submittedBy?: string;
  keterangan?: string;
}

// Untuk UI Laporan
export interface RekapAbsensi {
  studentId: string;
  nama: string;
  kelas: string;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
}
