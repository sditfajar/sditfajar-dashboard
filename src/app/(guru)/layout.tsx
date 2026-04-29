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
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/login");
  }

  if (!adminAuth) {
    console.warn("Admin Auth is not initialized. Bypassing secure session check for now.");
  } else {
    try {
      await adminAuth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Invalid session cookie:", error);
      redirect("/login");
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
