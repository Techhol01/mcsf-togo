import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { BOOKS } from "@/lib/content";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, X, Download, Pause, Volume2, BookOpen, Quote, Library, ChevronDown, Send, MessageCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque — MCSF" },
      { name: "description", content: "Les livres du Pasteur ADAM Aboudaminou à lire en ligne, écouter ou télécharger en PDF." },
    ],
  }),
  component: BibliothequePage,
});

// Versets clés par livre, affichés dans le chapitre et cliquables
const VERSES_BY_BOOK: Record<string, { ref: string; text: string }[]> = {
  "la-croix": [
    { ref: "Galates 6:14", text: "Pour ce qui me concerne, loin de moi la pensée de me glorifier d'autre chose que de la croix de notre Seigneur Jésus-Christ." },
    { ref: "1 Corinthiens 1:18", text: "Car la prédication de la croix est une folie pour ceux qui périssent ; mais pour nous qui sommes sauvés, elle est une puissance de Dieu." },
  ],
  "mysteres-de-la-croix": [
    { ref: "Colossiens 2:14-15", text: "Il a effacé l'acte dont les ordonnances nous condamnaient... triomphant des dominations et des autorités à la croix." },
  ],
  "reconcilier-avec-dieu": [
    { ref: "2 Corinthiens 5:20", text: "Nous vous en supplions au nom de Christ : Soyez réconciliés avec Dieu !" },
  ],
  "reconcilier-simplifier": [
    { ref: "Romains 5:10", text: "Si, lorsque nous étions ennemis, nous avons été réconciliés avec Dieu par la mort de son Fils..." },
  ],
  "sela-hammachlehoth": [
    { ref: "Psaume 3:2", text: "Plusieurs disent à mon sujet : Plus de salut pour lui auprès de Dieu ! Pause (Sela)." },
  ],
  "musulman-disciple": [
    { ref: "Matthieu 28:19", text: "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit." },
  ],
  "discoplat": [
    { ref: "Jean 8:32", text: "Vous connaîtrez la vérité, et la vérité vous affranchira." },
  ],
};

const chapterText = (book: string, chap: number) => `Chapitre ${chap} — ${book}.

Ce chapitre invite le lecteur à méditer profondément la Parole de Dieu et à laisser l'Esprit Saint transformer son cœur. Comme l'enseigne {{verse:0}}, le Pasteur ADAM Aboudaminou y développe avec rigueur les vérités bibliques essentielles pour la vie chrétienne authentique.

La révélation parfaite de Jésus-Christ y est exposée pas à pas — voir notamment {{verse:1}} — afin que chaque enfant de Dieu marche dans la pureté et la pleine connaissance de la gloire de l'Éternel.

Que la grâce du Seigneur Jésus-Christ vous accompagne tout au long de cette lecture. Amen.`;

// Résumé bref + mots clés expliqués (dictionnaire biblique simplifié)
const SUMMARY_BY_BOOK: Record<string, { summary: string; keywords: { word: string; def: string }[] }> = {
  "la-croix": {
    summary: "La Croix est le centre du plan rédempteur : par elle, Christ a porté nos péchés et réconcilié l'homme avec Dieu.",
    keywords: [
      { word: "Croix", def: "Instrument du supplice romain devenu, en Christ, le lieu du salut et de la victoire sur le péché." },
      { word: "Rédemption", def: "Rachat de l'homme par le sang de Jésus-Christ (Éphésiens 1:7)." },
      { word: "Grâce", def: "Faveur imméritée de Dieu accordée au pécheur repentant." },
    ],
  },
  "mysteres-de-la-croix": {
    summary: "Au-delà du sacrifice visible, la Croix renferme des mystères : triomphe sur les puissances, abolition de la Loi de condamnation.",
    keywords: [
      { word: "Mystère", def: "Vérité spirituelle révélée par l'Esprit (1 Corinthiens 2:7)." },
      { word: "Principautés", def: "Puissances spirituelles vaincues à la Croix (Colossiens 2:15)." },
    ],
  },
  "reconcilier-avec-dieu": {
    summary: "Appel pressant à se réconcilier avec Dieu par la foi en Jésus-Christ, seul Médiateur.",
    keywords: [
      { word: "Réconciliation", def: "Rétablissement de la communion entre Dieu et l'homme par Christ." },
      { word: "Ambassadeur", def: "Représentant officiel — le croyant porte le message de la réconciliation." },
    ],
  },
  "reconcilier-simplifier": {
    summary: "Version accessible du message : Dieu vous aime, Christ est mort pour vous, revenez à Lui aujourd'hui.",
    keywords: [
      { word: "Repentance", def: "Changement de cœur et de direction, retour vers Dieu." },
    ],
  },
  "sela-hammachlehoth": {
    summary: "Méditation prophétique autour de la pause (Sela) : s'arrêter pour considérer l'œuvre de Dieu.",
    keywords: [
      { word: "Sela", def: "Pause musicale et méditative dans les Psaumes — invitation à réfléchir." },
    ],
  },
  "musulman-disciple": {
    summary: "Manuel pratique pour annoncer Christ aux musulmans avec amour, respect et fidélité à l'Écriture.",
    keywords: [
      { word: "Disciple", def: "Apprenant de Jésus qui suit son enseignement et l'obéit." },
      { word: "Évangile", def: "Bonne nouvelle du salut en Jésus-Christ." },
    ],
  },
  "discoplat": {
    summary: "Approche du discipulat appliquée à la vie quotidienne du croyant.",
    keywords: [
      { word: "Discipulat", def: "Processus de formation spirituelle pour devenir semblable à Christ." },
    ],
  },
};

