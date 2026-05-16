import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { HandHeart, MessageCircle, Plus, Send } from "lucide-react";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Forum de prière — MCSF" },
      { name: "description", content: "Partagez vos requêtes de prière avec la communauté MCSF." },
    ],
  }),
  component: ForumPage,
});

type Request = {
  id: string;
  author: string;
  title: string;
  body: string;
  prayers: number;
  comments: number;
  date: string;
};

const INITIAL: Request[] = [
  { id: "1", author: "Sœur Esther", title: "Prière pour ma famille", body: "Que le Seigneur ramène mes parents à Christ et qu'il fortifie notre foyer.", prayers: 42, comments: 6, date: "il y a 2 h" },
  { id: "2", author: "Frère Daniel", title: "Recherche d'emploi", body: "Je sollicite vos prières pour un travail honorable au Togo. Merci.", prayers: 28, comments: 3, date: "hier" },
  { id: "3", author: "Sœur Marie", title: "Guérison", body: "Le Seigneur a touché mon corps après vos prières. Gloire à Lui !", prayers: 91, comments: 14, date: "il y a 3 jours" },
];

function ForumPage() {
  const [list, setList] = useState<Request[]>(INITIAL);
  const [prayed, setPrayed] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ author: "", title: "", body: "" });

  const togglePray = (id: string) => {
    setList((l) => l.map((r) => r.id === id ? { ...r, prayers: r.prayers + (prayed.has(id) ? -1 : 1) } : r));
    setPrayed((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) return;
    setList((l) => [{
      id: String(Date.now()),
      author: draft.author || "Anonyme",
      title: draft.title,
      body: draft.body,
      prayers: 0,
      comments: 0,
      date: "à l'instant",
    }, ...l]);
    setDraft({ author: "", title: "", body: "" });
    setOpen(false);
  };

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Forum de prière</h1>
            <p className="mt-2 text-primary-foreground/85">Partagez vos requêtes et intercédez les uns pour les autres.</p>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-flame px-5 py-2.5 font-semibold text-flame-foreground shadow-soft hover:opacity-90">
            <Plus className="h-4 w-4" /> Nouvelle requête
          </button>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="space-y-4">
          {list.map((r) => (
            <article key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{r.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.author} · {r.date}</p>
                </div>
              </div>
              <p className="mt-3 text-foreground/90">{r.body}</p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => togglePray(r.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${prayed.has(r.id) ? "bg-flame text-flame-foreground" : "bg-accent text-foreground hover:bg-flame/10"}`}
                >
                  <HandHeart className="h-4 w-4" /> {prayed.has(r.id) ? "J'ai prié" : "Je prie"} ({r.prayers})
                </button>
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" /> {r.comments} commentaires
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg space-y-3 rounded-2xl bg-card p-6 shadow-elegant">
            <h3 className="font-display text-xl font-semibold text-foreground">Partager une requête</h3>
            <input value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} placeholder="Votre nom (facultatif)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Titre" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <textarea value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} placeholder="Votre requête..." required rows={5} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-sm">Annuler</button>
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-flame-foreground"><Send className="h-4 w-4" /> Publier</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}
