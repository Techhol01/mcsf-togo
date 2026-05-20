import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { BOOKS } from "@/lib/content";

export function LibraryCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      if (!pausedRef.current && el) {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
          el.scrollTo({ left: 0 });
        } else {
          el.scrollLeft += 0.7;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

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
      <div
        ref={scrollerRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {[...BOOKS, ...BOOKS].map((b, i) => (
          <Link key={`${b.id}-${i}`} to="/bibliotheque" className="group w-44 shrink-0 sm:w-56">
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
