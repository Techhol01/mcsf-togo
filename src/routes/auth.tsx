import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion / Inscription — MCSF" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");

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

          <form onSubmit={(e) => { e.preventDefault(); alert("Activez Lovable Cloud pour authentification réelle."); }} className="space-y-3 p-6">
            {mode === "signup" && (
              <Field icon={User} type="text" placeholder="Nom complet" />
            )}
            <Field icon={Mail} type="email" placeholder="Adresse e-mail" />
            <Field icon={Lock} type="password" placeholder="Mot de passe" />

            <button type="submit" className="w-full rounded-full bg-flame py-2.5 font-semibold text-flame-foreground hover:opacity-90">
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {mode === "login" ? "Mot de passe oublié ?" : "En créant un compte, vous acceptez nos conditions."}
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
