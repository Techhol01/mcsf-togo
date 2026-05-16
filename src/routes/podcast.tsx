import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { PODCASTS } from "@/lib/content";
import { Play, Pause, Download, Radio } from "lucide-react";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "Podcast — MCSF" },
      { name: "description", content: "Messages audio et émissions radio de la MCSF." },
    ],
  }),
  component: PodcastPage,
});

// Free CC0 sample audio for demo playback
const DEMO_AUDIO = "https://cdn.pixabay.com/audio/2022/10/30/audio_347ce3a17a.mp3";

function PodcastPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = (id: string) => {
    if (!audioRef.current) return;
    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = DEMO_AUDIO;
      audioRef.current.play().catch(() => {});
      setPlayingId(id);
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page flex items-center gap-3">
          <Radio className="h-7 w-7 text-flame" />
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Podcast & Radio MCSF</h1>
            <p className="mt-1 text-primary-foreground/85">Messages audio et émissions à écouter ou télécharger.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {PODCASTS.map((p) => {
            const isPlaying = playingId === p.id;
            return (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">{p.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Durée : {p.duration}</p>
                  </div>
                  <button
                    onClick={() => toggle(p.id)}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-flame text-flame-foreground shadow-soft hover:opacity-90"
                    aria-label={isPlaying ? "Pause" : "Lire"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                  </button>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: isPlaying ? `${progress}%` : "0%" }}
                  />
                </div>
                <div className="mt-3">
                  <a
                    href={DEMO_AUDIO}
                    download
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    <Download className="h-4 w-4" /> Télécharger
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            if (a.duration) setProgress((a.currentTime / a.duration) * 100);
          }}
          onEnded={() => {
            setPlayingId(null);
            setProgress(0);
          }}
          className="hidden"
        />
      </section>
    </Layout>
  );
}
