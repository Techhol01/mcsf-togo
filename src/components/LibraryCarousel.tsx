import { Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
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
            className="group w-48 shrink-0 snap-start sm:w-56"
          >
            <div className="relative aspect-square overflow-hidden rounded-none border border-border bg-gradient-primary shadow-soft transition group-hover:shadow-elegant">
              <div className="absolute inset-0 flex flex-col justify-between p-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-flame">MCSF</span>
                  <BookOpen className="h-5 w-5 opacity-80" />
                </div>
                <div>
                  <div className="font-display text-base font-bold leading-tight line-clamp-3">{b.title}</div>
                  <div className="mt-1 text-[11px] text-primary-foreground/80">{b.chapters} chapitres</div>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs font-medium text-foreground">{b.author}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
