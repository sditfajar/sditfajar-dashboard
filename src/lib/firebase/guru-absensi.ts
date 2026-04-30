import {
  collection,
  doc,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./config";

export interface TeacherAttendance {
  id?: string;
  teacherName: string;
  timestamp: Timestamp | Date;
  status: string;
  distance: number;
  latitude: number;
  longitude: number;
}

const COLLECTION_NAME = "absensi_guru"; // updated collection name as requested

export const recordTeacherAttendance = async (
  teacherName: string,
  distance: number,
  latitude: number,
  longitude: number
) => {
  const attendanceData = {
    teacherName,
    timestamp: serverTimestamp(),
    status: "Hadir",
    distance,
    latitude,
    longitude,
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), attendanceData);
  return docRef.id;
};

export const getRekapAbsensiGuru = async (
  startDate?: Date,
  endDate?: Date
): Promise<TeacherAttendance[]> => {
  let q = query(collection(db, COLLECTION_NAME), orderBy("timestamp", "desc"));

  if (startDate) {
    // Start of the day
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    q = query(q, where("timestamp", ">=", Timestamp.fromDate(start)));
  }

  if (endDate) {
    // End of the day
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    q = query(q, where("timestamp", "<=", Timestamp.fromDate(end)));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      timestamp: data.timestamp ? (data.timestamp as Timestamp).toDate() : new Date(),
    } as TeacherAttendance;
  });
};
