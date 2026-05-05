import { SidebarSiswa } from "@/components/siswa-dashboard/SidebarSiswa";
import { NavbarSiswa } from "@/components/siswa-dashboard/NavbarSiswa";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { IdleLogout } from "@/components/admin/IdleLogout";

export default async function SiswaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const session = cookieStore.get("session")?.value || "";

  if (!session) {
    redirect("/login");
  }

  if (adminAuth) {
    try {
      // Verify the session cookie securely
      const decodedClaims = await adminAuth.verifySessionCookie(session, true);
      // Optional: Check if role is student, if not redirect to their respective dashboard
      if (decodedClaims.role !== "student") {
        console.warn("User is not a student. Assuming role based routing should happen elsewhere or redirecting.");
        // redirect("/"); // Let middleware handle this or we can enforce here
      }
    } catch (error) {
      console.error("Invalid session cookie:", error);
      redirect("/login");
    }
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <IdleLogout />
      <SidebarSiswa />
      <div className="flex flex-col w-full overflow-hidden">
        <NavbarSiswa />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 max-w-[100vw] lg:max-w-none">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
