import { Quote } from "lucide-react";

export function DailyThought() {
  return (
    <section className="container-page py-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-primary p-6 text-primary-foreground shadow-soft md:p-10">
        <Quote className="absolute right-4 top-4 h-20 w-20 text-white/10" />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">Pensée du jour</p>
        <p className="mt-3 font-display text-xl font-medium leading-relaxed md:text-2xl">
          « Si donc le Fils vous affranchit, vous serez réellement libres. »
        </p>
        <p className="mt-2 text-sm text-primary-foreground/80">— Jean 8:36</p>
      </div>
    </section>
  );
}
