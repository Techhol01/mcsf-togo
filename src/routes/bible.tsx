import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Book, Heart, Search } from "lucide-react";

export const Route = createFileRoute("/bible")({
  head: () => ({
    meta: [
      { title: "Bible — MCSF" },
      { name: "description", content: "Lire la Bible Louis Segond en ligne, par livre et chapitre." },
    ],
  }),
  component: BiblePage,
});

const BOOKS = [
  { id: "Genesis", name: "Genèse", chapters: 50 },
  { id: "Exodus", name: "Exode", chapters: 40 },
  { id: "Psalms", name: "Psaumes", chapters: 150 },
  { id: "Proverbs", name: "Proverbes", chapters: 31 },
  { id: "Isaiah", name: "Ésaïe", chapters: 66 },
  { id: "Matthew", name: "Matthieu", chapters: 28 },
  { id: "John", name: "Jean", chapters: 21 },
  { id: "Romans", name: "Romains", chapters: 16 },
  { id: "Revelation", name: "Apocalypse", chapters: 22 },
];

function BiblePage() {
  const [book, setBook] = useState(BOOKS[6]);
  const [chapter, setChapter] = useState(3);
  const [favorites, setFavorites] = useState<string[]>([]);
  const verseKey = `${book.name} ${chapter}`;

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page flex items-center gap-3">
          <Book className="h-7 w-7 text-flame" />
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Bible — Louis Segond</h1>
            <p className="mt-1 text-primary-foreground/85">Lire, méditer, marquer ses favoris.</p>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-6 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <label className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input placeholder="Rechercher un livre" className="w-full bg-transparent outline-none" />
            </label>
            <ul className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto">
              {BOOKS.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => { setBook(b); setChapter(1); }}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${book.id === b.id ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
                  >
                    {b.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Lecture</p>
              <h2 className="font-display text-2xl font-semibold text-foreground">{book.name} {chapter}</h2>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="rounded-full border border-border bg-background px-3 py-2 text-sm"
              >
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>Chapitre {n}</option>
                ))}
              </select>
              <button
                onClick={() => setFavorites((f) => f.includes(verseKey) ? f.filter((x) => x !== verseKey) : [...f, verseKey])}
                className={`inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm ${favorites.includes(verseKey) ? "bg-flame text-flame-foreground" : "bg-background"}`}
              >
                <Heart className="h-4 w-4" /> Favori
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-3 text-foreground leading-relaxed">
            <p><span className="mr-2 font-bold text-flame">1</span>Il y avait parmi les pharisiens un homme, nommé Nicodème, un chef des Juifs.</p>
            <p><span className="mr-2 font-bold text-flame">2</span>Il vint, lui, auprès de Jésus, de nuit, et lui dit: Rabbi, nous savons que tu es un docteur venu de Dieu.</p>
            <p><span className="mr-2 font-bold text-flame">3</span>Jésus lui répondit: En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu.</p>
            <p><span className="mr-2 font-bold text-flame">16</span>Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.</p>
            <p className="mt-4 text-sm italic text-muted-foreground">Le texte complet sera intégré via une API biblique. Les versets ci-dessus sont issus de la version Louis Segond (domaine public).</p>
          </div>

          {favorites.length > 0 && (
            <div className="mt-6 rounded-xl border border-border bg-accent/40 p-4">
              <p className="text-sm font-semibold text-foreground">Vos favoris</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {favorites.map((f) => (
                  <span key={f} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">{f}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