function BibliothequePage() {
  const [openBook, setOpenBook] = useState<(typeof BOOKS)[number] | null>(null);
  const [chapter, setChapter] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [openKw, setOpenKw] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Charger la position de lecture sauvegardée
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setProgress(JSON.parse(localStorage.getItem("mcsf_book_progress") ?? "{}")); } catch {}
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  // Sauvegarder à chaque changement de chapitre
  useEffect(() => {
    if (!openBook || typeof window === "undefined") return;
    setProgress((p) => {
      const next = { ...p, [openBook.id]: chapter };
      try { localStorage.setItem("mcsf_book_progress", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [openBook, chapter]);

  const openBookAt = (b: (typeof BOOKS)[number]) => {
    const saved = progress[b.id] ?? 1;
    setOpenBook(b);
    setChapter(Math.min(Math.max(1, saved), b.chapters));
  };

  const stopSpeak = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };

  const speak = () => {
    if (!openBook || typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    const text = chapterText(openBook.title, chapter);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    utterRef.current = u;
    window.speechSynthesis?.speak(u);
    setSpeaking(true);
  };

  const downloadPDF = () => {
    if (!openBook) return;
    const w = window.open("", "_blank");
    if (!w) return;
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${openBook.title}</title>
      <style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:0 24px;line-height:1.7;color:#222}
      h1{font-size:28px;margin-bottom:4px}h2{margin-top:32px;color:#444;border-bottom:1px solid #ddd;padding-bottom:6px}
      p{text-align:justify}</style></head><body>
      <h1>${openBook.title}</h1><p><em>${openBook.author}</em></p>
      ${Array.from({ length: openBook.chapters }, (_, i) => `<h2>Chapitre ${i+1}</h2><p>${chapterText(openBook.title, i+1).replace(/\n/g, "</p><p>")}</p>`).join("")}
      <script>window.onload=()=>window.print()</script>
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  const verses = openBook ? (VERSES_BY_BOOK[openBook.id] ?? []) : [];

  return (
    <Layout>
      <PageBanner
        title="Bibliothèque MCSF"
        subtitle="Les œuvres du Pasteur ADAM Aboudaminou — à lire à votre rythme, écouter en audio ou télécharger en PDF."
        image="hero2"
        icon={<Library className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {BOOKS.map((b) => (
            <article key={b.id} className="group flex flex-col overflow-hidden rounded-none border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <img src={b.cover} alt={b.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-white/90">{b.chapters} chapitres</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-3">
                <h2 className="font-display text-sm font-bold leading-tight text-foreground line-clamp-2">{b.title}</h2>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1">{b.author}</p>
                <div className="mt-auto flex gap-1 pt-3">
                  <button
                    onClick={() => openBookAt(b)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-none bg-flame px-2 py-1.5 text-[11px] font-semibold text-flame-foreground hover:opacity-90"
                  >
                    <BookOpen className="h-3 w-3" /> {progress[b.id] && progress[b.id] > 1 ? `Reprendre ch.${progress[b.id]}` : "Lire"}
                  </button>
                  <button
                    onClick={() => { setOpenBook(b); setTimeout(downloadPDF, 50); }}
                    className="inline-flex items-center justify-center rounded-none border border-border bg-background px-2 py-1.5 text-[11px] font-semibold hover:bg-accent"
                    title="Télécharger PDF"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {openBook && (
        <div
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/85 md:items-center md:p-4"
          onClick={() => { stopSpeak(); setOpenBook(null); setOpenKw({}); setFeedbackOpen(false); }}
        >
          <div
            className="relative flex h-full w-full flex-col bg-card shadow-elegant md:h-[94vh] md:max-h-[94vh] md:max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-border p-3 md:p-4">
              <div className="flex items-center gap-3 min-w-0">
                <img src={openBook.cover} alt="" className="h-12 w-12 rounded object-cover" />
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-semibold text-foreground md:text-lg">{openBook.title}</h3>
                  <p className="text-xs text-muted-foreground">Chapitre {chapter} / {openBook.chapters} • Lecture sauvegardée</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={speaking ? stopSpeak : speak} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                  {speaking ? <Pause className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{speaking ? "Pause" : "Écouter"}</span>
                </button>
                <button onClick={downloadPDF} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <Download className="h-3.5 w-3.5" /><span className="hidden sm:inline">PDF</span>
                </button>
                <button onClick={() => { stopSpeak(); setOpenBook(null); setOpenKw({}); setFeedbackOpen(false); }} className="rounded-full p-2 hover:bg-accent"><X className="h-5 w-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-7">
              <h4 className="mb-4 font-display text-2xl font-semibold text-foreground">Chapitre {chapter}</h4>
              <div className="whitespace-pre-line leading-relaxed text-foreground/90">
                {chapterText(openBook.title, chapter).split(/(\{\{verse:\d+\}\})/g).map((part, idx) => {
                  const m = part.match(/\{\{verse:(\d+)\}\}/);
                  if (m) {
                    const v = verses[Number(m[1])];
                    if (!v) return null;
                    return (
                      <Popover key={idx}>
                        <PopoverTrigger asChild>
                          <button className="mx-0.5 inline-flex items-center gap-1 rounded-sm bg-flame/10 px-1.5 py-0.5 align-baseline text-sm font-bold text-flame underline decoration-dotted underline-offset-2 hover:bg-flame/20">
                            <Quote className="h-3 w-3" />{v.ref}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="start" className="w-80 rounded-none border-l-4 border-flame p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-flame">{v.ref}</p>
                          <p className="mt-2 text-sm leading-relaxed text-foreground">{v.text}</p>
                        </PopoverContent>
                      </Popover>
                    );
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </div>

              {verses.length > 0 && (
                <div className="mt-6 border-l-4 border-flame bg-accent/40 p-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-flame">Versets clés — cliquez pour lire en aperçu</p>
                  <ul className="space-y-2">
                    {verses.map((v) => (
                      <li key={v.ref}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="group inline-flex items-start gap-2 text-left text-sm hover:text-primary">
                              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-flame" />
                              <span><span className="font-bold text-flame">{v.ref}</span> — <span className="underline-offset-2 group-hover:underline">{v.text.slice(0, 80)}…</span></span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent side="top" align="start" className="w-80 rounded-none border-l-4 border-flame p-4">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-flame">{v.ref}</p>
                            <p className="mt-2 text-sm leading-relaxed text-foreground">{v.text}</p>
                          </PopoverContent>
                        </Popover>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {SUMMARY_BY_BOOK[openBook.id] && (
                <div className="mt-8 space-y-5 border-t border-border pt-6">
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-primary">Résumé du chapitre</p>
                    <p className="text-sm leading-relaxed text-foreground/90">{SUMMARY_BY_BOOK[openBook.id].summary}</p>
                  </div>
                  <div>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary">Mots clés — dictionnaire biblique</p>
                    <p className="mb-3 text-xs text-muted-foreground">Cliquez sur un mot pour ouvrir ou fermer sa définition.</p>
                    <div className="flex flex-wrap gap-2">
                      {SUMMARY_BY_BOOK[openBook.id].keywords.map((k) => (
                        <a
                          key={k.word}
                          href={`#kw-${k.word}`}
                          onClick={(e) => { e.preventDefault(); setOpenKw((s) => ({ ...s, [k.word]: true })); document.getElementById(`kw-${k.word}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}
                          className="rounded-none border border-flame bg-flame/10 px-3 py-1 text-xs font-semibold text-flame hover:bg-flame hover:text-flame-foreground"
                        >
                          {k.word}
                        </a>
                      ))}
                    </div>
                    <dl className="mt-4 space-y-2">
                      {SUMMARY_BY_BOOK[openBook.id].keywords.map((k) => {
                        const open = !!openKw[k.word];
                        return (
                          <div key={k.word} id={`kw-${k.word}`} className="rounded-none border border-border bg-card">
                            <button
                              onClick={() => setOpenKw((s) => ({ ...s, [k.word]: !s[k.word] }))}
                              aria-expanded={open}
                              className="flex w-full items-center justify-between gap-2 p-3 text-left"
                            >
                              <dt className="font-display text-sm font-bold text-flame">{k.word}</dt>
                              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                            </button>
                            {open && <dd className="border-t border-border p-3 text-sm text-foreground/80">{k.def}</dd>}
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              )}
              {chapter === openBook.chapters && (
                <div className="mt-8 rounded-lg border-2 border-flame/40 bg-flame/5 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-flame" />
                    <div className="flex-1">
                      <h4 className="font-display text-lg font-bold text-foreground">Vous avez terminé ce livre 🎉</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Partagez avec l'auteur ce que vous avez retenu, ou posez-lui une question. C'est optionnel mais cela l'aide beaucoup.
                      </p>
                      <button
                        onClick={() => setFeedbackOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-flame-foreground hover:opacity-90"
                      >
                        <MessageCircle className="h-4 w-4" /> Écrire un résumé ou poser une question
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <div className="flex items-center justify-between border-t border-border p-3">
              <button
                disabled={chapter === 1}
                onClick={() => { stopSpeak(); setChapter((c) => Math.max(1, c - 1)); }}
                className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2 text-sm disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Précédent
              </button>
              <span className="hidden text-xs text-muted-foreground sm:block">Lecture à votre rythme — reprise automatique</span>
              {chapter === openBook.chapters ? (
                <button
                  onClick={() => setFeedbackOpen(true)}
                  className="inline-flex items-center gap-1 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-flame-foreground hover:opacity-90"
                >
                  Terminer <CheckCircle2 className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => { stopSpeak(); setChapter((c) => Math.min(openBook.chapters, c + 1)); }}
                  className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Suivant <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {feedbackOpen && (
            <FeedbackDialog
              bookId={openBook.id}
              bookTitle={openBook.title}
              onClose={() => setFeedbackOpen(false)}
            />
          )}
        </div>
      )}
    </Layout>
  );
}

function FeedbackDialog({ bookId, bookTitle, onClose }: { bookId: string; bookTitle: string; onClose: () => void }) {
  const [kind, setKind] = useState<"summary" | "question">("summary");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (message.trim().length < 5) {
      toast.error("Veuillez écrire au moins 5 caractères.");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("reader_feedback").insert({
      book_id: bookId,
      book_title: bookTitle,
      kind,
      message: message.trim(),
      user_name: name.trim() || null,
      user_email: email.trim() || null,
    });
    setSending(false);
    if (error) {
      toast.error("Envoi impossible. Réessayez.");
      return;
    }
    toast.success("Merci ! Votre message a été envoyé à l'auteur.");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Partager avec l'auteur</h3>
            <p className="text-xs text-muted-foreground">{bookTitle}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="mb-3 inline-flex rounded-full border border-border p-1">
          <button
            onClick={() => setKind("summary")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${kind === "summary" ? "bg-flame text-flame-foreground" : "text-muted-foreground"}`}
          >
            Résumé
          </button>
          <button
            onClick={() => setKind("question")}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${kind === "question" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            Question
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 4000))}
          rows={6}
          placeholder={kind === "summary" ? "Ce que j'ai retenu de ce livre…" : "Ma question à l'auteur…"}
          className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        />
        <p className="mt-1 text-right text-[10px] text-muted-foreground">{message.length}/4000</p>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 160))}
            placeholder="Votre nom (optionnel)"
            className="rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-primary"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value.slice(0, 255))}
            placeholder="Votre email (optionnel)"
            className="rounded-lg border border-border bg-background p-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">Annuler</button>
          <button
            onClick={submit}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-flame px-5 py-2 text-sm font-semibold text-flame-foreground disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {sending ? "Envoi…" : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}


