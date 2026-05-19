import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { BOOKS } from "@/lib/content";
import { ChevronLeft, ChevronRight, X, Download, Play, Pause, Volume2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque — MCSF" },
      { name: "description", content: "Les livres du Pasteur ADAM Aboudaminou à lire en ligne ou en PDF." },
    ],
  }),
  component: BibliothequePage,
});

const CHAPTER_TEXT = (book: string, chap: number) => `Chapitre ${chap} — ${book}.

Ce chapitre invite le lecteur à méditer profondément la Parole de Dieu et à laisser l'Esprit Saint transformer son cœur. Le Pasteur ADAM Aboudaminou y développe avec rigueur les vérités bibliques essentielles pour la vie chrétienne authentique.

Que la grâce du Seigneur Jésus-Christ vous accompagne tout au long de cette lecture, et que la révélation parfaite vous soit donnée. Amen.`;

function BibliothequePage() {
  const [openBook, setOpenBook] = useState<(typeof BOOKS)[number] | null>(null);
  const [chapter, setChapter] = useState(1);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  const stopSpeak = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  const speak = () => {
    if (!openBook) return;
    window.speechSynthesis?.cancel();
    const u = new SpeechSynthesisUtterance(CHAPTER_TEXT(openBook.title, chapter));
    u.lang = "fr-FR";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    window.speechSynthesis?.speak(u);
    setSpeaking(true);
  };

  const downloadPDF = () => {
    if (!openBook) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const content = BOOKS.find((b) => b.id === openBook.id);
    if (!content) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${openBook.title}</title>
      <style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.7;color:#222}
      h1{font-size:28px;margin-bottom:4px}h2{margin-top:32px;color:#444;border-bottom:1px solid #ddd;padding-bottom:6px}
      p{text-align:justify}</style></head><body>
      <h1>${openBook.title}</h1><p><em>${openBook.author}</em></p>
      ${Array.from({ length: openBook.chapters }, (_, i) => `<h2>Chapitre ${i+1}</h2><p>${CHAPTER_TEXT(openBook.title, i+1).replace(/\n/g, "</p><p>")}</p>`).join("")}
      <script>window.onload=()=>window.print()</script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Bibliothèque MCSF</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">
            Les œuvres du Pasteur ADAM Aboudaminou — à lire à votre rythme, écouter en audio ou télécharger en PDF.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {BOOKS.map((b) => (
            <article key={b.id} className="group flex flex-col overflow-hidden rounded-none border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <img src={b.cover} alt={b.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">{b.chapters} chapitres</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-display text-base font-bold leading-tight text-foreground line-clamp-2">{b.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{b.author}</p>
                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => { setOpenBook(b); setChapter(1); }}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-none bg-flame px-3 py-2 text-xs font-semibold text-flame-foreground hover:opacity-90"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Lire
                  </button>
                  <button
                    onClick={() => { setOpenBook(b); setTimeout(downloadPDF, 50); }}
                    className="inline-flex items-center justify-center rounded-none border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent"
                    title="Télécharger PDF"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {openBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => { stopSpeak(); setOpenBook(null); }}>
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-card shadow-elegant" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div className="flex items-center gap-3">
                <img src={openBook.cover} alt="" className="h-12 w-12 rounded object-cover" />
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{openBook.title}</h3>
                  <p className="text-xs text-muted-foreground">Chapitre {chapter} / {openBook.chapters}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={speaking ? stopSpeak : speak} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                  {speaking ? <Pause className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  {speaking ? "Pause" : "Écouter"}
                </button>
                <button onClick={downloadPDF} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <Download className="h-3.5 w-3.5" /> PDF
                </button>
                <button onClick={() => { stopSpeak(); setOpenBook(null); }} className="rounded-full p-2 hover:bg-accent"><X className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 leading-relaxed text-foreground">
              <h4 className="mb-4 font-display text-2xl font-semibold">Chapitre {chapter}</h4>
              <div className="whitespace-pre-line text-foreground/90">
                {CHAPTER_TEXT(openBook.title, chapter)}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border p-3">
              <button
                disabled={chapter === 1}
                onClick={() => { stopSpeak(); setChapter((c) => Math.max(1, c - 1)); }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>
              <span className="text-xs text-muted-foreground">Lecture à votre rythme</span>
              <button
                disabled={chapter === openBook.chapters}
                onClick={() => { stopSpeak(); setChapter((c) => Math.min(openBook.chapters, c + 1)); }}
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
