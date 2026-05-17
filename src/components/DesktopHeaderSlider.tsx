import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const SLIDES = [
  {
    img: hero1,
    title: "« La terre sera remplie de la connaissance de la gloire de l'Éternel »",
    subtitle: "Habakuk 2:14",
    cta: { label: "Écouter", to: "/podcast" as const },
  },
  {
    img: hero2,
    title: "Marcher dans la pureté, briller pour Christ",
    subtitle: "Une mission au cœur du Togo et au-delà des frontières",
    cta: { label: "Voir les enseignements", to: "/enseignement" as const },
  },
  {
    img: hero3,
    title: "Soutenez l'œuvre du Royaume",
    subtitle: "Votre don contribue à la propagation de l'Évangile",
    cta: { label: "Donner", to: "/don" as const },
  },
];

export function DesktopHeaderSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[420px] w-full overflow-hidden md:h-[520px]">
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.img} alt="" className="h-full w-full object-cover" loading={idx === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="container-page relative flex h-full flex-col items-start justify-center text-primary-foreground">
            <div className="max-w-3xl animate-slide-in">
              <p className="mb-3 inline-block border-l-4 border-flame pl-3 text-xs font-bold uppercase tracking-[0.3em] text-flame">
                {s.subtitle}
              </p>
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {s.title}
              </h2>
              <p className="mt-4 max-w-xl text-base font-medium text-primary-foreground/90 md:text-lg">
                Mission Christ Sans Frontière — Pasteur ADAM Aboudaminou. Une œuvre consacrée à la prédication
                de l'Évangile et à la révélation parfaite de Jésus-Christ.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={s.cta.to}
                  className="rounded-full bg-gradient-flame px-6 py-3 text-sm font-semibold shadow-flame transition hover:scale-[1.03]"
                >
                  {s.cta.label}
                </Link>
                <Link
                  to="/blog"
                  className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
                >
                  Lire le blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-flame" : "w-2 bg-white/60"}`}
          />
        ))}
      </div>
    </section>
  );
}
