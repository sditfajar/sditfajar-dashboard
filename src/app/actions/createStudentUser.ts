"use server";

import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function createStudentUser(data: {
  email: string;
  password: string;
  nisn: string;
  namaLengkap: string;
}) {
  try {
    if (!adminAuth || !adminDb) {
      return { success: false, error: "Firebase Admin SDK belum diinisialisasi. Periksa environment variables." };
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.namaLengkap,
    });

    // 2. Save user data to Firestore collection 'users'
    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: data.email,
      name: data.namaLengkap,
      nisn: data.nisn,
      role: "student",
      createdAt: new Date(),
    });

    return { success: true, uid: userRecord.uid };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan tidak diketahui";
    console.error("Error creating student user:", error);
    return { success: false, error: message };
  }
}
