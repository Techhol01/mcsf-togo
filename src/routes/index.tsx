import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { DesktopHeaderSlider } from "@/components/DesktopHeaderSlider";
import { DailyThought } from "@/components/DailyThought";
import { ServicesGrid } from "@/components/ServicesGrid";
import { LibraryCarousel } from "@/components/LibraryCarousel";
import { RecentArticles } from "@/components/RecentArticles";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { StatsSection } from "@/components/StatsSection";
import { NewsletterPopup } from "@/components/NewsletterPopup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MCSF — Mission Christ Sans Frontière" },
      { name: "description", content: "Site officiel de la Mission Christ Sans Frontière (MCSF) du Pasteur ADAM Aboudaminou. Enseignements, podcasts, livres, Bible et événements." },
      { property: "og:title", content: "MCSF — Mission Christ Sans Frontière" },
      { property: "og:description", content: "Une mission chrétienne consacrée à la prédication de l'Évangile et à la révélation parfaite." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      <DesktopHeaderSlider />
      <DailyThought />
      <ServicesGrid />
      <LibraryCarousel />
      <RecentArticles />
      <StatsSection />
      <UpcomingEvents />
      <NewsletterPopup />
    </Layout>
  );
}
