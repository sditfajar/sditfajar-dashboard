import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";
import { Siswa } from "@/types/siswa";

const COLLECTION_NAME = "siswa";
const PEMBAYARAN_COLLECTION = "pembayaran";

// Get all siswa real-time
export const subscribeToSiswa = (callback: (data: Siswa[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      nisn: doc.id,
    })) as Siswa[];
    callback(data);
  });
};

// Add new siswa
export const addSiswa = async (data: Omit<Siswa, "createdAt">) => {
  const docRef = doc(collection(db, COLLECTION_NAME), data.nisn);
  
  await setDoc(docRef, {
    ...data,
    createdAt: serverTimestamp(),
  });

  // Otomatisasi Pembayaran
  if (data.status === "Aktif") {
    await createPembayaran(data);
  }
};

// Update siswa
export const updateSiswa = async (nisn: string, data: Partial<Siswa>) => {
  const docRef = doc(collection(db, COLLECTION_NAME), nisn);
  await updateDoc(docRef, data);
};

// Delete siswa
export const deleteSiswa = async (nisn: string) => {
  const docRef = doc(collection(db, COLLECTION_NAME), nisn);
  await deleteDoc(docRef);
  // Opsional: Hapus data pembayaran terkait bisa ditambahkan di sini
};

// Helper: Otomatisasi Pembayaran
const createPembayaran = async (siswaData: Omit<Siswa, "createdAt">) => {
  const paymentRef = doc(collection(db, PEMBAYARAN_COLLECTION));
  await setDoc(paymentRef, {
    studentId: siswaData.nisn,
    studentName: siswaData.namaLengkap,
    sppNominal: 300000,
    semesterNominal: 1000000,
    statusBayar: "Belum Lunas",
    createdAt: serverTimestamp(),
  });
};
