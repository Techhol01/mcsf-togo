import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { VIDEOS } from "@/lib/content";
import { Play, Share2, ThumbsUp, Video as VideoIcon, Check } from "lucide-react";
import { VideoComments } from "@/components/VideoComments";

export const Route = createFileRoute("/enseignement")({
  head: () => ({
    meta: [
      { title: "Enseignements vidéo — MCSF" },
      { name: "description", content: "Enseignements et prédications du Pasteur ADAM Aboudaminou en vidéo." },
    ],
  }),
  component: EnseignementPage,
});

const LS_KEY = "mcsf_video_likes_v2";

// Baseline like-count déterministe par vidéo (différent pour chaque vidéo)
function baseLikes(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 850 + (h % 4200);
}

function EnseignementPage() {
  const [active, setActive] = useState(VIDEOS[0]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setLiked(JSON.parse(localStorage.getItem(LS_KEY) ?? "{}")); } catch {}
  }, []);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const count = (id: string) => baseLikes(id) + (liked[id] ? 1 : 0);

  const selectVideo = (v: (typeof VIDEOS)[number]) => {
    setActive(v);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const share = async (title: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
        await (navigator as Navigator).share({ title, text: title, url });
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(`${title} — ${url}`);
      }
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <Layout>
      <PageBanner
        title="Vidéos & prédications"
        subtitle="Plongez dans la Parole avec les enseignements du Pasteur ADAM Aboudaminou."
        image="hero1"
        icon={<VideoIcon className="h-7 w-7 text-flame" />}
      />

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="overflow-hidden rounded-none border border-border bg-card shadow-soft">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                key={active.id}
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1&fs=1&playsinline=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            <div className="p-5">
              <h2 className="font-display text-xl font-semibold text-foreground">{active.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pasteur ADAM Aboudaminou</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleLike(active.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${liked[active.id] ? "border-flame bg-flame/10 text-flame" : "border-border bg-background hover:bg-accent"}`}
                >
                  <ThumbsUp className={`h-4 w-4 ${liked[active.id] ? "fill-flame" : ""}`} />
                  J'aime · {count(active.id).toLocaleString("fr-FR")}
                </button>
                <button onClick={() => share(active.title)} className="inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-sm font-medium text-flame-foreground hover:opacity-90">
                  {shared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {shared ? "Lien copié" : "Partager"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Vidéos similaires</h3>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {VIDEOS.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVideo(v)}
                className={`group flex w-full flex-col gap-2 overflow-hidden rounded-none border p-0 text-left transition hover:shadow-elegant lg:flex-row lg:items-center lg:p-2 ${active.id === v.id ? "border-primary bg-accent" : "border-border bg-card"}`}
              >
                <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-muted lg:h-16 lg:w-28">
                  <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt={v.title} className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-primary-foreground opacity-0 transition group-hover:opacity-100">
                    <Play className="h-6 w-6" />
                  </span>
                </div>
                <div className="px-2 pb-2 lg:p-0">
                  <span className="line-clamp-2 text-sm font-medium text-foreground">{v.title}</span>
                  <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" /> {count(v.id).toLocaleString("fr-FR")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </Layout>
  );
}
