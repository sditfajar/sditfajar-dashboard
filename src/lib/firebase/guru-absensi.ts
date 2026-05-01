import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  setDoc,
  updateDoc,
  Timestamp,
  orderBy,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { db } from "./config";

export interface TeacherAttendance {
  id?: string;
  teacherName: string;
  uid: string;
  dateString: string; // YYYY-MM-DD
  waktu_masuk?: Timestamp | Date | FieldValue | null;
  waktu_pulang?: Timestamp | Date | FieldValue | null;
  status: string;
  distance: number;
  latitude: number;
  longitude: number;
  // Legacy compat
  timestamp?: Timestamp | Date | null;
}

const COLLECTION_NAME = "absensi_guru";

// Helper: format date as YYYY-MM-DD
const formatDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Check today's attendance for a specific user
export const getTodayAttendance = async (
  uid: string
): Promise<TeacherAttendance | null> => {
  const todayStr = formatDateString(new Date());
  const docId = `${uid}_${todayStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    ...data,
    id: docSnap.id,
    waktu_masuk: data.waktu_masuk ? (data.waktu_masuk as Timestamp).toDate() : null,
    waktu_pulang: data.waktu_pulang ? (data.waktu_pulang as Timestamp).toDate() : null,
    timestamp: data.waktu_masuk ? (data.waktu_masuk as Timestamp).toDate() : null,
  } as TeacherAttendance;
};

// Record check-in (Absen Masuk) — creates a new document
export const recordAbsenMasuk = async (
  uid: string,
  teacherName: string,
  distance: number,
  latitude: number,
  longitude: number
): Promise<string> => {
  const todayStr = formatDateString(new Date());
  const docId = `${uid}_${todayStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await setDoc(docRef, {
    uid,
    teacherName,
    dateString: todayStr,
    waktu_masuk: serverTimestamp(),
    waktu_pulang: null,
    status: "Hadir",
    distance,
    latitude,
    longitude,
    // Keep timestamp for backward compat with ordering/queries
    timestamp: serverTimestamp(),
  });

  return docId;
};

// Record check-out (Absen Pulang) — updates existing document
export const recordAbsenPulang = async (
  uid: string
): Promise<void> => {
  const todayStr = formatDateString(new Date());
  const docId = `${uid}_${todayStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await updateDoc(docRef, {
    waktu_pulang: serverTimestamp(),
  });
};

// Get rekap for admin report
export const getRekapAbsensiGuru = async (
  startDate?: Date,
  endDate?: Date
): Promise<TeacherAttendance[]> => {
  let q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    q = query(q, where("timestamp", ">=", Timestamp.fromDate(start)));
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
      waktu_masuk: data.waktu_masuk ? (data.waktu_masuk as Timestamp).toDate() : null,
      waktu_pulang: data.waktu_pulang ? (data.waktu_pulang as Timestamp).toDate() : null,
    } as TeacherAttendance;
  });
};

// Get monthly attendance for a specific teacher
export const getMonthlyAttendance = async (
  uid: string,
  date: Date
): Promise<TeacherAttendance[]> => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  
  const q = query(
    collection(db, COLLECTION_NAME),
    where("uid", "==", uid),
    where("timestamp", ">=", Timestamp.fromDate(start)),
    where("timestamp", "<=", Timestamp.fromDate(end)),
    orderBy("timestamp", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
      waktu_masuk: data.waktu_masuk ? (data.waktu_masuk as Timestamp).toDate() : null,
      waktu_pulang: data.waktu_pulang ? (data.waktu_pulang as Timestamp).toDate() : null,
    } as TeacherAttendance;
  });
};
