import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { EVENTS } from "@/lib/content";
import { Calendar, MapPin, Check } from "lucide-react";
import eventImg from "@/assets/event-vupj.jpg";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Événements — MCSF" },
      { name: "description", content: "VUPJ 2026, conférences jeunesse et campagnes d'évangélisation." },
    ],
  }),
  component: EvenementsPage,
});

function EvenementsPage() {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const visible = EVENTS.filter((e) => e.status === filter);

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Événements MCSF</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/85">VUPJ, conférences et campagnes d'évangélisation.</p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1">
          {(["upcoming", "past"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              {s === "upcoming" ? "À venir" : "Passés"}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((e) => (
            <article key={e.id} className="overflow-hidden rounded-none border border-border bg-card shadow-soft">
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img src={eventImg} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <h2 className="font-display text-xl font-semibold text-foreground">{e.title}</h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(e.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {e.location}</span>
                </div>
                <p className="mt-3 text-foreground/90">{e.description}</p>
                {e.status === "upcoming" && (
                  <button
                    onClick={() => setRegistered((s) => new Set(s).add(e.id))}
                    disabled={registered.has(e.id)}
                    className={`mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${registered.has(e.id) ? "bg-emerald-600 text-white" : "bg-flame text-flame-foreground hover:opacity-90"}`}
                  >
                    {registered.has(e.id) ? <><Check className="h-4 w-4" /> Inscrit</> : "S'inscrire"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
