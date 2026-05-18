import { Link } from "@tanstack/react-router";
import { BOOKS } from "@/lib/content";

export function LibraryCarousel() {
  return (
    <section className="container-page py-8">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Bibliothèque</h2>
          <p className="text-sm text-muted-foreground">Les ouvrages du Pasteur ADAM Aboudaminou</p>
        </div>
        <Link to="/bibliotheque" className="text-sm font-semibold text-primary hover:text-flame">
          Plus →
        </Link>
      </div>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
        {BOOKS.map((b) => (
          <Link key={b.id} to="/bibliotheque" className="group w-48 shrink-0 snap-start sm:w-56">
            <div className="relative aspect-square overflow-hidden rounded-none border border-border bg-muted shadow-soft transition group-hover:shadow-elegant">
              <img
                src={b.cover}
                alt={b.title}
                className="h-full w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3">
                <div className="font-display text-sm font-bold leading-tight text-white line-clamp-2">{b.title}</div>
                <div className="text-[10px] text-white/80">{b.chapters} chapitres</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
