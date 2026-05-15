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
          <Link
            key={b.id}
            to="/bibliotheque"
            className="group w-44 shrink-0 snap-start sm:w-52"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-primary shadow-soft transition group-hover:scale-[1.02]">
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-primary-foreground">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-flame">MCSF</div>
                <div>
                  <div className="font-display text-lg font-bold leading-tight">{b.title}</div>
                  <div className="mt-1 text-[11px] text-primary-foreground/80">{b.chapters} chapitres</div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{b.author}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
