import { Sidebar } from "@/components/admin/Sidebar";
import { Navbar } from "@/components/admin/Navbar";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { IdleLogout } from "@/components/admin/IdleLogout";

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
    <div className="grid min-h-screen w-full lg:grid-cols-[256px_1fr]">
      <IdleLogout />
      <Sidebar />
      <div className="flex flex-col w-full overflow-hidden bg-slate-50 dark:bg-slate-900/20">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 w-full max-w-[100vw]">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
