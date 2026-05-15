import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion / Inscription — MCSF" }] }),
  component: () => <ComingSoon title="Mon compte" description="Inscription et connexion sécurisées (à activer avec Lovable Cloud en phase 3)." />,
});
