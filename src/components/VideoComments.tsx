import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, ThumbsUp, CornerDownRight, Trash2 } from "lucide-react";

type Reply = { id: string; author: string; text: string; date: number; likes: number };
type Comment = { id: string; author: string; text: string; date: number; likes: number; replies: Reply[] };

const LS_PREFIX = "mcsf_video_comments_v1:";
const LS_LIKES = "mcsf_video_comment_likes_v1";
const LS_AUTHOR = "mcsf_comment_author";

// Seed demo comments so the section feels alive
const SEED: Record<string, Comment[]> = {
  default: [
    {
      id: "s1",
      author: "Grâce A.",
      text: "Amen ! Cet enseignement m'a profondément touchée, gloire au Seigneur Jésus-Christ 🙏",
      date: Date.now() - 1000 * 60 * 60 * 26,
      likes: 42,
      replies: [
        { id: "s1r1", author: "Emmanuel K.", text: "Amen ma sœur, que Dieu vous bénisse !", date: Date.now() - 1000 * 60 * 60 * 20, likes: 8 },
      ],
    },
    {
      id: "s2",
      author: "Jean-Paul M.",
      text: "Merci Pasteur ADAM pour la clarté de la Parole. Que le Seigneur continue de vous inspirer.",
      date: Date.now() - 1000 * 60 * 60 * 8,
      likes: 17,
      replies: [],
    },
    {
      id: "s3",
      author: "Miriam T.",
      text: "Je partage cette vidéo à toute ma famille. Réveille-nous Seigneur !",
      date: Date.now() - 1000 * 60 * 45,
      likes: 9,
      replies: [],
    },
  ],
};

function relTime(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "à l'instant";
  const m = Math.floor(s / 60); if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60); if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24); if (d < 30) return `il y a ${d} j`;
  return new Date(ts).toLocaleDateString("fr-FR");
}

