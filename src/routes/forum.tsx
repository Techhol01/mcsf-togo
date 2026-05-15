import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/forum")({
  head: () => ({ meta: [{ title: "Forum — MCSF" }, { name: "description", content: "Forum de prière et témoignages de la communauté MCSF." }] }),
  component: () => <ComingSoon title="Forum de prière" description="Partagez vos requêtes de prière et témoignages avec la communauté." />,
});
