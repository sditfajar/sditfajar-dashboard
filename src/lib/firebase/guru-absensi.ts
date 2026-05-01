import { db } from "./config";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  setDoc, 
  updateDoc, 
  query,
  where,
  orderBy,
  serverTimestamp, 
  Timestamp 
} from "firebase/firestore";

const COLLECTION_NAME = "absensi_guru";

export interface TeacherAttendance {
  id?: string;
  uid: string;
  teacherName: string;
  waktu_masuk: Date | null;
  waktu_pulang: Date | null;
  timestamp: Date | Timestamp;
  status: string;
  distance: number;
  latitude: number;
  longitude: number;
  dateString: string;
}

export const getTodayAttendance = async (uid: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const docId = `${uid}_${dateStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      waktu_masuk: data.waktu_masuk instanceof Timestamp ? data.waktu_masuk.toDate() : data.waktu_masuk,
      waktu_pulang: data.waktu_pulang instanceof Timestamp ? data.waktu_pulang.toDate() : data.waktu_pulang,
      timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp,
    };
  }
  return null;
};

export const recordAbsenMasuk = async (
  uid: string, 
  teacherName: string, 
  distance: number, 
  latitude: number, 
  longitude: number
) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const docId = `${uid}_${dateStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await setDoc(docRef, {
    uid,
    teacherName,
    waktu_masuk: serverTimestamp(),
    timestamp: serverTimestamp(),
    distance,
    latitude,
    longitude,
    dateString: dateStr,
    status: "Hadir"
  });
};

export const recordAbsenPulang = async (uid: string) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const docId = `${uid}_${dateStr}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  await updateDoc(docRef, {
    waktu_pulang: serverTimestamp(),
  });
};

export const getMonthlyAttendance = async (uid: string, monthDate: Date) => {
  const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

  const q = query(
    collection(db, COLLECTION_NAME),
    where("uid", "==", uid),
    where("timestamp", ">=", Timestamp.fromDate(startOfMonth)),
    where("timestamp", "<=", Timestamp.fromDate(endOfMonth)),
    orderBy("timestamp", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      waktu_masuk: data.waktu_masuk instanceof Timestamp ? data.waktu_masuk.toDate() : data.waktu_masuk,
      waktu_pulang: data.waktu_pulang instanceof Timestamp ? data.waktu_pulang.toDate() : data.waktu_pulang,
      timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : data.timestamp,
    } as TeacherAttendance;
  });
};
