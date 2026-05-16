import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { BOOKS } from "@/lib/content";
import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque — MCSF" },
      { name: "description", content: "Les livres du Pasteur ADAM Aboudaminou à lire en ligne." },
    ],
  }),
  component: BibliothequePage,
});

function BibliothequePage() {
  const [openBook, setOpenBook] = useState<(typeof BOOKS)[number] | null>(null);
  const [chapter, setChapter] = useState(1);

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Bibliothèque MCSF</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">
            Les œuvres du Pasteur ADAM Aboudaminou — à lire chapitre par chapitre.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BOOKS.map((b) => (
            <article key={b.id} className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="flex h-40 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground">
                <BookOpen className="h-12 w-12 opacity-80" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">{b.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{b.author}</p>
              <p className="mt-1 text-xs text-muted-foreground">{b.chapters} chapitres</p>
              <button
                onClick={() => { setOpenBook(b); setChapter(1); }}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-flame px-4 py-2 text-sm font-semibold text-flame-foreground hover:opacity-90"
              >
                Lire en ligne
              </button>
            </article>
          ))}
        </div>
      </section>

      {openBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpenBook(null)}>
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-card shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-border p-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">{openBook.title}</h3>
                <p className="text-xs text-muted-foreground">Chapitre {chapter} / {openBook.chapters}</p>
              </div>
              <button onClick={() => setOpenBook(null)} className="rounded-full p-2 hover:bg-accent"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 leading-relaxed text-foreground">
              <h4 className="mb-3 font-display text-xl font-semibold">Chapitre {chapter}</h4>
              <p className="text-muted-foreground">
                Ce chapitre invite le lecteur à méditer la Parole de Dieu et à laisser l'Esprit Saint transformer
                son cœur. Le Pasteur ADAM y développe avec rigueur les vérités bibliques essentielles pour la vie
                chrétienne authentique.
              </p>
              <p className="mt-3 text-muted-foreground">
                Le texte complet de ce chapitre sera disponible prochainement. Merci pour votre patience et
                que la grâce du Seigneur Jésus-Christ vous accompagne.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border p-3">
              <button
                disabled={chapter === 1}
                onClick={() => setChapter((c) => Math.max(1, c - 1))}
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>
              <button
                disabled={chapter === openBook.chapters}
                onClick={() => setChapter((c) => Math.min(openBook.chapters, c + 1))}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
              >
                Suivant <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
