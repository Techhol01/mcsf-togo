import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { Play, Pause, Download, Radio, Volume2, VolumeX, X } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import imgCroix from "@/assets/book-croix.jpg";
import imgMys from "@/assets/book-mysteres.jpg";
import imgRec from "@/assets/book-reconcilier.jpg";
import imgArm from "@/assets/article-armageddon.jpg";
import imgRev from "@/assets/article-revelation.jpg";
import imgEsp from "@/assets/article-esperance.jpg";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "Podcast — MCSF" },
      { name: "description", content: "Messages audio du Pasteur ADAM Aboudaminou — à télécharger et écouter." },
    ],
  }),
  component: PodcastPage,
});

const DEMO_AUDIO = "https://cdn.pixabay.com/audio/2022/10/30/audio_347ce3a17a.mp3";

type Item = { id: string; title: string; date: string; time: string; duration: string; image: string };

// Émissions audio du Pasteur ADAM Aboudaminou uniquement
const ITEMS: Item[] = [
  { id: "pa-01", title: "La grâce qui sauve — Pasteur ADAM", date: "6 juin 2026", time: "07:00", duration: "32:14", image: imgCroix },
  { id: "pa-02", title: "La prière du juste — méditation", date: "5 juin 2026", time: "04:00", duration: "18:42", image: imgEsp },
  { id: "pa-03", title: "Vivre par l'Esprit — enseignement", date: "4 juin 2026", time: "04:00", duration: "45:09", image: imgMys },
  { id: "pa-04", title: "Le Berger fidèle — méditation", date: "3 juin 2026", time: "04:00", duration: "21:30", image: imgRec },
  { id: "pa-05", title: "L'Armageddon expliqué — Pasteur ADAM", date: "2 juin 2026", time: "07:00", duration: "38:55", image: imgArm },
  { id: "pa-06", title: "Préparer son cœur pour le retour de Christ", date: "1 juin 2026", time: "07:00", duration: "29:12", image: hero1 },
  { id: "pa-07", title: "La Révélation parfaite — étude", date: "30 mai 2026", time: "07:00", duration: "41:08", image: imgRev },
  { id: "pa-08", title: "Soyez réconciliés avec Dieu", date: "28 mai 2026", time: "07:00", duration: "27:33", image: hero2 },
  { id: "pa-09", title: "Les mystères de la Croix — partie 1", date: "26 mai 2026", time: "07:00", duration: "34:50", image: hero3 },
  { id: "pa-10", title: "Marcher dans la sainteté", date: "24 mai 2026", time: "07:00", duration: "25:18", image: imgEsp },
];

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    try { setDownloaded(JSON.parse(localStorage.getItem("mcsf_podcast_dl") ?? "{}")); } catch {}
  }, []);

  const triggerDownload = async (id: string) => {
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

  const togglePlay = (it: Item) => {
    if (!downloaded[it.id]) {
      triggerDownload(it.id);
      return;
    }
    const a = audioRef.current;
    if (!a) return;
    if (playingId === it.id) {
      a.pause();
      setPlayingId(null);
    } else {
      a.src = DEMO_AUDIO;
      a.volume = volume;
      a.muted = muted;
      a.play().catch(() => {});
      setPlayingId(it.id);
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

  const playingItem = ITEMS.find((i) => i.id === playingId) ?? null;
  const progress = playingItem && duration ? (current / duration) * 100 : 0;

  return (
    <Layout>
      <PageBanner
        title="Émissions audio"
        subtitle="Messages du Pasteur ADAM Aboudaminou — téléchargez puis écoutez à votre rythme."
        image="hero3"
        icon={<Radio className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-6 pb-32">
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {ITEMS.map((it) => {
              const dl = !!downloaded[it.id];
              const isPlaying = playingId === it.id;
              return (
                <li key={it.id} className="flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16">
                    <img src={it.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-[15px]">{it.title}</h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {it.date} • {it.time} • {it.duration}
                      {dl && <span className="ml-2 font-semibold text-primary">• Téléchargé</span>}
                    </p>
                  </div>

                  <button
                    onClick={() => togglePlay(it)}
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
                      isPlaying
                        ? "border-flame bg-flame text-flame-foreground"
                        : dl
                          ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}
                    aria-label={isPlaying ? "Pause" : dl ? "Lire" : "Télécharger"}
                    title={dl ? (isPlaying ? "Pause" : "Lire") : "Télécharger d'abord"}
                  >
                    {isPlaying
                      ? <Pause className="h-5 w-5" />
                      : dl
                        ? <Play className="h-5 w-5 translate-x-0.5" />
                        : <Download className="h-5 w-5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {playingItem && (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 px-3 py-3 shadow-elegant backdrop-blur md:bottom-0">
          <div className="container-page flex items-center gap-3">
            <img src={playingItem.image} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-semibold text-foreground">{playingItem.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[10px] tabular-nums text-muted-foreground">{fmt(current)}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.1}
                  value={progress}
                  onChange={seek}
                  className="h-1 flex-1 accent-flame"
                />
                <span className="text-[10px] tabular-nums text-muted-foreground">{fmt(duration)}</span>
              </div>
            </div>

            <div className="hidden items-center gap-1 sm:flex">
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
                className="w-20 accent-primary"
              />
            </div>

            <button
              onClick={() => togglePlay(playingItem)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-flame text-flame-foreground"
              aria-label="Pause"
            >
              <Pause className="h-5 w-5" />
            </button>
            <button
              onClick={() => { audioRef.current?.pause(); setPlayingId(null); setCurrent(0); }}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Fermer le lecteur"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onEnded={() => { setPlayingId(null); setCurrent(0); }}
        className="hidden"
      />
    </Layout>
  );
}
