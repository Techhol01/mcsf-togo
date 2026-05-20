import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { ARTICLES } from "@/lib/content";
import { Calendar, User, Tag, ArrowLeft, Share2, Newspaper } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — MCSF" },
      { name: "description", content: "Articles du Pasteur ADAM Aboudaminou sur l'Armageddon, la fin du monde et la vie chrétienne." },
    ],
  }),
  component: BlogPage,
});

const CATEGORIES = ["Tous", "Prophétie", "Révélation", "Eschatologie", "Vie chrétienne"];

function BlogPage() {
  const [cat, setCat] = useState("Tous");
  const [active, setActive] = useState<(typeof ARTICLES)[number] | null>(null);
  const list = cat === "Tous" ? ARTICLES : ARTICLES.filter((a) => a.category === cat);

  if (active) {
    return (
      <Layout>
        <article className="container-page max-w-3xl py-10">
          <button onClick={() => setActive(null)} className="mb-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Retour aux articles
          </button>
          <div className="overflow-hidden rounded-2xl">
            <img src={active.cover} alt={active.title} className="aspect-[16/9] w-full object-cover" />
          </div>
          <span className="mt-6 inline-block rounded-full bg-flame/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-flame">{active.category}</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">{active.title}</h1>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><User className="h-4 w-4" /> {active.author}</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(active.date).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="prose-mcsf mt-6 space-y-4 leading-relaxed text-foreground/90">
            <p className="text-lg font-medium">{active.excerpt}</p>
            <p>L'Écriture sainte nous invite à la vigilance et à la persévérance. Le Pasteur ADAM Aboudaminou,
              à travers cet enseignement, nous rappelle que les temps que nous vivons appellent à un retour
              sincère vers Dieu et à une marche fidèle dans la foi.</p>
            <p>« Veillez donc, car vous ne savez pas quel jour votre Seigneur viendra » (Matthieu 24:42).
              Cette parole résonne avec une acuité particulière à l'approche des événements eschatologiques
              annoncés dans la Parole.</p>
            <p>Que le Seigneur Jésus-Christ affermisse nos cœurs et nous garde irréprochables jusqu'à son
              avènement glorieux. Amen.</p>
          </div>
          <button
            onClick={() => navigator.share?.({ title: active.title, url: window.location.href }).catch(() => {})}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-flame px-5 py-2 text-sm font-semibold text-flame-foreground hover:opacity-90"
          >
            <Share2 className="h-4 w-4" /> Partager
          </button>
        </article>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageBanner
        title="Blog MCSF"
        subtitle="Articles d'enseignement et de prophétie biblique."
        image="hero1"
        icon={<Newspaper className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition ${cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-accent"}`}
            >
              <Tag className="h-3 w-3" /> {c}
            </button>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <article key={a.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-elegant">
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img src={a.cover} alt={a.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-foreground shadow-flame">{a.category}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-display text-lg font-bold text-foreground group-hover:text-primary line-clamp-2">{a.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {a.author}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(a.date).toLocaleDateString("fr-FR")}</span>
                </div>
                <button onClick={() => setActive(a)} className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-primary hover:underline">
                  Lire l'article →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
