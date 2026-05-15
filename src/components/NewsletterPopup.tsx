import { useEffect, useState } from "react";
import { X, Mail } from "lucide-react";

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
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-card p-6 shadow-flame animate-slide-in">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fermer"
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-flame text-flame-foreground shadow-flame">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-center font-display text-xl font-bold">Restez connecté à la mission</h3>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Recevez les derniers articles, podcasts et événements de la MCSF par email.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); setOpen(false); }}
          className="mt-5 flex flex-col gap-2"
        >
          <input
            type="email"
            required
            placeholder="votre@email.com"
            className="w-full rounded-full border border-border bg-secondary/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-flame px-4 py-2.5 text-sm font-semibold text-flame-foreground shadow-flame transition hover:scale-[1.02]"
          >
            S'abonner à la newsletter
          </button>
        </form>
      </div>
    </div>
  );
}
