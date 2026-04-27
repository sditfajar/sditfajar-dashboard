import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { PesanKontak } from "@/types/pesan";

const COLLECTION_NAME = "pesan_kontak";

export const addPesanKontak = async (
  data: Omit<PesanKontak, "id" | "status" | "createdAt">
) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    status: "belum_dibaca",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getPesanKontak = async (): Promise<PesanKontak[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<PesanKontak, "id">),
    id: doc.id,
  }));
};

export const updateStatusPesan = async (
  id: string,
  status: "belum_dibaca" | "sudah_dibaca"
) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};

export const deletePesanKontak = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
};
