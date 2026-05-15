import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import vupj from "@/assets/event-vupj.jpg";
import { EVENTS } from "@/lib/content";

export function UpcomingEvents() {
  const upcoming = EVENTS.filter((e) => e.status === "upcoming");
  return (
    <section className="container-page py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Événements à venir</h2>
          <p className="text-sm text-muted-foreground">Rejoignez-nous</p>
        </div>
        <Link to="/evenements" className="text-sm font-semibold text-primary hover:text-flame">Plus →</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/evenements" className="group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-soft md:aspect-auto md:row-span-2">
          <img src={vupj} alt="VUPJ 2026" className="h-full w-full object-cover transition group-hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
            <span className="rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wider">À venir</span>
            <h3 className="mt-2 font-display text-2xl font-bold">{upcoming[0].title}</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-primary-foreground/90">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(upcoming[0].date).toLocaleDateString("fr-FR")}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{upcoming[0].location}</span>
            </div>
          </div>
        </Link>
        {upcoming.slice(1).map((e) => (
          <Link key={e.id} to="/evenements" className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-soft">
            <span className="rounded-full bg-flame/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-flame">À venir</span>
            <h3 className="mt-2 font-display text-lg font-bold">{e.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(e.date).toLocaleDateString("fr-FR")}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
