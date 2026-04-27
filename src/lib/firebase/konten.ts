import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { KontenBerita } from "@/types/konten";

const COLLECTION_NAME = "konten_berita";

export const uploadMediaBerita = async (file: File): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `media_berita/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
  const storageRef = ref(storage, fileName);
  
  const snapshot = await uploadBytesResumable(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const addKontenBerita = async (
  data: Omit<KontenBerita, "id" | "createdAt">
) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getKontenBerita = async (): Promise<KontenBerita[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<KontenBerita, "id">),
    id: doc.id,
  }));
};

export const getKontenBeritaPublic = async (
  maxItems: number = 6
): Promise<KontenBerita[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("createdAt", "desc"),
    limit(maxItems)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<KontenBerita, "id">),
    id: doc.id,
  }));
};

export const deleteKontenBerita = async (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data() as KontenBerita;
    if (data.mediaUrl && data.mediaUrl !== "") {
      try {
        // Create a reference from the download URL and delete it
        const fileRef = ref(storage, data.mediaUrl);
        await deleteObject(fileRef);
      } catch (error) {
        console.error("Failed to delete media from storage:", error);
      }
    }
  }
  
  await deleteDoc(docRef);
};
