import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Check for admin session
    const cookieStore = cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const { 
      email, 
      password, 
      name, 
      nip, 
      photoURL, 
      gender, 
      position, 
      classTeacher, 
      subject, 
      phone, 
      status 
    } = data;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: "Firebase Admin is not initialized." }, { status: 500 });
    }

    // 1. Create User in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const teacherData = {
      name,
      nip: nip || "",
      photoURL: photoURL || "",
      gender: gender || "",
      position: position || "",
      classTeacher: classTeacher || "",
      subject: subject || "",
      phone: phone || "",
      email: email,
      password: password, // Store plain-text password for admin viewing
      status: status || "Aktif",
      role: "teacher",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("users").doc(userRecord.uid).set(teacherData);

    return NextResponse.json({ 
      success: true, 
      message: "Teacher account created successfully",
      uid: userRecord.uid
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating teacher:", error);
    return NextResponse.json({ error: error.message || "Failed to create teacher account" }, { status: 500 });
  }
}
