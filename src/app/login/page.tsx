"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const tabs = [
  { id: "admin", label: "Admin" },
  { id: "guru", label: "Guru" },
  { id: "siswa", label: "Siswa" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [nisn, setNisn] = useState("");
  const [nip, setNip] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("admin");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let loginEmail = email;
      if (activeTab === "siswa") {
        loginEmail = `${nisn}@sditfajar.com`;
      } else if (activeTab === "guru") {
        loginEmail = `${nip}@sditfajar.sch.id`;
      }

      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const idToken = await userCredential.user.getIdToken();

      // Fetch user role from Firestore FIRST
      const { getDoc, doc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase/config");

      let userRole = "admin"; // Default
      try {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() || {};
          userRole = userData?.role ?? "admin";
        }
      } catch (dbError) {
        console.error("Error fetching user role:", dbError);
      }

      // Send token and role to our API to create a session cookie
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken, role: userRole }),
      });

      if (response.ok) {
        if (userRole === "teacher") {
          router.push("/dashboard-guru");
        } else if (userRole === "student" || userRole === "murid") {
          router.push("/dashboard-siswa");
        } else {
          router.push("/admin");
        }
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Gagal membuat sesi.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Kredensial tidak valid. Silakan periksa kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4 font-sans relative">
      <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8">
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Button>
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {activeTab === "siswa" ? "Login Siswa" : activeTab === "guru" ? "Portal Guru" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            Silahkan masuk ke sistem SDIT Fajar
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="flex space-x-1 rounded-xl bg-muted/50 p-1 mb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab.id);
                  }}
                  className={`${activeTab === tab.id
                    ? "text-green-600"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    } relative flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors outline-none`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 rounded-sm bg-background shadow-sm border border-border/50"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {activeTab === "siswa" ? (
              <div className="grid gap-2">
                <Label htmlFor="nisn">NISN</Label>
                <Input
                  id="nisn"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Masukkan 10 digit NISN"
                  required
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value.replace(/\D/g, ""))}
                  className="focus-visible:ring-green-500"
                />
              </div>
            ) : activeTab === "guru" ? (
              <div className="grid gap-2">
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Masukkan NIP Anda"
                  required
                  value={nip}
                  onChange={(e) => setNip(e.target.value.replace(/\D/g, ""))}
                  className="focus-visible:ring-green-500"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@sditfajar.sch.id"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus-visible:ring-green-500"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-green-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
