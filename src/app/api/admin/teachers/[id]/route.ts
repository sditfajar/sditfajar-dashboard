import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: "Firebase Admin is not initialized." }, { status: 500 });
    }

    // 1. Update User in Firebase Auth
    const updateData: any = {
      displayName: name,
    };
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    await adminAuth.updateUser(id, updateData);

    // 2. Update Data in Firestore `users` collection
    const teacherData: any = {
      name,
      nip: nip || "",
      photoURL: photoURL || "",
      gender: gender || "",
      position: position || "",
      classTeacher: classTeacher || "",
      subject: subject || "",
      phone: phone || "",
      status: status || "Aktif",
      updatedAt: new Date().toISOString(),
    };
    
    if (email) teacherData.email = email;
    if (password) teacherData.password = password;

    await adminDb.collection("users").doc(id).update(teacherData);

    return NextResponse.json({ 
      success: true, 
      message: "Teacher account updated successfully"
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ error: error.message || "Failed to update teacher account" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const session = cookieStore.get("session");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: "Firebase Admin is not initialized." }, { status: 500 });
    }

    // 1. Delete from Firebase Auth
    await adminAuth.deleteUser(id);

    // 2. Delete from Firestore
    await adminDb.collection("users").doc(id).delete();

    return NextResponse.json({ 
      success: true, 
      message: "Teacher account deleted successfully"
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: error.message || "Failed to delete teacher account" }, { status: 500 });
  }
}
