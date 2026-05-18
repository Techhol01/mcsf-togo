import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { VIDEOS } from "@/lib/content";
import { Play, Share2, ThumbsUp } from "lucide-react";

export const Route = createFileRoute("/enseignement")({
  head: () => ({
    meta: [
      { title: "Enseignements vidéo — MCSF" },
      { name: "description", content: "Enseignements et prédications du Pasteur ADAM Aboudaminou en vidéo." },
    ],
  }),
  component: EnseignementPage,
});

function EnseignementPage() {
  const [active, setActive] = useState(VIDEOS[0]);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const like = (id: string) => setLikes((l) => ({ ...l, [id]: (l[id] ?? 0) + 1 }));
  const share = async (title: string) => {
    if (navigator.share) await navigator.share({ title, url: window.location.href }).catch(() => {});
    else navigator.clipboard?.writeText(window.location.href);
  };

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">Enseignements</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Vidéos & prédications</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">
            Plongez dans la Parole avec les enseignements du Pasteur ADAM Aboudaminou.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="aspect-video w-full bg-black">
              <iframe
                key={active.id}
                src={`https://www.youtube.com/embed/${active.id}?autoplay=1&mute=1&rel=0`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-semibold text-foreground">{active.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pasteur ADAM Aboudaminou</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => like(active.id)} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
                  <ThumbsUp className="h-4 w-4" /> J'aime {likes[active.id] ? `(${likes[active.id]})` : ""}
                </button>
                <button onClick={() => share(active.title)} className="inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-sm font-medium text-flame-foreground hover:opacity-90">
                  <Share2 className="h-4 w-4" /> Partager
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Vidéos similaires</h3>
          <div className="space-y-3">
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => setActive(v)}
                className={`group flex w-full items-center gap-3 rounded-xl border p-2 text-left transition hover:bg-accent ${active.id === v.id ? "border-primary bg-accent" : "border-border bg-card"}`}
              >
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-primary-foreground opacity-0 transition group-hover:opacity-100">
                    <Play className="h-6 w-6" />
                  </span>
                </div>
                <span className="line-clamp-2 text-sm font-medium text-foreground">{v.title}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </Layout>
  );
}
