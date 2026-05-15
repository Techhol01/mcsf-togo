import { Link } from "@tanstack/react-router";
import { ARTICLES } from "@/lib/content";

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
      <div className="grid gap-4 md:grid-cols-3">
        {ARTICLES.slice(0, 3).map((a, idx) => (
          <Link
            key={a.id}
            to="/blog"
            className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-soft ${idx === 0 ? "md:col-span-1 md:row-span-1" : ""}`}
          >
            <div className="aspect-[16/10] bg-gradient-primary" />
            <div className="flex flex-1 flex-col p-4">
              <span className="self-start rounded-full bg-flame/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-flame">
                {a.category}
              </span>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground group-hover:text-primary">
                {a.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
              <div className="mt-3 text-xs text-muted-foreground">{a.author} · {new Date(a.date).toLocaleDateString("fr-FR")}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
