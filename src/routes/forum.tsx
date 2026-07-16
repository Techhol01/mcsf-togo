import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Users, Send, Smile, Mic, MicOff, Search, CheckCheck, Plus, Hash, Pin } from "lucide-react";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "Communauté MCSF — Forum" },
      { name: "description", content: "Communauté MCSF style WhatsApp : discutez, priez et partagez dans des groupes thématiques." },
    ],
  }),
  component: ForumPage,
});

type Reaction = "🙏" | "❤️" | "🔥" | "🙌" | "✝️";

type Message = {
  id: string;
  group: string;
  author: string;
  text?: string;
  audioUrl?: string;
  audioDuration?: number;
  time: string;
  me?: boolean;
  reactions?: Partial<Record<Reaction, number>>;
  mineReactions?: Reaction[];
};

type Group = {
  id: string;
  name: string;
  topic: string;
  members: number;
  pinned?: string;
  emoji: string;
};

const GROUPS: Group[] = [
  { id: "g-priere", name: "Prière & Intercession", topic: "Requêtes de prière de la communauté", members: 1284, pinned: "Jeûne mensuel le 1er vendredi.", emoji: "🙏" },
  { id: "g-temoignages", name: "Témoignages", topic: "Ce que Dieu a fait dans nos vies", members: 902, emoji: "✨" },
  { id: "g-questions", name: "Questions bibliques", topic: "Doctrine, eschatologie, vie chrétienne", members: 651, pinned: "Lisez le règlement avant de poster.", emoji: "📖" },
  { id: "g-jeunesse", name: "Jeunesse MCSF", topic: "VUPJ, vie étudiante, vocations", members: 478, emoji: "🔥" },
  { id: "g-evangelisation", name: "Évangélisation", topic: "Stratégies missionnaires et campagnes", members: 312, emoji: "🌍" },
  { id: "g-musulmans", name: "Disciples issus de l'islam", topic: "Accompagnement et discipulat", members: 188, emoji: "🕊️" },
];

const INITIAL_MSGS: Message[] = [
  { id: "m1", group: "g-priere", author: "Sœur Esther", text: "Que le Seigneur ramène mes parents à Christ et fortifie notre foyer 🙏", time: "09:14", reactions: { "🙏": 23, "❤️": 4 } },
  { id: "m2", group: "g-priere", author: "Frère Daniel", text: "Je m'associe à toi sœur. Le Seigneur est fidèle.", time: "09:18", reactions: { "🙌": 5 } },
  { id: "m3", group: "g-temoignages", author: "Sœur Marie", text: "Le Seigneur m'a guérie après les prières de mardi. À Lui seul la gloire !", time: "hier", reactions: { "❤️": 41, "🙌": 18, "✝️": 7 } },
  { id: "m4", group: "g-questions", author: "Frère Jean", text: "Que signifie exactement « Sela » dans les Psaumes ?", time: "08:02" },
  { id: "m5", group: "g-questions", author: "Pasteur ADAM", text: "« Sela » invite à la méditation — voir aussi le livre Sela Hammachlehoth.", time: "08:21", reactions: { "🙏": 12, "🔥": 9 } },
  { id: "m6", group: "g-jeunesse", author: "Jeune Paul", text: "Hâte de la VUPJ 2026 ! Qui s'inscrit déjà ?", time: "07:40", reactions: { "🔥": 22 } },
];

