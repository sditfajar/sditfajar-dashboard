import { BookOpen, Target } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

export function ProfileSection() {
  return (
    <section id="profil" className="py-24 bg-background border-y border-border relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <FadeInStagger className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">

          {/* History */}
          <FadeIn className="space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              Profil Sekolah
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Mengenal SDIT Fajar
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Didirikan dengan komitmen kuat untuk memajukan pendidikan yang berlandaskan nilai-nilai agama,
              SDIT Fajar telah berkembang menjadi institusi pendidikan dasar yang dipercaya oleh masyarakat.
              Kami menggabungkan kurikulum pendidikan nasional dengan pendidikan karakter Islami secara terpadu.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Perjalanan kami dimulai dari tekad untuk melahirkan generasi yang tidak hanya cerdas secara akademik,
              tetapi juga memiliki kecerdasan emosional dan spiritual yang tangguh untuk menghadapi tantangan masa depan.
            </p>
          </FadeIn>

          {/* Visi Misi */}
          <FadeIn className="space-y-8 relative">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-secondary/50 rounded-3xl -z-10"></div>

            <div className="space-y-6 p-6">
              <h3 className="text-2xl font-extrabold flex items-center gap-2">
                <Target className="text-primary h-6 w-6" /> Motto Kami
              </h3>
              <p className="text-xl font-medium italic text-foreground/80 border-l-4 border-primary pl-4">
                &quot;Jiwa Pemimpin tumbuh dari lingkungan dan perkembangan interaksi sosial.&quot;
              </p>
            </div>

            <div className="space-y-6 p-6">
              <h3 className="text-2xl font-extrabold flex items-center gap-2">
                <BookOpen className="text-primary h-6 w-6" /> Misi Utama
              </h3>
              <ul className="space-y-3">
                {[
                  "Menanam keimanan dan ketaqwaan kepada peserta didik dalam taat beribadah",
                  "Membentuk peserta didik yang cerdas, kreatif, inovatif dan berakhlak mulia",
                  "Mengoptimalkan proses pembelajaran dengan bimbingan dalam mengembangkan bakat yang dimiliki peserta didik",
                  "Meningkatkan prestasi akademik dan non akademik",
                  "Mewujudkan suasana kekeluargaan antar warga sekolah",
                  "Mewujudkan budaya peduli lingkungan hidup"
                ].map((item, index) => (
                  <li key={index} className="flex gap-3 items-start group">
                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

        </FadeInStagger>
      </div>
    </section>
  );
}
