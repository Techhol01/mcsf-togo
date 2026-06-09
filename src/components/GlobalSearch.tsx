import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, BookOpen, FileText, Video, Book as BookIcon, Radio, Calendar } from "lucide-react";
import { ARTICLES, BOOKS, VIDEOS, PODCASTS, EVENTS } from "@/lib/content";

const BIBLE_BOOKS = [
  "Genèse", "Exode", "Lévitique", "Nombres", "Deutéronome", "Josué", "Juges", "Ruth",
  "Psaumes", "Proverbes", "Ésaïe", "Jérémie", "Daniel", "Matthieu", "Marc", "Luc",
  "Jean", "Actes", "Romains", "1 Corinthiens", "Galates", "Éphésiens", "Philippiens",
  "Hébreux", "Jacques", "1 Pierre", "1 Jean", "Apocalypse",
];

type Result = {
  kind: "Article" | "Livre" | "Vidéo" | "Bible" | "Podcast" | "Événement";
  title: string;
  to: string;
  excerpt?: string;
};

export function GlobalSearch({ trigger }: { trigger?: "icon" | "input" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<Result[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const match = (t: string) => t.toLowerCase().includes(s);
    const r: Result[] = [];
    ARTICLES.filter((a) => match(a.title) || match(a.excerpt) || match(a.category)).forEach((a) =>
      r.push({ kind: "Article", title: a.title, excerpt: a.excerpt, to: "/blog" })
    );
    BOOKS.filter((b) => match(b.title) || match(b.author)).forEach((b) =>
      r.push({ kind: "Livre", title: b.title, excerpt: `${b.chapters} chapitres`, to: "/bibliotheque" })
    );
    VIDEOS.filter((v) => match(v.title)).forEach((v) =>
      r.push({ kind: "Vidéo", title: v.title, to: "/enseignement" })
    );
    PODCASTS.filter((p) => match(p.title)).forEach((p) =>
      r.push({ kind: "Podcast", title: p.title, excerpt: p.duration, to: "/podcast" })
    );
    EVENTS.filter((e) => match(e.title) || match(e.description) || match(e.location)).forEach((e) =>
      r.push({ kind: "Événement", title: e.title, excerpt: e.location, to: "/evenements" })
    );
    BIBLE_BOOKS.filter((b) => match(b)).forEach((b) =>
      r.push({ kind: "Bible", title: b, to: "/bible" })
    );
    return r.slice(0, 30);
  }, [q]);

  const iconFor = (k: Result["kind"]) => {
    switch (k) {
      case "Article": return <FileText className="h-4 w-4" />;
      case "Livre": return <BookOpen className="h-4 w-4" />;
      case "Vidéo": return <Video className="h-4 w-4" />;
      case "Bible": return <BookIcon className="h-4 w-4" />;
      case "Podcast": return <Radio className="h-4 w-4" />;
      case "Événement": return <Calendar className="h-4 w-4" />;
    }
  };

  const go = (to: string) => {
    setOpen(false);
    setQ("");
    navigate({ to: to as never });
  };

  return (
    <>
      {trigger === "input" ? (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full min-w-0 items-center gap-2 truncate rounded-full border border-border bg-secondary/60 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-accent"
        >
          <Search className="h-4 w-4 shrink-0" /> <span className="truncate">Rechercher dans tout le site...</span>
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
          aria-label="Recherche globale"
        >
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Rechercher</span>
          <kbd className="hidden rounded bg-background px-1.5 py-0.5 text-[10px] lg:inline">⌘K</kbd>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[10vh]" onClick={() => setOpen(false)}>
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-popover shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-border p-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher articles, livres, vidéos, Bible, podcasts..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <button onClick={() => setOpen(false)} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {!q && (
                <p className="p-6 text-center text-sm text-muted-foreground">Tapez pour rechercher dans tout le site.</p>
              )}
              {q && results.length === 0 && (
                <p className="p-6 text-center text-sm text-muted-foreground">Aucun résultat pour « {q} ».</p>
              )}
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => go(r.to)}
                  className="flex w-full items-start gap-3 border-b border-border/40 px-4 py-3 text-left hover:bg-accent"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {iconFor(r.kind)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-flame">{r.kind}</span>
                    </div>
                    <div className="truncate font-medium text-foreground">{r.title}</div>
                    {r.excerpt && <div className="truncate text-xs text-muted-foreground">{r.excerpt}</div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
