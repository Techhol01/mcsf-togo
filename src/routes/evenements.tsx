import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { EVENTS } from "@/lib/content";
import { Calendar, MapPin, Check, CalendarDays } from "lucide-react";
import { EventRegistrationDialog } from "@/components/EventRegistrationDialog";

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
  const [openEvent, setOpenEvent] = useState<typeof EVENTS[number] | null>(null);
  const visible = EVENTS.filter((e) => e.status === filter);
  const [featured, ...rest] = visible;

  return (
    <Layout>
      <PageBanner
        title="Événements MCSF"
        subtitle="VUPJ, conférences jeunesse et campagnes d'évangélisation."
        image="hero3"
        icon={<CalendarDays className="h-7 w-7 text-flame" />}
      />

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

        {featured && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Featured (image) */}
            <article className="group relative block aspect-[4/3] overflow-hidden rounded-none border border-border shadow-soft transition hover:-translate-y-1 hover:shadow-elegant md:aspect-auto md:min-h-[320px]">
              <img src={featured.cover} alt={featured.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="inline-block rounded-none bg-flame px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-flame-foreground shadow-flame">
                  {filter === "upcoming" ? "À venir" : "Passé"}
                </span>
                <h2 className="mt-3 font-display text-xl font-bold leading-tight md:text-2xl">{featured.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-white/85">{featured.description}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/85">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(featured.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{featured.location}</span>
                </div>
                {featured.status === "upcoming" && (
                  <button
                    onClick={() => setOpenEvent(featured)}
                    disabled={registered.has(featured.id)}
                    className={`mt-4 inline-flex items-center gap-2 rounded-none px-5 py-2 text-sm font-semibold transition ${registered.has(featured.id) ? "bg-emerald-600 text-white" : "bg-flame text-flame-foreground hover:opacity-90"}`}
                  >
                    {registered.has(featured.id) ? <><Check className="h-4 w-4" /> Inscrit</> : "S'inscrire"}
                  </button>
                )}
              </div>
            </article>

            {/* Stacked list (imbriqués) */}
            <div className="flex flex-col gap-4">
              {rest.map((e) => (
                <article key={e.id} className="group flex gap-3 overflow-hidden rounded-none border border-border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-elegant">
                  <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-muted sm:w-40">
                    <img src={e.cover} alt={e.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <span className="w-fit rounded-none bg-flame/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-flame">
                      {filter === "upcoming" ? "À venir" : "Passé"}
                    </span>
                    <h3 className="mt-1.5 font-display text-base font-bold leading-tight text-foreground group-hover:text-primary line-clamp-2">{e.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.description}</p>
                    <div className="mt-auto flex flex-wrap gap-3 pt-2 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(e.date).toLocaleDateString("fr-FR")}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{e.location}</span>
                    </div>
                    {e.status === "upcoming" && (
                      <button
                        onClick={() => setOpenEvent(e)}
                        disabled={registered.has(e.id)}
                        className={`mt-2 w-fit rounded-none px-3 py-1 text-[11px] font-semibold ${registered.has(e.id) ? "bg-emerald-600 text-white" : "bg-flame text-flame-foreground hover:opacity-90"}`}
                      >
                        {registered.has(e.id) ? "Inscrit" : "S'inscrire"}
                      </button>
                    )}
                  </div>
                </article>
              ))}
              {rest.length === 0 && (
                <div className="rounded-none border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Plus d'événements à afficher pour le moment.
                </div>
              )}
            </div>
          </div>
        )}
        {!featured && (
          <p className="text-sm text-muted-foreground">Aucun événement {filter === "upcoming" ? "à venir" : "passé"} pour le moment.</p>
        )}
      </section>
      {openEvent && (
        <EventRegistrationDialog
          event={openEvent}
          onClose={() => setOpenEvent(null)}
          onSuccess={() => setRegistered((s) => new Set(s).add(openEvent.id))}
        />
      )}
    </Layout>
  );
}
