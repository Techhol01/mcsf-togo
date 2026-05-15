import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({ meta: [{ title: "Bibliothèque — MCSF" }, { name: "description", content: "Livres du Pasteur ADAM Aboudaminou : La Croix, Les Mystères de la Croix, et plus." }] }),
  component: () => <ComingSoon title="Bibliothèque" description="Lecture en ligne par chapitre des livres du Pasteur ADAM Aboudaminou." />,
});
