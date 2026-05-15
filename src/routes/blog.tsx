import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/blog")({
  head: () => ({ meta: [{ title: "Blog — MCSF" }, { name: "description", content: "Articles du Pasteur ADAM Aboudaminou sur la révélation parfaite, l'Armageddon et la fin des temps." }] }),
  component: () => <ComingSoon title="Blog" description="Articles, méditations et révélations du Pasteur ADAM Aboudaminou." />,
});
