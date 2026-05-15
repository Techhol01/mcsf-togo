import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/ComingSoon";

export const Route = createFileRoute("/bible")({
  head: () => ({ meta: [{ title: "Bible — MCSF" }, { name: "description", content: "Lire et écouter la Bible, plans de lecture et favoris." }] }),
  component: () => <ComingSoon title="Bible" description="Lecture, audio, plans de lecture et versets favoris." />,
});
