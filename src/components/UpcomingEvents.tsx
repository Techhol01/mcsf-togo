import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
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
        {upcoming.map((e) => (
          <Link
            key={e.id}
            to="/evenements"
            className="group flex flex-col overflow-hidden rounded-none border border-border bg-card shadow-soft transition hover:shadow-elegant"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img src={e.cover} alt={e.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-none bg-flame px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-foreground">
                À venir
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary">{e.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(e.date).toLocaleDateString("fr-FR")}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
