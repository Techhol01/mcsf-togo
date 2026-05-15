import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/don")({
  head: () => ({ meta: [{ title: "Faire un don — MCSF" }, { name: "description", content: "Soutenez la mission MCSF par un don sécurisé." }] }),
  component: () => <ComingSoon title="Faire un don" description="Soutenez la mission par un don sécurisé (PayPal, Stripe, Mobile Money — phase 3)." />,
});
