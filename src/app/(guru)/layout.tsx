import { Navbar } from "@/components/admin/Navbar";
import { SidebarGuru } from "@/components/guru/SidebarGuru";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import type { DecodedIdToken } from "firebase-admin/auth";

export default async function GuruLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Dalam Next.js 14, cookies() bersifat sinkron.
  // Jika bermigrasi ke Next.js 15 kelak, tambahkan await di depan cookies().
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/login");
  }

  // Menggunakan tipe data spesifik DecodedIdToken alih-alih 'any'
  let decodedClaims: DecodedIdToken | null = null;

  if (!adminAuth) {
    console.warn("Admin Auth is not initialized. Bypassing secure session check for now.");
  } else {
    try {
      decodedClaims = await adminAuth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Invalid session cookie:", error);
      // PENTING: Jangan taruh redirect() di dalam catch() 
      // karena akan menyebabkan runtime error pada sistem Next.js.
    }
  }

  // Melakukan redirect di luar blok try...catch setelah evaluasi aman
  if (!decodedClaims && adminAuth) {
    redirect("/login");
  }

  if (decodedClaims) {
    const userRole = decodedClaims.role || cookieStore.get("userRole")?.value;

    if (userRole !== "guru" && userRole !== "teacher") {
      console.warn(`Akses ditolak: Role pengguna saat ini adalah '${userRole}'`);
      redirect("/");
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SidebarGuru />
      <div className="flex flex-col w-full overflow-hidden">
        <Navbar isGuruMode={true} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-[100vw]">
          {children}
        </main>
      </div>
    </div>
  );
}