import { Timestamp } from "firebase/firestore";

export interface KontenBerita {
  id?: string;
  tanggal: string; // Format: YYYY-MM-DD
  judul: string;
  deskripsiSingkat: string;
  kontenLengkap: string;
  mediaUrl?: string;
  mediaType?: "gambar" | "video" | "none";
  createdAt: Timestamp | Date;
}
