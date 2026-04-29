import { Navbar } from "@/components/admin/Navbar";
import { SidebarGuru } from "@/components/guru/SidebarGuru";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";

export default async function GuruLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 💡 Jika Anda memakai Next.js 15, ubah menjadi: const cookieStore = await cookies();
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/login");
  }

  let decodedClaims = null;

  if (!adminAuth) {
    console.warn("Admin Auth is not initialized. Bypassing secure session check for now.");
  } else {
    // 1. Verifikasi cookie dilakukan di DALAM try-catch
    try {
      decodedClaims = await adminAuth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Invalid session cookie:", error);
      // Jangan taruh redirect() di sini
    }
  }

  // 2. Jika verifikasi gagal (session kadaluarsa), lakukan redirect di LUAR try-catch
  if (!decodedClaims && adminAuth) {
    redirect("/login");
  }

  // 3. PROTEKSI ROLE
  if (decodedClaims) {
    // Cek role dari token Firebase atau dari cookie fallback
    const userRole = decodedClaims.role || cookieStore.get("userRole")?.value;

    // Pastikan hanya role "guru" atau "teacher" yang boleh masuk
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