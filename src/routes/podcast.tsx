import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/podcast")({
  head: () => ({ meta: [{ title: "Podcast — MCSF" }, { name: "description", content: "Messages audio et émissions radio de la MCSF." }] }),
  component: () => <ComingSoon title="Podcast" description="Messages audio et émissions radio à écouter et télécharger." />,
});
