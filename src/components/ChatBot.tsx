import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Msg = { from: "bot" | "user"; text: string };

const QUICK = [
  "Comment lire la Bible ?",
  "Faire un don",
  "Voir les enseignements",
  "Prochains événements",
  "Contact MCSF",
];

function reply(input: string): string {
  const t = input.toLowerCase();
  if (/(bonjour|salut|hello|bsr|bonsoir)/.test(t)) return "Bonjour et soyez le bienvenu sur MCSF ! Comment puis-je vous aider ?";
  if (/(don|donner|offrande|soutien)/.test(t)) return "Vous pouvez soutenir l'œuvre via la page Don : /don. Merci pour votre cœur généreux.";
  if (/(bible|verset|lire|lecture)/.test(t)) return "Rendez-vous dans la rubrique Bible pour lire Louis Segond, marquer vos favoris et voir les versets en aperçu.";
  if (/(livre|biblioth)/.test(t)) return "La Bibliothèque propose les livres du Pasteur ADAM : lecture en ligne, audio (TTS) ou téléchargement PDF.";
  if (/(enseignement|video|vidéo|prédication)/.test(t)) return "Tous les enseignements vidéo sont disponibles dans la rubrique Enseignement, avec lecture automatique et partage.";
  if (/(podcast|audio|emission|émission)/.test(t)) return "Le Podcast contient les émissions et méditations, avec lecteur, volume, seek et téléchargement.";
  if (/(événement|evenement|conférence|conference|vupj)/.test(t)) return "Les prochains événements (dont VUPJ 2026) sont sur la page Événements.";
  if (/(contact|adresse|téléphone|telephone|email)/.test(t)) return "Contactez-nous via l'email présent dans le pied de page, ou rendez-vous à MCSF Notse — Centre Rehoboth.";
  if (/(forum|question|prier|prière)/.test(t)) return "Le Forum permet d'échanger, poser des questions et marquer 'Je prie' pour soutenir les sujets.";
  if (/(merci|amen|gloire)/.test(t)) return "Amen ! Que la grâce du Seigneur Jésus-Christ soit avec vous.";
  return "Merci pour votre message. Un membre de l'équipe MCSF vous répondra dès que possible. En attendant, explorez la Bible, les Enseignements ou la Bibliothèque.";
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Shalom ! Je suis l'assistant MCSF. Posez votre question ou choisissez un sujet ci-dessous." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", text: reply(t) }]), 450);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ouvrir le chat"
        className="fixed bottom-20 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-flame text-flame-foreground shadow-flame transition hover:scale-105 md:bottom-6"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="fixed bottom-36 right-4 z-40 flex h-[70vh] max-h-[560px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elegant md:bottom-24">
          <div className="bg-gradient-primary p-4 text-primary-foreground">
            <p className="font-display text-base font-bold">Assistant MCSF</p>
            <p className="text-xs text-primary-foreground/80">Réponses automatiques 24/7</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border bg-card p-2">
            <div className="mb-2 flex flex-wrap gap-1">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] hover:bg-accent">
                  {q}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrire un message…"
                className="flex-1 rounded-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button type="submit" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-flame text-flame-foreground hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
