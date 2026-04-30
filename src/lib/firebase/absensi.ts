import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
  Timestamp,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Absensi, AbsensiStatus } from "@/types/absensi";
import { Siswa } from "@/types/siswa";

const COLLECTION_NAME = "absensi";
const SISWA_COLLECTION = "siswa";

// Helper for MM-YYYY
export const formatMonthYear = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
};

// Helper for YYYY-MM-DD
export const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getActiveSiswa = async (): Promise<Siswa[]> => {
  const q = query(
    collection(db, SISWA_COLLECTION),
    where("status", "==", "Aktif")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        nisn: doc.id,
      } as Siswa)
  );
};

export const getAbsensiByDate = async (dateStr: string): Promise<Absensi[]> => {
  // dateStr format: YYYY-MM-DD
  // Since we construct attendanceId as {nisn}_{YYYY-MM-DD}, we can just query by prefix
  // Wait, Firestore doesn't easily support query by ID prefix without trickery.
  // We can just query by a 'dateStr' field if we store it.
  // Let's store `dateString: string` alongside `date` timestamp.
  const q = query(
    collection(db, COLLECTION_NAME),
    where("dateString", "==", dateStr)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        attendanceId: doc.id,
      } as Absensi)
  );
};

export const saveAbsensi = async (
  dateStr: string,
  monthYear: string,
  records: Omit<Absensi, "date" | "attendanceId" | "monthYear">[],
  submittedBy: string = "Admin"
) => {
  const batch = writeBatch(db);

  records.forEach((record) => {
    // skip empty status
    if (!record.status) return;

    const attendanceId = `${record.studentId}_${dateStr}`;
    const docRef = doc(collection(db, COLLECTION_NAME), attendanceId);

    batch.set(docRef, {
      ...record,
      dateString: dateStr,
      monthYear: monthYear,
      date: Timestamp.fromDate(new Date(dateStr)),
      submittedBy,
      keterangan: record.keterangan || "",
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
};

export const getRekapAbsensiBulanan = async (
  monthYear: string
): Promise<Absensi[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("monthYear", "==", monthYear)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        ...doc.data(),
        attendanceId: doc.id,
      } as Absensi)
  );
};
