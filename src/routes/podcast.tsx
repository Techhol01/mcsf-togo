import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { PODCASTS } from "@/lib/content";
import { Play, Pause, Download, Radio, Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "Podcast — MCSF" },
      { name: "description", content: "Messages audio et émissions radio de la MCSF." },
    ],
  }),
  component: PodcastPage,
});

const DEMO_AUDIO = "https://cdn.pixabay.com/audio/2022/10/30/audio_347ce3a17a.mp3";

function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function PodcastPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persist téléchargements
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setDownloaded(JSON.parse(localStorage.getItem("mcsf_podcast_dl") ?? "{}")); } catch {}
  }, []);

  const markDownloaded = async (id: string) => {
    // Déclenche un vrai téléchargement avant d'autoriser l'écoute
    try {
      const res = await fetch(DEMO_AUDIO);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.mp3`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(DEMO_AUDIO, "_blank");
    }
    setDownloaded((prev) => {
      const next = { ...prev, [id]: true };
      try { localStorage.setItem("mcsf_podcast_dl", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggle = (id: string) => {
    if (!downloaded[id]) return; // Lecture bloquée tant que pas téléchargé
    const a = audioRef.current;
    if (!a) return;
    if (playingId === id) {
      a.pause();
      setPlayingId(null);
    } else {
      a.src = DEMO_AUDIO;
      a.volume = volume;
      a.muted = muted;
      a.play().catch(() => {});
      setPlayingId(id);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const t = (Number(e.target.value) / 100) * duration;
    a.currentTime = t;
    setCurrent(t);
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    setMuted(v === 0);
    if (audioRef.current) {
      audioRef.current.volume = v;
      audioRef.current.muted = v === 0;
    }
  };

  return (
    <Layout>
      <PageBanner
        title="Podcast & Radio MCSF"
        subtitle="Messages audio à télécharger ou écouter en ligne."
        image="hero3"
        icon={<Radio className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {PODCASTS.map((p) => {
            const isPlaying = playingId === p.id;
            const progress = isPlaying && duration ? (current / duration) * 100 : 0;
            return (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">{p.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Durée : {p.duration}</p>
                  </div>
                  <a
                    href={DEMO_AUDIO}
                    download={`${p.id}.mp3`}
                    className="inline-flex items-center gap-2 rounded-full bg-flame px-3 py-2 text-xs font-semibold text-flame-foreground hover:opacity-90"
                    title="Télécharger avant écoute"
                  >
                    <Download className="h-4 w-4" /> Télécharger
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => toggle(p.id)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:opacity-90"
                    aria-label={isPlaying ? "Pause" : "Lire"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={0.1}
                      value={isPlaying ? progress : 0}
                      onChange={seek}
                      disabled={!isPlaying}
                      className="w-full accent-flame"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>{isPlaying ? fmt(current) : "0:00"}</span>
                      <span>{isPlaying ? fmt(duration) : p.duration}</span>
                    </div>
                  </div>
                </div>

                {isPlaying && (
                  <div className="mt-3 flex items-center gap-2">
                    <button onClick={() => changeVolume(muted ? 0.8 : 0)} className="text-muted-foreground hover:text-foreground">
                      {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={(e) => changeVolume(Number(e.target.value))}
                      className="w-32 accent-primary"
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          onEnded={() => {
            setPlayingId(null);
            setCurrent(0);
          }}
          className="hidden"
        />
      </section>
    </Layout>
  );
}
