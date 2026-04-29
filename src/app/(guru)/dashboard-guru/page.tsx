"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardGuruPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <FadeIn className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard Guru</h1>
      </FadeIn>
      <FadeIn className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle>Selamat Datang</CardTitle>
            <CardDescription>Sistem Informasi Akademik SDIT Fajar</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Selamat datang di dashboard guru. Melalui portal ini, Anda dapat mengelola absensi dan melihat jadwal mengajar.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
