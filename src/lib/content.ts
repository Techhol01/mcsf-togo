// Static content for MCSF — Pasteur ADAM Aboudaminou
import bookCroix from "@/assets/book-croix.jpg";
import bookMysteres from "@/assets/book-mysteres.jpg";
import bookReconcilier from "@/assets/book-reconcilier.jpg";
import articleArmageddon from "@/assets/article-armageddon.jpg";
import articleRevelation from "@/assets/article-revelation.jpg";
import articleEsperance from "@/assets/article-esperance.jpg";
import eventVupj from "@/assets/event-vupj.jpg";
import eventConference from "@/assets/event-conference.jpg";

export const BOOKS = [
  { id: "la-croix", title: "La Croix", author: "Pasteur ADAM Aboudaminou", chapters: 12, cover: bookCroix },
  { id: "mysteres-de-la-croix", title: "Les Mystères de la Croix", author: "Pasteur ADAM Aboudaminou", chapters: 10, cover: bookMysteres },
  { id: "reconcilier-avec-dieu", title: "Soyez réconcilié avec Dieu", author: "Pasteur ADAM Aboudaminou", chapters: 8, cover: bookReconcilier },
  { id: "reconcilier-simplifier", title: "Soyez réconcilié avec Dieu (version simplifiée)", author: "Pasteur ADAM Aboudaminou", chapters: 6, cover: bookReconcilier },
  { id: "sela-hammachlehoth", title: "Sela Hammachlehoth", author: "Pasteur ADAM Aboudaminou", chapters: 9, cover: bookMysteres },
  { id: "musulman-disciple", title: "Comment faire d'un musulman un disciple de Jésus-Christ", author: "Pasteur ADAM Aboudaminou", chapters: 11, cover: bookCroix },
  { id: "discoplat", title: "Le Discoplat", author: "Pasteur ADAM Aboudaminou", chapters: 7, cover: bookReconcilier },
];

export const VIDEOS = [
  { id: "3C4VtEp6rHo", title: "Message de la MCSF — Partie 1", duration: "—" },
  { id: "upux5bRVXqE", title: "Message de la MCSF — Partie 2", duration: "—" },
  { id: "HYgtrzPolRY", title: "Enseignement biblique", duration: "—" },
  { id: "jRWuwP4P1Go", title: "Prédication du Pasteur ADAM", duration: "—" },
  { id: "TP2EaSJhlzE", title: "Révélation parfaite", duration: "—" },
  { id: "txtnjse3MY4", title: "L'appel à la repentance", duration: "—" },
  { id: "qHjkAeoUfTs", title: "Les temps de la fin", duration: "—" },
  { id: "TNABCGKYZ3U", title: "Marcher avec Christ", duration: "—" },
];

export const ARTICLES = [
  {
    id: "armageddon",
    title: "L'Armageddon : ce que dit l'Écriture",
    excerpt: "Une analyse biblique de la grande bataille finale annoncée dans l'Apocalypse.",
    author: "Pasteur ADAM Aboudaminou",
    date: "2025-09-30",
    category: "Prophétie",
    cover: articleArmageddon,
  },
  {
    id: "ils-crieront",
    title: "Ils crieront — Apocalypse 6",
    excerpt: "Le cri des âmes sous l'autel et le jour de la colère de l'Agneau.",
    author: "Pasteur ADAM Aboudaminou",
    date: "2025-09-22",
    category: "Révélation",
    cover: articleRevelation,
  },
  {
    id: "fin-du-monde",
    title: "La fin du monde n'est pas la fin de l'histoire",
    excerpt: "Comprendre l'espérance chrétienne face à l'imminence du retour de Christ.",
    author: "Pasteur ADAM Aboudaminou",
    date: "2025-09-10",
    category: "Eschatologie",
    cover: articleEsperance,
  },
  {
    id: "preparer-coeur",
    title: "Préparer son cœur pour le retour de Christ",
    excerpt: "Marcher dans la sainteté à l'approche du jour du Seigneur.",
    author: "Pasteur ADAM Aboudaminou",
    date: "2025-08-28",
    category: "Vie chrétienne",
    cover: articleEsperance,
  },
];

export const PODCASTS = [
  { id: "p1", title: "Émission radio — La grâce qui sauve", duration: "32:14" },
  { id: "p2", title: "Méditation — La prière du juste", duration: "18:42" },
  { id: "p3", title: "Émission radio — Vivre par l'Esprit", duration: "45:09" },
  { id: "p4", title: "Méditation — Le Berger fidèle", duration: "21:30" },
];

export const EVENTS = [
  {
    id: "vupj-2026",
    title: "VUPJ 2026 — Vacances Utiles Pour la Jeunesse",
    date: "2026-08-10",
    location: "MCSF Notse — Centre Rehoboth",
    status: "upcoming" as const,
    description: "Une conférence puissante pour la jeunesse chrétienne, avec enseignements, prière et communion fraternelle.",
    cover: eventVupj,
  },
  {
    id: "conf-jeunesse",
    title: "Conférence Jeunesse Annuelle",
    date: "2026-04-12",
    location: "MCSF Notse",
    status: "upcoming" as const,
    description: "Trois jours de réveil spirituel pour la nouvelle génération.",
    cover: eventConference,
  },
  {
    id: "campagne-2025",
    title: "Campagne d'évangélisation — Été 2025",
    date: "2025-07-20",
    location: "Lomé, Togo",
    status: "past" as const,
    description: "Campagne missionnaire avec plus de 500 décisions pour Christ.",
    cover: eventConference,
  },
];

export const STATS = [
  { value: "12+", label: "Années de mission" },
  { value: "8", label: "Livres publiés" },
  { value: "50+", label: "Enseignements vidéo" },
  { value: "1000+", label: "Vies impactées" },
];
