import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Mail, Lock, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion / Inscription — MCSF" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/admin", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });
        if (error) throw error;
        toast.success("Compte créé. Vérifiez votre email si la confirmation est activée.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connecté");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/admin" });
    if (result.error) toast.error(result.error.message ?? "Erreur Google");
    setLoading(false);
  };

  return (
    <Layout>
      <section className="container-page py-12">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="grid grid-cols-2">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-3 text-sm font-semibold transition ${mode === m ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3 p-6">
            {mode === "signup" && (
              <Field icon={UserIcon} type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <Field icon={Mail} type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field icon={Lock} type="password" placeholder="Mot de passe (min. 6)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-flame py-2.5 font-semibold text-flame-foreground hover:opacity-90 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>

            <div className="relative my-2 text-center text-[11px] text-muted-foreground">
              <span className="relative z-10 bg-card px-2">ou</span>
              <div className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
            </div>

            <button type="button" onClick={google} disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background py-2.5 text-sm font-semibold hover:bg-accent">
              <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13.5 24 13.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 7.3 29.1 5.5 24 5.5 16.3 5.5 9.7 9.8 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13-5l-6-5.1c-1.9 1.4-4.4 2.3-7 2.3-5.3 0-9.7-3.1-11.3-7.4l-6.6 5.1C9.5 39.2 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6 5.1c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.4-.3-3.5z"/></svg>
              Continuer avec Google
            </button>

            <p className="pt-2 text-center text-[11px] text-muted-foreground">
              Admin : connectez-vous avec <strong>admin@mcsf.org</strong>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Field({ icon: Icon, ...props }: { icon: typeof Mail } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input {...props} required className="w-full bg-transparent text-sm outline-none" />
    </label>
  );
}
