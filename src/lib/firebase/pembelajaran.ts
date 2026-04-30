import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";

// --- INTERFACES ---

export interface Subject {
  id?: string;
  nama_mapel: string;
  kategori_kelas: string; // "1", "2", "3", "4", "5", "6"
  tipe: "Umum" | "Agama";
  createdAt?: any;
  updatedAt?: any;
}

export interface Schedule {
  id?: string;
  hari: string; // "Senin", "Selasa", dll
  jamMulai: string; // e.g. "08:00"
  jamSelesai: string; // e.g. "09:30"
  mapelId: string;
  mapelName?: string; // Denormalized for easier display
  guruId: string;
  guruName?: string; // Denormalized for easier display
  kelas: string; // "1A", "1B", "2A", dll
  createdAt?: any;
  updatedAt?: any;
}

const SUBJECTS_COLLECTION = "subjects";
const SCHEDULES_COLLECTION = "schedules";
const USERS_COLLECTION = "users";

// --- SUBJECTS (Mata Pelajaran) ---

export const getSubjects = async (): Promise<Subject[]> => {
  const q = query(collection(db, SUBJECTS_COLLECTION));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Subject));
  // Sort in memory to avoid missing index error in firestore
  return data.sort((a, b) => {
    if (a.kategori_kelas === b.kategori_kelas) {
      return a.nama_mapel.localeCompare(b.nama_mapel);
    }
    return a.kategori_kelas.localeCompare(b.kategori_kelas);
  });
};

export const addSubject = async (subject: Omit<Subject, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(collection(db, SUBJECTS_COLLECTION), {
    ...subject,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateSubject = async (id: string, subject: Partial<Subject>): Promise<void> => {
  const docRef = doc(db, SUBJECTS_COLLECTION, id);
  await updateDoc(docRef, {
    ...subject,
    updatedAt: serverTimestamp(),
  });
};

export const deleteSubject = async (id: string): Promise<void> => {
  const docRef = doc(db, SUBJECTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- SCHEDULES (Jadwal Mengajar) ---

export const getSchedules = async (): Promise<Schedule[]> => {
  const q = query(collection(db, SCHEDULES_COLLECTION));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Schedule));
};

export const getSchedulesByTeacher = async (guruId: string): Promise<Schedule[]> => {
  const q = query(collection(db, SCHEDULES_COLLECTION), where("guruId", "==", guruId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Schedule));
};

export const addSchedule = async (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const docRef = await addDoc(collection(db, SCHEDULES_COLLECTION), {
    ...schedule,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

export const updateSchedule = async (id: string, schedule: Partial<Schedule>): Promise<void> => {
  const docRef = doc(db, SCHEDULES_COLLECTION, id);
  await updateDoc(docRef, {
    ...schedule,
    updatedAt: serverTimestamp(),
  });
};

export const deleteSchedule = async (id: string): Promise<void> => {
  const docRef = doc(db, SCHEDULES_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- TEACHERS HELPERS (Untuk dropdown Admin) ---

export interface TeacherInfo {
  id: string;
  name: string;
  nip?: string;
}

export const getTeachersForDropdown = async (): Promise<TeacherInfo[]> => {
  const q = query(collection(db, USERS_COLLECTION), where("role", "==", "teacher"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || data.displayName || "Guru Tanpa Nama",
      nip: data.nip || "",
    };
  });
};
