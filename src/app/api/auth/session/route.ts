import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { idToken, role } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    if (!adminAuth) {
      console.error("Admin Auth is not initialized. Check Firebase Admin credentials.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    // Set cookie
    const cookieStore = cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    if (role) {
      cookieStore.set("userRole", role, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
      });
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = cookies();
    cookieStore.delete("session");
    cookieStore.delete("userRole");
    
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting session cookie:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
