import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { Scale } from "lucide-react";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — MCSF" },
      { name: "description", content: "Mentions légales et conditions d'utilisation du site Mission Christ Sans Frontière." },
    ],
  }),
  component: MentionsPage,
});

function MentionsPage() {
  return (
    <Layout>
      <PageBanner title="Mentions légales" subtitle="Informations légales du site MCSF" image="hero2" icon={<Scale className="h-7 w-7 text-flame" />} />
      <article className="container-page prose prose-sm md:prose-base max-w-3xl py-10 text-foreground">
        <h2 className="font-display text-xl font-bold">1. Éditeur du site</h2>
        <p>Le présent site est édité par <strong>Mission Christ Sans Frontière (MCSF)</strong>, œuvre missionnaire dirigée par le Pasteur ADAM Aboudaminou, située au Centre Rehoboth, Notse, Togo.</p>

        <h2 className="mt-6 font-display text-xl font-bold">2. Hébergement</h2>
        <p>Le site est hébergé sur une infrastructure cloud sécurisée, accessible 24h/24 sur l'ensemble du territoire.</p>

        <h2 className="mt-6 font-display text-xl font-bold">3. Propriété intellectuelle</h2>
        <p>L'ensemble des contenus (textes, images, vidéos, podcasts, livres) présents sur ce site est la propriété exclusive de la MCSF, sauf mention contraire. Toute reproduction ou diffusion sans autorisation préalable est interdite.</p>

        <h2 className="mt-6 font-display text-xl font-bold">4. Données personnelles</h2>
        <p>Les informations recueillies via les formulaires d'inscription aux événements sont uniquement utilisées dans le cadre de l'organisation des événements MCSF. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à <strong>contact@mcsf.org</strong>.</p>

        <h2 className="mt-6 font-display text-xl font-bold">5. Cookies</h2>
        <p>Ce site utilise uniquement des cookies techniques nécessaires à son fonctionnement (session, préférences). Aucun cookie de pistage publicitaire n'est déployé.</p>

        <h2 className="mt-6 font-display text-xl font-bold">6. Contact</h2>
        <p>Pour toute question : <strong>contact@mcsf.org</strong> — +228 00 00 00 00</p>

        <p className="mt-8 text-xs text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>
      </article>
    </Layout>
  );
}
