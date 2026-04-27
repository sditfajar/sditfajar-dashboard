import { Timestamp } from "firebase/firestore";

export interface PesanKontak {
  id?: string;
  nama: string;
  kontak: string;
  pesan: string;
  status: "belum_dibaca" | "sudah_dibaca";
  createdAt: Timestamp | Date;
}
