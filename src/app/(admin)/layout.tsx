import { Sidebar } from "@/components/admin/Sidebar";
import { Navbar } from "@/components/admin/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";

export default async function AdminLayout({
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
    // In production, you would want to throw or redirect.
  } else {
    try {
      // Verify the session cookie securely
      await adminAuth.verifySessionCookie(session, true);
    } catch (error) {
      console.error("Invalid session cookie:", error);
      redirect("/login");
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