function initials(name: string) {
  return name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function VideoComments({ videoId }: { videoId: string }) {
  const key = LS_PREFIX + videoId;
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [sort, setSort] = useState<"top" | "recent">("top");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(key);
      setComments(stored ? JSON.parse(stored) : SEED.default);
    } catch { setComments(SEED.default); }
    try { setLikes(JSON.parse(localStorage.getItem(LS_LIKES) ?? "{}")); } catch {}
    try { setAuthor(localStorage.getItem(LS_AUTHOR) ?? ""); } catch {}
  }, [key]);

  const persist = (next: Comment[]) => {
    setComments(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  const toggleLike = (id: string) => {
    setLikes((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(LS_LIKES, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const likeCount = (base: number, id: string) => base + (likes[id] ? 1 : 0);

  const saveAuthor = (v: string) => {
    setAuthor(v);
    try { localStorage.setItem(LS_AUTHOR, v); } catch {}
  };

  const submit = () => {
    const t = text.trim(); const a = (author.trim() || "Anonyme").slice(0, 40);
    if (!t) return;
    const c: Comment = { id: crypto.randomUUID(), author: a, text: t, date: Date.now(), likes: 0, replies: [] };
    persist([c, ...comments]);
    setText("");
  };

  const submitReply = (parentId: string) => {
    const t = replyText.trim(); const a = (author.trim() || "Anonyme").slice(0, 40);
    if (!t) return;
    const r: Reply = { id: crypto.randomUUID(), author: a, text: t, date: Date.now(), likes: 0 };
    persist(comments.map((c) => c.id === parentId ? { ...c, replies: [...c.replies, r] } : c));
    setReplyText(""); setReplyTo(null);
  };

  const remove = (id: string) => persist(comments.filter((c) => c.id !== id));

  const ordered = useMemo(() => {
    const arr = [...comments];
    if (sort === "top") arr.sort((a, b) => likeCount(b.likes, b.id) - likeCount(a.likes, a.id));
    else arr.sort((a, b) => b.date - a.date);
    return arr;
  }, [comments, sort, likes]);

  const total = comments.reduce((n, c) => n + 1 + c.replies.length, 0);

  return (
    <div className="mt-6 rounded-none border border-border bg-card p-4 shadow-soft md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <MessageCircle className="h-5 w-5 text-flame" /> {total} commentaires
        </h3>
        <div className="inline-flex overflow-hidden rounded-full border border-border text-xs">
          <button onClick={() => setSort("top")} className={`px-3 py-1.5 font-semibold ${sort === "top" ? "bg-flame text-flame-foreground" : "hover:bg-accent"}`}>Populaires</button>
          <button onClick={() => setSort("recent")} className={`px-3 py-1.5 font-semibold ${sort === "recent" ? "bg-flame text-flame-foreground" : "hover:bg-accent"}`}>Récents</button>
        </div>
      </div>

      {/* Composer */}
      <div className="mt-4 flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-flame/15 text-xs font-bold text-flame">
          {initials(author || "Vo")}
        </div>
        <div className="flex-1 space-y-2">
          <input
            value={author}
            onChange={(e) => saveAuthor(e.target.value)}
            placeholder="Votre nom (facultatif)"
            className="w-full rounded-none border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-flame"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ajouter un commentaire édifiant…"
            rows={2}
            className="w-full resize-none rounded-none border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-flame"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setText("")} disabled={!text} className="rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground disabled:opacity-40 hover:bg-accent">Annuler</button>
            <button onClick={submit} disabled={!text.trim()} className="inline-flex items-center gap-1 rounded-full bg-flame px-4 py-1.5 text-xs font-semibold text-flame-foreground hover:opacity-90 disabled:opacity-50">
              <Send className="h-3.5 w-3.5" /> Commenter
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <ul className="mt-6 space-y-5">
        {ordered.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {initials(c.author)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-semibold text-foreground">{c.author}</span>
                <span className="text-[11px] text-muted-foreground">{relTime(c.date)}</span>
              </div>
              <p className="mt-0.5 whitespace-pre-line text-sm text-foreground/90">{c.text}</p>
              <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                <button onClick={() => toggleLike(c.id)} className={`inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-accent ${likes[c.id] ? "text-flame" : ""}`}>
                  <ThumbsUp className={`h-3.5 w-3.5 ${likes[c.id] ? "fill-flame" : ""}`} /> {likeCount(c.likes, c.id)}
                </button>
                <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText(""); }} className="rounded-full px-2 py-1 font-semibold hover:bg-accent">Répondre</button>
                {c.id.length > 10 && (
                  <button onClick={() => remove(c.id)} title="Supprimer" className="ml-auto rounded-full px-2 py-1 hover:bg-accent hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                )}
              </div>

              {replyTo === c.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    autoFocus
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") submitReply(c.id); }}
                    placeholder={`Répondre à ${c.author}…`}
                    className="flex-1 rounded-none border-b border-border bg-transparent px-1 py-1.5 text-sm outline-none focus:border-flame"
                  />
                  <button onClick={() => submitReply(c.id)} disabled={!replyText.trim()} className="rounded-full bg-flame px-3 py-1.5 text-xs font-semibold text-flame-foreground disabled:opacity-50 hover:opacity-90">Envoyer</button>
                </div>
              )}

              {c.replies.length > 0 && (
                <ul className="mt-3 space-y-3 border-l-2 border-border pl-4">
                  {c.replies.map((r) => (
                    <li key={r.id} className="flex gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-foreground">
                        {initials(r.author)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <CornerDownRight className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-semibold text-foreground">{r.author}</span>
                          <span className="text-[10px] text-muted-foreground">{relTime(r.date)}</span>
                        </div>
                        <p className="mt-0.5 whitespace-pre-line text-sm text-foreground/90">{r.text}</p>
                        <button onClick={() => toggleLike(r.id)} className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs hover:bg-accent ${likes[r.id] ? "text-flame" : "text-muted-foreground"}`}>
                          <ThumbsUp className={`h-3 w-3 ${likes[r.id] ? "fill-flame" : ""}`} /> {likeCount(r.likes, r.id)}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
