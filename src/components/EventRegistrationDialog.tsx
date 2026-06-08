import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Loader2, Check, ArrowLeft } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  church: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export function EventRegistrationDialog({
  event,
  onClose,
  onSuccess,
}: {
  event: { id: string; title: string; cover: string; date: string; location: string };
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", city: "", church: "", message: "" });

  // Fermer avec Escape + support du bouton retour navigateur
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    // Push une entrée d'historique pour intercepter le bouton retour
    try { window.history.pushState({ mcsfDialog: true }, ""); } catch {}
    const onPop = () => onClose();
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Données invalides");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      event_title: event.title,
      ...parsed.data,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    onSuccess();
    setTimeout(onClose, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="relative max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-card shadow-elegant sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {/* En-tête image */}
        <div className="relative h-40 w-full overflow-hidden sm:h-56">
          <img src={event.cover} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <button onClick={onClose} className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-black/60" aria-label="Retour">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour
          </button>
          <button onClick={onClose} className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/60" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white">
            <span className="inline-block rounded-full bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Inscription</span>
            <h2 className="mt-2 font-display text-xl font-bold sm:text-2xl">{event.title}</h2>
            <p className="text-xs text-white/85">{new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} • {event.location}</p>
          </div>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">Inscription confirmée !</h3>
            <p className="mt-2 text-sm text-muted-foreground">Merci, nous vous contacterons prochainement. Que le Seigneur vous bénisse.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 p-6">
            <p className="text-xs text-muted-foreground">Les champs marqués d'un * sont obligatoires.</p>
            <Row label="Nom complet *">
              <input required maxLength={120} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input-base" />
            </Row>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row label="Email *">
                <input required type="email" maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-base" />
              </Row>
              <Row label="Téléphone (WhatsApp)">
                <input type="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-base" />
              </Row>
              <Row label="Ville">
                <input maxLength={120} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-base" />
              </Row>
              <Row label="Église / Communauté">
                <input maxLength={160} value={form.church} onChange={(e) => setForm({ ...form, church: e.target.value })} className="input-base" />
              </Row>
            </div>
            <Row label="Message / Demande de prière">
              <textarea rows={3} maxLength={1000} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="input-base resize-none" />
            </Row>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={onClose} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent">Annuler</button>
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-flame px-6 py-2.5 text-sm font-semibold text-flame-foreground hover:opacity-90 disabled:opacity-60">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Valider mon inscription
              </button>
            </div>
          </form>
        )}
      </div>
      <style>{`.input-base{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:0.5rem;padding:0.6rem 0.75rem;font-size:0.875rem}.input-base:focus{outline:none;border-color:hsl(var(--primary));box-shadow:0 0 0 3px color-mix(in oklab,hsl(var(--primary)) 18%,transparent)}`}</style>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
