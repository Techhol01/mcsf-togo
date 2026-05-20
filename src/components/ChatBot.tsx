import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, Send, ExternalLink } from "lucide-react";

type Msg = { from: "bot" | "user"; node: ReactNode };

const QUICK = [
  "Lire la Bible",
  "Voir les livres",
  "Enseignements vidéo",
  "Podcast",
  "Événements",
  "Faire un don",
];

function LinkBtn({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mt-1 inline-flex items-center gap-1 rounded-none border border-flame bg-flame/10 px-3 py-1 text-[11px] font-semibold text-flame hover:bg-flame hover:text-flame-foreground"
    >
      {label} <ExternalLink className="h-3 w-3" />
    </Link>
  );
}

function reply(input: string): ReactNode {
  const t = input.toLowerCase();
  if (/(bonjour|salut|hello|bsr|bonsoir|shalom)/.test(t))
    return <>Shalom ! Bienvenue sur MCSF. Que puis-je faire pour vous aujourd'hui ?</>;
  if (/(don|donner|offrande|soutien|soutenir|aide)/.test(t))
    return (
      <>
        Vous pouvez soutenir l'œuvre du Pasteur ADAM en quelques clics.
        <div className="mt-1"><LinkBtn to="/don" label="Faire un don" /></div>
      </>
    );
  if (/(bible|verset|écriture|ecriture|segond)/.test(t))
    return (
      <>
        Lisez la Bible Louis Segond, cliquez sur un verset pour l'aperçu, double-cliquez pour le surligner.
        <div className="mt-1"><LinkBtn to="/bible" label="Ouvrir la Bible" /></div>
      </>
    );
  if (/(livre|biblioth|lire|lecture|pdf)/.test(t))
    return (
      <>
        La Bibliothèque réunit tous les livres du Pasteur ADAM : lecture en ligne, audio ou téléchargement PDF.
        <div className="mt-1"><LinkBtn to="/bibliotheque" label="Voir la bibliothèque" /></div>
      </>
    );
  if (/(enseignement|video|vidéo|prédication|youtube)/.test(t))
    return (
      <>
        Tous les enseignements vidéo en lecture automatique, avec partage en un clic.
        <div className="mt-1"><LinkBtn to="/enseignement" label="Voir les enseignements" /></div>
      </>
    );
  if (/(podcast|audio|emission|émission|écouter|ecouter)/.test(t))
    return (
      <>
        Le Podcast MCSF avec lecteur avancé, volume, seek et téléchargement direct.
        <div className="mt-1"><LinkBtn to="/podcast" label="Écouter le podcast" /></div>
      </>
    );
  if (/(événement|evenement|conférence|conference|vupj|jeunesse|inscription)/.test(t))
    return (
      <>
        Les prochains événements MCSF — VUPJ 2026, conférences jeunesse, campagnes.
        <div className="mt-1"><LinkBtn to="/evenements" label="Voir les événements" /></div>
      </>
    );
  if (/(blog|article|méditation|meditation)/.test(t))
    return (
      <>
        Les articles et méditations du Pasteur ADAM, classés par catégorie.
        <div className="mt-1"><LinkBtn to="/blog" label="Lire le blog" /></div>
      </>
    );
  if (/(forum|question|prier|prière|priere)/.test(t))
    return (
      <>
        Le Forum permet de poser des questions, partager des sujets de prière et marquer « Je prie ».
        <div className="mt-1"><LinkBtn to="/forum" label="Ouvrir le forum" /></div>
      </>
    );
  if (/(contact|adresse|téléphone|telephone|email|où|ou|notse)/.test(t))
    return <>Centre Rehoboth — MCSF Notse, Togo. Contactez-nous via les coordonnées du pied de page.</>;
  if (/(compte|connexion|connecter|profil|inscription|login)/.test(t))
    return (
      <>
        Connectez-vous ou créez un compte pour accéder à votre profil et au forum.
        <div className="mt-1 flex flex-wrap gap-2"><LinkBtn to="/auth" label="Se connecter" /><LinkBtn to="/profil" label="Mon profil" /></div>
      </>
    );
  if (/(merci|amen|gloire|alléluia|alleluia)/.test(t))
    return <>Amen ! Que la grâce du Seigneur Jésus-Christ soit avec vous.</>;
  return (
    <>
      Merci pour votre message. Voici quelques pistes utiles :
      <div className="mt-2 flex flex-wrap gap-1">
        <LinkBtn to="/bible" label="Bible" />
        <LinkBtn to="/bibliotheque" label="Livres" />
        <LinkBtn to="/enseignement" label="Vidéos" />
        <LinkBtn to="/podcast" label="Podcast" />
      </div>
    </>
  );
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", node: <>Shalom ! Je suis l'assistant MCSF. Posez votre question ou choisissez un sujet.</> },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", node: t }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { from: "bot", node: reply(t) }]), 400);
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
            <p className="text-xs text-primary-foreground/80">Réponses automatiques avec liens directs</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-background p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
                  {m.node}
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