const REACTIONS: Reaction[] = ["🙏", "❤️", "🔥", "🙌", "✝️"];
const LS_KEY = "mcsf_forum_msgs_v1";
const ME = "Vous";

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function ForumPage() {
  const [activeGroup, setActiveGroup] = useState<string>(GROUPS[0].id);
  const [msgs, setMsgs] = useState<Message[]>(INITIAL_MSGS);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setMsgs(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(msgs)); } catch {}
  }, [msgs]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [activeGroup, msgs]);

  const current = GROUPS.find((g) => g.id === activeGroup)!;
  const visibleMsgs = useMemo(() => msgs.filter((m) => m.group === activeGroup), [msgs, activeGroup]);
  const visibleGroups = useMemo(
    () => GROUPS.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()) || g.topic.toLowerCase().includes(filter.toLowerCase())),
    [filter],
  );

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    setMsgs((l) => [...l, {
      id: "u" + Date.now(),
      group: activeGroup,
      author: ME,
      text: draft.trim(),
      time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
      me: true,
    }]);
    setDraft("");
  };

  const react = (id: string, r: Reaction) => {
    setMsgs((l) => l.map((m) => {
      if (m.id !== id) return m;
      const mine = new Set(m.mineReactions ?? []);
      const reactions = { ...(m.reactions ?? {}) };
      if (mine.has(r)) {
        mine.delete(r);
        reactions[r] = Math.max(0, (reactions[r] ?? 1) - 1);
        if (!reactions[r]) delete reactions[r];
      } else {
        mine.add(r);
        reactions[r] = (reactions[r] ?? 0) + 1;
      }
      return { ...m, reactions, mineReactions: Array.from(mine) };
    }));
  };

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const dur = elapsed;
        const now = new Date();
        setMsgs((l) => [...l, {
          id: "v" + Date.now(),
          group: activeGroup,
          author: ME,
          audioUrl: url,
          audioDuration: dur,
          time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          me: true,
        }]);
        stream.getTracks().forEach((t) => t.stop());
        setElapsed(0);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      timerRef.current = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      alert("Microphone non disponible. Autorisez l'accès au micro pour envoyer un message vocal.");
    }
  };

  const stopRec = () => {
    recRef.current?.stop();
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <Layout>
      <section className="bg-gradient-primary py-6 text-primary-foreground">
        <div className="container-page flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Communauté MCSF</h1>
            <p className="mt-1 text-sm text-primary-foreground/85">Groupes thématiques • Style messagerie • Réactions • Messages vocaux</p>
          </div>
          <span className="rounded-full bg-flame/90 px-3 py-1 text-xs font-semibold text-flame-foreground">
            {GROUPS.reduce((s, g) => s + g.members, 0).toLocaleString("fr-FR")} membres
          </span>
        </div>
      </section>

      <section className="container-page py-4">
        <div className="grid h-[calc(100vh-260px)] min-h-[560px] grid-cols-1 overflow-hidden rounded-none border border-border bg-card shadow-elegant md:grid-cols-[300px_1fr]">
          {/* Sidebar groupes */}
          <aside className="hidden flex-col border-r border-border bg-background/50 md:flex">
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Rechercher un groupe…"
                  className="w-full rounded-full border border-border bg-card py-2 pl-8 pr-3 text-xs"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {visibleGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroup(g.id)}
                  className={`flex w-full items-start gap-3 border-b border-border/60 px-3 py-3 text-left transition ${activeGroup === g.id ? "bg-flame/10" : "hover:bg-accent"}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-flame text-lg">
                    {g.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">{g.name}</span>
                      <Users className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">{g.topic}</p>
                    <p className="text-[10px] text-muted-foreground">{g.members.toLocaleString("fr-FR")} membres</p>
                  </div>
                </button>
              ))}
            </div>
            <button className="flex items-center justify-center gap-1 border-t border-border bg-accent/40 py-2 text-xs font-semibold text-primary hover:bg-accent">
              <Plus className="h-3.5 w-3.5" /> Nouveau groupe
            </button>
          </aside>

          {/* Chat */}
          <div className="flex flex-col">
            {/* Sélecteur mobile — chips thématiques */}
            <div className="border-b border-border bg-background/60 p-2 md:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGroup(g.id)}
                    className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${activeGroup === g.id ? "border-flame bg-flame text-flame-foreground shadow-flame" : "border-border bg-card text-foreground hover:bg-accent"}`}
                    title={g.topic}
                  >
                    <span className="mr-1">{g.emoji}</span>{g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* En-tête groupe */}
            <header className="flex items-center gap-3 border-b border-border bg-background/70 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-flame text-lg">
                {current.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" /> {current.name}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">{current.topic} • {current.members.toLocaleString("fr-FR")} membres</p>
              </div>
            </header>

            {/* Message épinglé */}
            {current.pinned && (
              <div className="flex items-center gap-2 border-b border-border bg-flame/5 px-4 py-2 text-xs text-foreground/80">
                <Pin className="h-3.5 w-3.5 text-flame" /> <span className="font-semibold">Épinglé :</span> {current.pinned}
              </div>
            )}

            {/* Fil de messages */}
            <div
              ref={scrollerRef}
              className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,hsl(var(--accent)/0.25),transparent_70%)] px-3 py-4"
            >
              <div className="space-y-3">
                {visibleMsgs.map((m) => (
                  <MessageBubble key={m.id} m={m} onReact={react} />
                ))}
                {visibleMsgs.length === 0 && (
                  <p className="py-8 text-center text-xs text-muted-foreground">Aucun message — soyez le premier à écrire 🙏</p>
                )}
              </div>
            </div>

            {/* Composer */}
            <div className="border-t border-border bg-background/80 p-2">
              {recording ? (
                <div className="flex items-center gap-3 rounded-full bg-red-500/10 px-4 py-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground">Enregistrement… {fmtTime(elapsed)}</span>
                  <button onClick={stopRec} className="rounded-full bg-flame px-4 py-1.5 text-xs font-semibold text-flame-foreground">
                    Envoyer
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-foreground hover:text-foreground" aria-label="Emoji">
                    <Smile className="h-5 w-5" />
                  </button>
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    placeholder={`Écrire dans ${current.name}…`}
                    className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm focus:border-flame focus:outline-none"
                  />
                  {draft.trim() ? (
                    <button onClick={send} className="flex h-10 w-10 items-center justify-center rounded-full bg-flame text-flame-foreground hover:opacity-90" aria-label="Envoyer">
                      <Send className="h-4 w-4" />
                    </button>
                  ) : (
                    <button onClick={startRec} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:opacity-90" aria-label="Message vocal">
                      <Mic className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border border-border bg-card p-2"><div className="font-display text-lg font-bold text-flame">{GROUPS.length}</div><div className="text-muted-foreground">Groupes</div></div>
          <div className="rounded-lg border border-border bg-card p-2"><div className="font-display text-lg font-bold text-flame">{GROUPS.reduce((s, g) => s + g.members, 0).toLocaleString("fr-FR")}</div><div className="text-muted-foreground">Membres</div></div>
          <div className="rounded-lg border border-border bg-card p-2"><div className="font-display text-lg font-bold text-flame">{msgs.length.toLocaleString("fr-FR")}</div><div className="text-muted-foreground">Discussions</div></div>
        </div>
      </section>
    </Layout>
  );
}

function MessageBubble({ m, onReact }: { m: Message; onReact: (id: string, r: Reaction) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className={`flex ${m.me ? "justify-end" : "justify-start"}`}>
      <div className={`group relative max-w-[78%] rounded-2xl px-3 py-2 shadow-soft ${m.me ? "bg-flame text-flame-foreground" : "bg-card border border-border"}`}>
        {!m.me && <div className="mb-0.5 text-[11px] font-bold text-primary">{m.author}</div>}
        {m.text && <p className="whitespace-pre-wrap text-sm leading-snug">{m.text}</p>}
        {m.audioUrl && (
          <div className="flex items-center gap-2">
            <audio controls src={m.audioUrl} className="h-8 max-w-[200px]" />
            {m.audioDuration ? <span className="text-[10px] opacity-80">{fmtTime(m.audioDuration)}</span> : null}
          </div>
        )}
        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-80">
          <span>{m.time}</span>
          {m.me && <CheckCheck className="h-3 w-3" />}
        </div>

        {m.reactions && Object.keys(m.reactions).length > 0 && (
          <div className={`mt-1 flex flex-wrap gap-1 ${m.me ? "justify-end" : ""}`}>
            {Object.entries(m.reactions).map(([r, n]) => (
              <button
                key={r}
                onClick={() => onReact(m.id, r as Reaction)}
                className="rounded-full bg-background/90 px-2 py-0.5 text-[11px] text-foreground shadow-soft hover:scale-105"
              >
                {r} {n}
              </button>
            ))}
          </div>
        )}

        {/* Bouton réaction */}
        <button
          onClick={() => setShowPicker((s) => !s)}
          className={`absolute -top-3 ${m.me ? "-left-3" : "-right-3"} hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-soft group-hover:flex`}
          aria-label="Réagir"
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
        {showPicker && (
          <div className={`absolute z-10 ${m.me ? "-left-2 -top-10" : "-right-2 -top-10"} flex gap-1 rounded-full border border-border bg-background px-2 py-1 shadow-elegant`}>
            {REACTIONS.map((r) => (
              <button
                key={r}
                onClick={() => { onReact(m.id, r); setShowPicker(false); }}
                className="text-base transition hover:scale-125"
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
