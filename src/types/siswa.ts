import { Timestamp } from "firebase/firestore";

export type SiswaStatus = "Aktif" | "Tidak Aktif" | "Lulus";

export interface Siswa {
  nisn: string;
  nik?: string;
  namaLengkap: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  kelas: string;
  alamatLengkap?: string;
  namaWali: string;
  whatsappOrtu: string;
  status: SiswaStatus;
  createdAt: Timestamp | Date;
}
