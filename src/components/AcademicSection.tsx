import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, FlaskConical, Globe, Monitor, Users, PaintBucket, type LucideIcon } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

const extracurriculars: { name: string; icon: LucideIcon }[] = [
  { name: "Pramuka", icon: Users },
  { name: "Sains Club", icon: FlaskConical },
  { name: "English Club", icon: Globe },
  { name: "Komputer", icon: Monitor },
  { name: "Seni Rupa", icon: PaintBucket },
];

export function AcademicSection() {
  return (
    <section id="akademik" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">Program Akademik</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed">
            Kurikulum unggulan yang dirancang untuk menggali potensi setiap siswa melalui pendekatan holistik.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
          <FadeIn className="space-y-6">
            <h3 className="text-2xl font-extrabold">Kurikulum Terpadu</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Kami menerapkan kurikulum yang memadukan Standar Nasional Pendidikan dengan nilai-nilai keislaman.
              Pendekatan pembelajaran berpusat pada siswa (student-centered learning) untuk mendorong siswa berfikir kritis,
              kreatif, dan mampu memecahkan masalah.
            </p>
            <FadeInStagger faster className="space-y-3 mt-6">
              {[
                "Pembelajaran Tematik Terpadu",
                "Program Tahsin & Tahfidz Al-Quran",
                "Pengembangan Karakter (Character Building)",
                "Pendidikan Lingkungan Hidup",
                "Pengenalan Teknologi Sejak Dini"
              ].map((item, i) => (
                <FadeIn key={i} className="flex items-center gap-3">
                  <CircleCheck className="h-5 w-5 text-primary" />
                  <span className="font-medium">{item}</span>
                </FadeIn>
              ))}
            </FadeInStagger>
          </FadeIn>
          
          <FadeInStagger className="grid grid-cols-2 gap-4">
             {/* Abstract illustration or graphic for curriculum can go here, using a placeholder colored box with modern styling for now */}
             <FadeIn className="aspect-square rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center p-6 text-center shadow-sm">
                <span className="text-4xl font-bold text-primary mb-2">100%</span>
                <span className="font-medium text-foreground">Guru Tersertifikasi</span>
             </FadeIn>
             <FadeIn className="aspect-square rounded-2xl bg-background border border-border flex flex-col items-center justify-center p-6 text-center shadow-sm mt-8">
                <span className="text-4xl font-bold text-foreground mb-2">24</span>
                <span className="font-medium text-muted-foreground">Maks Siswa/Kelas</span>
             </FadeIn>
          </FadeInStagger>
        </div>

        <div>
          <FadeIn><h3 className="text-2xl font-extrabold mb-8 text-center">Kegiatan Ekstrakurikuler</h3></FadeIn>
          <FadeInStagger faster className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {extracurriculars.map((ekskul, index) => {
              const Icon = ekskul.icon;
              return (
                <FadeIn key={index}>
                  <Card className="text-center hover:border-primary/50 transition-colors bg-background h-full">
                    <CardHeader className="pb-2">
                      <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{ekskul.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </FadeIn>
              );
            })}
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
