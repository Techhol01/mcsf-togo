import { useEffect, useState } from "react";
import { X, Mail, Sparkles } from "lucide-react";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("mcsf-newsletter-shown")) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem("mcsf-newsletter-shown", "1");
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-none border border-flame/40 bg-card shadow-flame animate-slide-in">
        <div className="relative bg-gradient-flame p-6 text-flame-foreground">
          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute right-3 top-3 rounded-none p-1 text-white/90 hover:bg-white/15"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-white/15 backdrop-blur">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/90">Newsletter MCSF</p>
              <h3 className="font-display text-xl font-bold leading-tight">Restez connecté à la mission</h3>
            </div>
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Sparkles className="mt-0.5 h-4 w-4 text-flame shrink-0" />
            <p>Recevez chaque semaine les derniers articles, enseignements vidéo, podcasts et annonces d'événements du Pasteur ADAM Aboudaminou.</p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setOpen(false); }}
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="Votre prénom"
              className="w-full rounded-none border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-flame"
            />
            <input
              type="email"
              required
              placeholder="votre@email.com"
              className="w-full rounded-none border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-flame"
            />
            <button
              type="submit"
              className="rounded-none bg-gradient-flame px-4 py-3 text-sm font-bold uppercase tracking-wider text-flame-foreground shadow-flame transition hover:scale-[1.01]"
            >
              S'abonner gratuitement
            </button>
            <p className="text-center text-[10px] text-muted-foreground">
              Aucun spam. Désabonnement en 1 clic.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
