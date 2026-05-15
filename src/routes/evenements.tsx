import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/evenements")({
  head: () => ({ meta: [{ title: "Événements — MCSF" }, { name: "description", content: "VUPJ 2026, conférences jeunesse et campagnes d'évangélisation." }] }),
  component: () => <ComingSoon title="Événements" description="Découvrez et inscrivez-vous aux événements à venir de la MCSF." />,
});
