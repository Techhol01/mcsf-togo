import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { PODCASTS } from "@/lib/content";
import { Play, Pause, Download, Radio, Volume2, VolumeX, Video, X } from "lucide-react";
import pastorImg from "@/assets/hero-2.jpg";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "Podcast — MCSF" },
      { name: "description", content: "Émissions audio à télécharger et à écouter — MCSF." },
    ],
  }),
  component: PodcastPage,
});

const DEMO_AUDIO = "https://cdn.pixabay.com/audio/2022/10/30/audio_347ce3a17a.mp3";

// Liste enrichie façon Kanguka — chaque émission a date / heure / type
type Item = { id: string; title: string; date: string; time: string; type: "audio" | "video"; duration: string };

const ITEMS: Item[] = [
  { id: "k-sa-06", title: "Kanguka de Samedi le 06/06/2026", date: "6 juin 2026", time: "07:00", type: "audio", duration: "32:14" },
  { id: "f-05",    title: "Vidéo Flash : L'ange de Dieu intervient quand tu changes …", date: "5 juin 2026", time: "09:00", type: "video", duration: "08:20" },
  { id: "k-ve-05", title: "Kanguka de Vendredi le 05/06/2026", date: "5 juin 2026", time: "04:00", type: "audio", duration: "31:08" },
  { id: "k-je-04", title: "Kanguka de Jeudi le 04/06/2026", date: "4 juin 2026", time: "04:00", type: "audio", duration: "29:45" },
  { id: "f-03",    title: "Vidéo Flash : Dis à la montagne combien ton Dieu …", date: "3 juin 2026", time: "09:00", type: "video", duration: "07:55" },
  { id: "k-me-03", title: "Kanguka de Mercredi le 03/06/2026", date: "3 juin 2026", time: "04:00", type: "audio", duration: "30:22" },
  { id: "k-ma-02", title: "Kanguka de Mardi le 02/06/2026", date: "2 juin 2026", time: "04:00", type: "audio", duration: "28:48" },
  { id: "k-lu-01", title: "Kanguka de Lundi le 01/06/2026", date: "1 juin 2026", time: "04:00", type: "audio", duration: "33:01" },
  ...PODCASTS.map((p, i) => ({ id: p.id, title: p.title, date: `émission ${i + 1}`, time: "—", type: "audio" as const, duration: p.duration })),
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
      // Lance le téléchargement puis débloque la lecture
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
        title="Émissions"
        subtitle="Écoutez et téléchargez les enseignements du Pasteur ADAM."
        image="hero3"
        icon={<Radio className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-6 pb-32">
        <div className="rounded-2xl border border-border bg-card shadow-soft">
          <ul className="divide-y divide-border">
            {ITEMS.map((it) => {
              const dl = !!downloaded[it.id];
              const isPlaying = playingId === it.id;
              const isVideo = it.type === "video";
              return (
                <li key={it.id} className="flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-4">
                  {/* Thumbnail */}
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-16">
                    <img src={pastorImg} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>

                  {/* Title / Meta */}
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-[15px]">{it.title}</h3>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {it.date} • {it.time}
                      {dl && <span className="ml-2 font-semibold text-primary">• Téléchargé</span>}
                    </p>
                  </div>

                  {/* Action button */}
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
                        : isVideo
                          ? <Video className="h-5 w-5" />
                          : <Download className="h-5 w-5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ===== Lecteur sticky en bas (visible pendant lecture) ===== */}
      {playingItem && (
        <div className="fixed inset-x-0 bottom-16 z-40 border-t border-border bg-card/95 px-3 py-3 shadow-elegant backdrop-blur md:bottom-0">
          <div className="container-page flex items-center gap-3">
            <img src={pastorImg} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />
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
