import { Link } from "@tanstack/react-router";
import { ARTICLES } from "@/lib/content";
import { Calendar } from "lucide-react";

export function RecentArticles() {
  return (
    <section className="container-page py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Articles récents</h2>
          <p className="text-sm text-muted-foreground">Méditations et révélations</p>
        </div>
        <Link to="/blog" className="text-sm font-semibold text-primary hover:text-flame">Plus →</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.slice(0, 3).map((a) => (
          <Link
            key={a.id}
            to="/blog"
            className="group flex aspect-square flex-col overflow-hidden rounded-none border border-border bg-card transition hover:shadow-elegant"
          >
            <div className="relative h-1/2 w-full overflow-hidden">
              <img src={a.cover} alt={a.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
              <span className="absolute left-3 top-3 rounded-none bg-flame px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-foreground">
                {a.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-base font-bold leading-snug text-foreground group-hover:text-primary line-clamp-2">
                {a.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.excerpt}</p>
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(a.date).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
