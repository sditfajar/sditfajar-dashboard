import { Timestamp } from "firebase/firestore";

export type PPDBStatus = "Baru" | "Diproses" | "Diterima" | "Ditolak";

export interface CalonSiswa {
  id?: string;
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string; // YYYY-MM-DD
  jenisKelamin: "Laki-laki" | "Perempuan";
  alamatLengkap: string;
  namaAyah: string;
  namaIbu: string;
  waOrtu: string;
  urlKK: string;
  urlAkta: string;
  status: PPDBStatus;
  createdAt: Timestamp | Date;
}
