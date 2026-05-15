import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/profil")({
  head: () => ({ meta: [{ title: "Mon profil — MCSF" }] }),
  component: () => <ComingSoon title="Mon profil" description="Gérez votre compte, vos notifications et votre confidentialité." />,
});
