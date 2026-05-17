## Refonte MCSF — Phase 3 (logo officiel + améliorations majeures)

### 1. Logo officiel MCSF
- Copier `user-uploads://image.png` → `src/assets/mcsf-logo-official.png`
- Remplacer le logo généré dans `ModernHeader`, `Footer`, `SplashScreen`, `Layout`

### 2. Page d'accueil
- **Bibliothèque (carrousel)** : cartes carrées (`aspect-square`, `rounded-none`), couvertures de livres générées (image par livre)
- **Articles récents** : cartes carrées, bords droits, image de couverture par article
- **Événements à venir** : image en bords droits (`rounded-none`)
- **Header slider** : ajouter sous-titre/citation pro alignée sous chaque slide (Hab 2:14 / Luc 1:78 / verset thématique)

### 3. Navigation mobile
- Menu hamburger → **Sheet latéral** (shadcn `Sheet`) glissant depuis la gauche, avec sous-menus accordéon

### 4. Blog
- Ajouter `cover` (URL image) à chaque article dans `content.ts` (générer 4 images)
- Cartes avec image en haut, bords carrés
- Vue lecture : hero image + contenu long-form rédigé proprement (3–4 articles complets, ton pastoral)

### 5. Enseignement
- Autoplay du premier YouTube à l'arrivée (paramètre `autoplay=1&mute=1`)
- Bouton **Partager** (Web Share + copie lien + WhatsApp/Facebook)
- Retirer le bouton « Voir sur YouTube »

### 6. Podcast
- Lecteur audio complet : play/pause, **seek bar interactive**, temps écoulé/total, volume
- Bouton **Télécharger** affiché en premier (avant écoute)
- Un seul lecteur global, contrôle par épisode

### 7. Bibliothèque (page)
- Grille carrée alignée (`grid` + `aspect-square`, bords droits, espacement uniforme)
- Couverture image par livre
- Modal de lecture amélioré : 
  - Lecture chapitre par chapitre à son rythme (contenu pastoral générique court)
  - **TTS (Web Speech API)** : bouton « Écouter » qui lit le chapitre à voix haute (play/pause/stop)
  - Bouton **Télécharger PDF** (générer un PDF simple avec jsPDF)
  - **Surlignage** : sélection de texte → bouton « Surligner » qui mémorise dans `localStorage`

### 8. Bible
- Survol/clic sur référence (ex. `Jean 3:16`) → **popover miniature** affichant le verset (Louis Segond, base statique des versets clés)
- Surlignage des passages essentiels (sélection texte → couleur, persisté)
- Conserver favoris existants

### 9. Événements
- Image carrée par événement (bord droit), alignement pro grille
- Layout cohérent texte + métadonnées

### 10. Forum (sujets/réponses + notifications + modération + « Je prie » par user)
- Activer **Lovable Cloud** (Supabase) :
  - Tables : `forum_topics`, `forum_replies`, `forum_prayers (user_id, topic_id unique)`, `notifications`
  - RLS : auth requis pour création, lecture publique
- UI : créer sujet, fil de réponses, toggle « Je prie » (1 par utilisateur), flag modération (signaler)
- Cloche notifications dans header (count réponses non lues sur ses sujets)
- Modération simple : auteur peut supprimer son post, admin peut masquer (role `admin` via `has_role`)

### 11. Recherche globale
- Composant `GlobalSearch` (icône loupe dans header → Command palette shadcn `cmdk`)
- Indexe : `ARTICLES`, `VIDEOS`, `BOOKS`, chapitres Bible (66 livres × titres)
- Résultats groupés par catégorie, navigation directe

### 12. Corrections runtime
- Hydration mismatch dans `Footer` (espace blanc autour de `contact@mcsf.org`)

### Détails techniques
- **Cloud requis** uniquement pour Forum (sections 10). Reste = frontend.
- **Images livres/articles** : `imagegen` (fast), aspect 1:1 pour livres, 16:9 pour articles/événements
- **PDF** : `jspdf` (npm)
- **TTS** : `window.speechSynthesis` natif, voix française
- **Recherche** : fuzzy match simple sur titre/excerpt (pas de lib externe)
- **Bords carrés** : `rounded-none` partout sur cartes ciblées (au lieu de `rounded-2xl`)

### Livraison en 3 sous-phases
- **3A** : Logo + accueil (bibliothèque/articles/événements carrés + header texts) + nav mobile sheet + fix hydration
- **3B** : Blog (images+articles longs), Enseignement (autoplay/share), Podcast (lecteur complet), Bibliothèque (TTS+PDF+surlignage+images), Bible (popover versets+surlignage), Événements (images carrées), Recherche globale
- **3C** : Activation Cloud + Forum complet (sujets, réponses, prière par user, notifications, modération)
