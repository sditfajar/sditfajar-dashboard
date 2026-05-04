import { Timestamp } from "firebase/firestore";

export type SiswaStatus = "Aktif" | "Tidak Aktif" | "Lulus";

export interface Siswa {
  nisn: string;
  namaLengkap: string;
  kelas: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  namaWali: string;
  whatsappOrtu: string;
  status: SiswaStatus;
  createdAt: Timestamp | Date;
}
