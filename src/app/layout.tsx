import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import PWARegistration from "@/components/PWARegistration";
import InstallPrompt from "@/components/InstallPrompt"; // 1. Import komponen popup

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SDIT Fajar | Cerdas, Kreatif, Berakhlak Mulia",
  description: "Website resmi SDIT Fajar - Mewujudkan generasi cerdas, kreatif, dan berakhlak mulia.",
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Mendaftarkan Service Worker */}
          <PWARegistration />

          {children}

          {/* Komponen UI Global */}
          <Toaster />
          <InstallPrompt /> {/* 2. Panggil komponen popup di sini */}

        </ThemeProvider>
      </body>
    </html>
  );
}