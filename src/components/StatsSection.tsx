import bg from "@/assets/impact-bg.jpg";
import { STATS } from "@/lib/content";

export function StatsSection() {
  return (
    <section className="relative py-16">
      <div className="absolute inset-0 -z-10">
        <img src={bg} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>
      <div className="container-page text-primary-foreground">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">Notre impact</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Au service du Royaume</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-6 text-center backdrop-blur">
              <div className="font-display text-3xl font-bold text-flame md:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-primary-foreground/90">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
