import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { NewsSection } from "@/components/NewsSection";
import { ProfileSection } from "@/components/ProfileSection";
import { AcademicSection } from "@/components/AcademicSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <NewsSection />
        <ProfileSection />
        <AcademicSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
