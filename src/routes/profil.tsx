import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { User, Bell, Shield, BookOpen, Heart, LogIn } from "lucide-react";

export const Route = createFileRoute("/profil")({
  head: () => ({ meta: [{ title: "Mon profil — MCSF" }] }),
  component: ProfilPage,
});

function ProfilPage() {
  const [tab, setTab] = useState<"overview" | "notifications" | "privacy">("overview");

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-flame text-flame-foreground">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">Mon espace</h1>
              <p className="text-primary-foreground/85">Bienvenue, frère / sœur</p>
            </div>
          </div>
          <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-flame px-5 py-2 text-sm font-semibold text-flame-foreground hover:opacity-90">
            <LogIn className="h-4 w-4" /> Se connecter
          </Link>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 flex flex-wrap gap-2">
          {([["overview", "Aperçu"], ["notifications", "Notifications"], ["privacy", "Confidentialité"]] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === k ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground hover:bg-accent"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Stat icon={BookOpen} label="Chapitres lus" value="24" />
            <Stat icon={Heart} label="Versets favoris" value="12" />
            <Stat icon={User} label="Requêtes priées" value="38" />
          </div>
        )}

        {tab === "notifications" && (
          <div className="space-y-3">
            {[
              "Recevoir un verset chaque matin",
              "Notifier les nouveaux enseignements",
              "Alertes événements MCSF",
              "Newsletter mensuelle",
            ].map((label) => (
              <label key={label} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                <span className="flex items-center gap-2 text-foreground"><Bell className="h-4 w-4 text-primary" /> {label}</span>
                <input type="checkbox" defaultChecked className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted checked:bg-flame" />
              </label>
            ))}
          </div>
        )}

        {tab === "privacy" && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-3">
              <Shield className="mt-1 h-6 w-6 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Confidentialité</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Vos données restent privées. La MCSF ne vend ni ne partage vos informations.
                  Vous pouvez à tout moment demander la suppression de votre compte.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-flame" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
