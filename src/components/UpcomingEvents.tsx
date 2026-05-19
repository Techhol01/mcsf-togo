import { Link } from "@tanstack/react-router";
import { Calendar, MapPin } from "lucide-react";
import { EVENTS } from "@/lib/content";

export function UpcomingEvents() {
  const upcoming = EVENTS.filter((e) => e.status === "upcoming").slice(0, 2);
  const [featured, second] = upcoming;
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
        {featured && (
          <Link
            to="/evenements"
            className="group relative block aspect-[4/3] overflow-hidden rounded-none border border-border shadow-soft transition hover:-translate-y-1 hover:shadow-elegant md:aspect-auto md:min-h-[280px]"
          >
            <img src={featured.cover} alt={featured.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="inline-block rounded-none bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-foreground shadow-flame">
                À venir
              </span>
              <h3 className="mt-3 font-display text-xl font-bold leading-tight md:text-2xl">{featured.title}</h3>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/85">
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(featured.date).toLocaleDateString("fr-FR")}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{featured.location}</span>
              </div>
            </div>
          </Link>
        )}
        {second && (
          <Link
            to="/evenements"
            className="group flex flex-col justify-center rounded-none border border-border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <span className="inline-block w-fit rounded-none bg-flame/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-flame">
              À venir
            </span>
            <h3 className="mt-3 font-display text-xl font-bold leading-tight text-foreground group-hover:text-primary">{second.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{second.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(second.date).toLocaleDateString("fr-FR")}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{second.location}</span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
