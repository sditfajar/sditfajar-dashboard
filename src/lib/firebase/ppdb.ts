import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import { CalonSiswa, PPDBStatus } from "@/types/ppdb";

const COLLECTION_NAME = "ppdb_siswa";

export const uploadDokumenPPDB = async (file: File, folder: string): Promise<string> => {
  if (!file) throw new Error("File tidak ditemukan");
  
  // Create a unique file name
  const timestamp = new Date().getTime();
  const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
  const fileName = `${folder}/${timestamp}_${safeName}`;
  
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
};

export const submitPendaftaran = async (
  data: Omit<CalonSiswa, "id" | "status" | "createdAt" | "urlKK" | "urlAkta">,
  fileKK: File | null,
  fileAkta: File | null
) => {
  // Upload files if provided
  const urlKK = fileKK ? await uploadDokumenPPDB(fileKK, "ppdb_dokumen/kk") : "";
  const urlAkta = fileAkta ? await uploadDokumenPPDB(fileAkta, "ppdb_dokumen/akta") : "";

  // Save to Firestore
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    urlKK,
    urlAkta,
    status: "Baru",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getPPDBData = async (): Promise<CalonSiswa[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Omit<CalonSiswa, "id">),
    id: doc.id,
  }));
};

export const updatePPDBStatus = async (id: string, status: PPDBStatus) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};
