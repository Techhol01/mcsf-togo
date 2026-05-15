# Reconstruction du site MCSF

Reconstruction du site de la **Mission Christ Sans Frontière** (Pasteur ADAM Aboudaminou, Togo) à partir du brief original récupéré du projet `mcsf`.

## Identité visuelle
- Couleurs : bleu dégradé (fond), rouge flamme (CTA), blanc, noir
- Style moderne, sobre, chaleureux, inspiré d'une app mobile
- Typographie sans-serif élégante, responsive desktop/tablette/mobile
- PWA installable

## Architecture des pages (routes TanStack)

| Route | Contenu |
|---|---|
| `/` | Splash + Header full-width avec mega menu, slider hero, pensée du jour, services (icônes rondes), bibliothèque carousel, articles récents, événements à venir, stats, newsletter pop-up |
| `/blog` | Articles (auteur Pasteur ADAM, thèmes Armageddon/fin du monde) + sidebar widgets, lecteur d'article intégré |
| `/enseignement` | Vidéos YouTube intégrées (8 liens fournis), like/partage/téléchargement, sidebar vidéos similaires |
| `/podcast` | Messages MCSF + émissions radio, lecteur audio simple avec barre de progression, téléchargement |
| `/bibliotheque` | 7 livres du Pasteur ADAM, lecture en ligne par chapitre, plans de lecture, sidebar |
| `/bible` | Lecture par livre/chapitre, audio, favoris, plan de lecture |
| `/forum` | Sujets + requêtes de prière avec bouton "Je prie" et compteur |
| `/evenements` | Événements actuels/passés, VUPJ 2026 (MCSF Notse, Centre Rehoboth), inscription |
| `/profil` | Compte utilisateur avec graphiques, notifications, confidentialité |
| `/auth` | Inscription + connexion |
| `/don` | Page de don |

## Composants partagés
- `SplashScreen` (logo + "Bienvenue", 3s)
- `ModernHeader` sticky : logo MCSF + mega menu desktop, slide horizontal tablette, hamburger mobile, barre de recherche
- `DesktopHeaderSlider` full-width (page d'accueil uniquement)
- `BottomNavigation` mobile (4 onglets)
- `Footer` complet (logo, coordonnées, liens, réseaux, derniers articles)
- `NewsletterPopup`, `DailyThought`, `ShareButtons`, `EmbeddedVideoPlayer`, `AudioPlayer`, `BookReader`, `ArticleReader`

## Détails techniques
- Stack actuel : TanStack Start + React 19 + Tailwind v4
- Routing fichier-based dans `src/routes/`
- Tokens design en `oklch` dans `src/styles.css`
- Données (livres, vidéos, articles, podcasts, événements) en frontend statique pour cette V1
- Auth, dons, forum interactif, profil sauvegardé → nécessitent **Lovable Cloud** (à activer plus tard si souhaité)
- Logo MCSF à générer (le projet original utilisait une image uploadée à laquelle je n'ai pas accès)

## Phases de livraison

Étant donné l'ampleur (~25+ fichiers, 11 routes), je propose de livrer en **3 itérations** plutôt qu'un seul gros message :

1. **Phase 1 — Fondation + Accueil** : design system, header/footer/splash/bottom nav, page d'accueil complète avec tous ses blocs
2. **Phase 2 — Modules contenu** : blog, enseignement (avec les 8 vidéos YouTube), podcast, bibliothèque (7 livres)
3. **Phase 3 — Modules complémentaires** : bible, forum, événements, profil, auth, don, PWA

Pour les fonctionnalités nécessitant un backend (auth réelle, dons, forum partagé, sauvegarde profil), je proposerai d'activer Lovable Cloud à la phase 3.

## Limites connues
- Logo officiel MCSF non disponible → je génère un logo proche (croix + flamme bleu/rouge), à remplacer par votre fichier officiel
- Photos des personnes/événements générées (chrétiens habillés décemment, femmes voilées, conformes au brief)
- Liens vidéos YouTube intégrés tels que fournis dans le brief original
