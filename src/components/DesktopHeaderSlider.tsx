import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const SLIDES = [
  {
    img: hero1,
    eyebrow: "Mission Christ Sans Frontière",
    subtitle: "Habakuk 2:14",
    title: "« La terre sera remplie de la connaissance de la gloire de l'Éternel »",
    body: "Une œuvre consacrée à la prédication de l'Évangile et à la révélation parfaite de Jésus-Christ.",
    cta: { label: "Écouter le podcast", to: "/podcast" as const },
  },
  {
    img: hero2,
    eyebrow: "Pasteur ADAM Aboudaminou",
    subtitle: "Tite 2:11-13",
    title: "Marcher dans la pureté, briller pour Christ",
    body: "Une mission au cœur du Togo et au-delà des frontières — enseignements, prophéties et discipulat.",
    cta: { label: "Voir les enseignements", to: "/enseignement" as const },
  },
  {
    img: hero3,
    eyebrow: "Soutenir l'œuvre",
    subtitle: "2 Corinthiens 9:7",
    title: "Soutenez la propagation de l'Évangile",
    body: "Votre don contribue à l'évangélisation, à la formation des disciples et au rayonnement de la mission.",
    cta: { label: "Faire un don", to: "/don" as const },
  },
];

export function DesktopHeaderSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[480px] w-full overflow-hidden sm:h-[520px] md:h-[560px]">
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img src={s.img} alt="" className="h-full w-full object-cover" loading={idx === 0 ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="container-page relative z-20 flex h-full flex-col items-start justify-center text-primary-foreground">
            <div className="max-w-3xl rounded-none border-l-4 border-flame bg-black/60 p-4 backdrop-blur-sm sm:p-6 md:bg-black/40">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.3em] text-flame drop-shadow sm:text-xs sm:tracking-[0.35em]">
                {s.eyebrow}
              </p>
              <p className="mb-3 inline-block bg-flame px-2 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-flame-foreground sm:mb-4 sm:text-xs sm:tracking-[0.3em]">
                {s.subtitle}
              </p>
              <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] sm:text-3xl md:text-5xl lg:text-6xl">
                {s.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm font-medium text-white drop-shadow sm:mt-4 sm:text-base md:text-lg">
                {s.body}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                <Link
                  to={s.cta.to}
                  className="rounded-full bg-gradient-flame px-4 py-2 text-xs font-semibold shadow-flame transition hover:scale-[1.03] sm:px-6 sm:py-3 sm:text-sm"
                >
                  {s.cta.label}
                </Link>
                <Link
                  to="/blog"
                  className="rounded-full border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur transition hover:bg-white/20 sm:px-6 sm:py-3 sm:text-sm"
                >
                  Lire le blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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
