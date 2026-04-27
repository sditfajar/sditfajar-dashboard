import { BookOpen, Target, Heart, Award } from "lucide-react";
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
                <Target className="text-primary h-6 w-6" /> Visi Kami
              </h3>
              <p className="text-xl font-medium italic text-foreground/80 border-l-4 border-primary pl-4">
                &quot;Terwujudnya generasi Qur&apos;ani yang cerdas, mandiri, berprestasi, dan berwawasan global.&quot;
              </p>
            </div>

            <div className="space-y-6 p-6">
              <h3 className="text-2xl font-extrabold flex items-center gap-2">
                <BookOpen className="text-primary h-6 w-6" /> Misi Utama
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Pembentukan Karakter</h4>
                    <p className="text-muted-foreground">Menanamkan aqidah yang lurus dan akhlakul karimah dalam kehidupan sehari-hari.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Keunggulan Akademik</h4>
                    <p className="text-muted-foreground">Menyelenggarakan proses pembelajaran yang aktif, inovatif, kreatif, efektif, dan menyenangkan.</p>
                  </div>
                </li>
              </ul>
            </div>
          </FadeIn>

        </FadeInStagger>
      </div>
    </section>
  );
}
