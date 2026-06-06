export const NAV_ITEMS = [
  { to: "/", label: "Accueil" },
  { to: "/blog", label: "Blog" },
  { to: "/enseignement", label: "Enseignement" },
  { to: "/podcast", label: "Podcast" },
  { to: "/bibliotheque", label: "Bibliothèque" },
  { to: "/bible", label: "Bible" },
  { to: "/dictionnaire", label: "Dictionnaire" },
  { to: "/forum", label: "Forum" },
  { to: "/evenements", label: "Événements" },
] as const;

export const MEGA_MENU = [
  {
    label: "Médias",
    items: [
      { to: "/enseignement", label: "Enseignements vidéo", desc: "Messages du Pasteur ADAM" },
      { to: "/podcast", label: "Podcasts & Radio", desc: "Émissions audio à écouter" },
      { to: "/blog", label: "Blog", desc: "Articles sur la fin des temps" },
    ],
  },
  {
    label: "Spirituel",
    items: [
      { to: "/bible", label: "La Bible", desc: "Lire, écouter, plans de lecture" },
      { to: "/bibliotheque", label: "Bibliothèque", desc: "Livres du Pasteur ADAM" },
      { to: "/dictionnaire", label: "Dictionnaire biblique", desc: "Mots & explications bibliques" },
      { to: "/forum", label: "Forum communautaire", desc: "Discussions & prière" },
    ],
  },
  {
    label: "Communauté",
    items: [
      { to: "/evenements", label: "Événements", desc: "VUPJ 2026 & autres" },
      { to: "/don", label: "Faire un don", desc: "Soutenir la mission" },
      { to: "/auth", label: "Mon compte", desc: "Inscription & connexion" },
    ],
  },
] as const;
