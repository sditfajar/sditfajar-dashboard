import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden w-full min-h-screen flex items-center justify-center bg-background border-border">
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      >
        <div
          className="absolute inset-0 w-[200%] h-[200%] -left-[50%] -top-[50%]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(128, 128, 128, 0.3) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(128, 128, 128, 0.3) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
            animation: "gridMove 10s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateY(0) translateX(0); }
              100% { transform: translateY(50px) translateX(50px); }
            }
          `}
        </style>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <FadeIn className="container relative z-10 mx-auto px-4 md:px-6 text-center flex flex-col items-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          Penerimaan Siswa Baru Dibuka
        </div>

        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-4xl md:text-6xl lg:text-7xl mb-6 text-foreground">
          Belajar dengan Iman, {" "}
          <span className="text-primary block sm:inline">Tumbuh dengan Ilmu.</span>
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground mb-10 sm:text-xl md:text-2xl">
          SDIT Fajar membentuk generasi Islami yang cerdas, mandiri, dan berkarakter mulia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" asChild className="gap-2 h-12 px-8 text-base shadow-lg shadow-primary/25 transition-transform hover:scale-105">
            <Link href="/pendaftaran">
              Mulai Pendaftaran <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm transition-transform hover:scale-105">
            Jelajahi Program
          </Button>
        </div>
      </FadeIn>
    </section>
  );
}
