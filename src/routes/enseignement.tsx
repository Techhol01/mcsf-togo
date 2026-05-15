import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/enseignement")({
  head: () => ({ meta: [{ title: "Enseignement — MCSF" }, { name: "description", content: "Vidéos d'enseignement biblique du Pasteur ADAM Aboudaminou." }] }),
  component: () => <ComingSoon title="Enseignement" description="Vidéos d'enseignement biblique avec lecteur intégré, like, partage et téléchargement." />,
});
