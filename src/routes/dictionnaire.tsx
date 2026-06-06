import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { PageBanner } from "@/components/PageBanner";
import { BookMarked, Search } from "lucide-react";

export const Route = createFileRoute("/dictionnaire")({
  head: () => ({
    meta: [
      { title: "Dictionnaire biblique — MCSF" },
      { name: "description", content: "Dictionnaire biblique : recherchez la définition et l'explication de mots-clés bibliques." },
      { property: "og:title", content: "Dictionnaire biblique — MCSF" },
      { property: "og:description", content: "Recherchez mots, noms propres et concepts bibliques avec explications détaillées." },
    ],
  }),
  component: DictionnairePage,
});

type Entry = {
  word: string;
  category: "Personnage" | "Lieu" | "Concept" | "Objet" | "Doctrine";
  short: string;
  detail: string;
  refs: string[];
};

const ENTRIES: Entry[] = [
  { word: "Abba", category: "Concept", short: "« Père » en araméen, terme d'intimité.", detail: "Mot araméen employé par Jésus pour s'adresser au Père, exprimant une relation filiale d'intimité absolue. Paul réutilise ce terme pour décrire l'adoption des croyants par l'Esprit.", refs: ["Marc 14:36", "Romains 8:15", "Galates 4:6"] },
  { word: "Abraham", category: "Personnage", short: "Père des croyants, patriarche de la foi.", detail: "Appelé par Dieu à quitter Ur des Chaldéens, Abraham reçoit l'alliance et la promesse d'une descendance innombrable. Il est le modèle de la foi qui justifie.", refs: ["Genèse 12:1-3", "Genèse 15:6", "Romains 4"] },
  { word: "Adam", category: "Personnage", short: "Premier homme créé par Dieu.", detail: "Formé de la poussière de la terre et animé du souffle de Dieu, Adam représente l'humanité tombée. Le second Adam, Christ, restaure ce qu'Adam a perdu.", refs: ["Genèse 2:7", "Romains 5:12-21", "1 Corinthiens 15:45"] },
  { word: "Agneau de Dieu", category: "Doctrine", short: "Titre messianique de Jésus-Christ.", detail: "Jean-Baptiste désigne Jésus comme l'Agneau qui ôte le péché du monde, accomplissement de la Pâque et des sacrifices lévitiques.", refs: ["Jean 1:29", "Apocalypse 5:6", "Exode 12"] },
  { word: "Alliance", category: "Doctrine", short: "Engagement solennel entre Dieu et son peuple.", detail: "L'Écriture distingue plusieurs alliances : avec Noé, Abraham, Moïse, David, et l'alliance nouvelle en Christ scellée par son sang.", refs: ["Genèse 9", "Jérémie 31:31", "Luc 22:20"] },
  { word: "Amen", category: "Concept", short: "« Cela est vrai, qu'il en soit ainsi ».", detail: "Affirmation hébraïque de la vérité et de la fidélité de Dieu. Christ lui-même est appelé l'Amen.", refs: ["Deutéronome 27:15", "2 Corinthiens 1:20", "Apocalypse 3:14"] },
  { word: "Apocalypse", category: "Concept", short: "« Révélation » en grec.", detail: "Dévoilement par Dieu des choses cachées concernant le règne de Christ, le jugement et la fin des temps.", refs: ["Apocalypse 1:1", "Daniel 12", "Matthieu 24"] },
  { word: "Armageddon", category: "Lieu", short: "Plaine du combat final selon Apocalypse 16.", detail: "Mont Megiddo en Israël, lieu symbolique du rassemblement des rois de la terre pour la bataille du grand jour de Dieu.", refs: ["Apocalypse 16:16", "Zacharie 12:11"] },
  { word: "Béthel", category: "Lieu", short: "« Maison de Dieu ».", detail: "Lieu où Jacob vit l'échelle céleste et où Dieu renouvela l'alliance abrahamique.", refs: ["Genèse 28:10-22", "Genèse 35:1-15"] },
  { word: "Christ", category: "Personnage", short: "« Oint » — Messie promis.", detail: "Traduction grecque de « Messie ». Jésus est l'Oint de Dieu, prophète, sacrificateur et roi.", refs: ["Matthieu 16:16", "Actes 10:38"] },
  { word: "Croix", category: "Objet", short: "Instrument du salut en Christ.", detail: "Supplice romain devenu le centre du plan rédempteur : à la croix, Jésus a porté nos péchés et triomphé des puissances.", refs: ["1 Corinthiens 1:18", "Colossiens 2:14-15", "Galates 6:14"] },
  { word: "Disciple", category: "Concept", short: "Apprenant qui suit son maître.", detail: "Être disciple de Christ, c'est renoncer à soi-même, porter sa croix et le suivre, en marchant dans sa Parole.", refs: ["Luc 9:23", "Jean 8:31", "Matthieu 28:19"] },
  { word: "Élu", category: "Concept", short: "Choisi par Dieu selon sa grâce.", detail: "Les croyants sont élus en Christ avant la fondation du monde pour être saints et irréprochables devant Lui.", refs: ["Éphésiens 1:4", "1 Pierre 1:1-2"] },
  { word: "Espérance", category: "Doctrine", short: "Attente confiante des promesses de Dieu.", detail: "Vertu chrétienne fondée sur la résurrection de Christ et le retour glorieux du Seigneur.", refs: ["Romains 8:24-25", "Tite 2:13", "Hébreux 6:19"] },
  { word: "Foi", category: "Doctrine", short: "Assurance des choses qu'on espère.", detail: "La foi est don de Dieu, moyen par lequel le pécheur est justifié et marche selon l'Esprit.", refs: ["Hébreux 11:1", "Éphésiens 2:8", "Romains 1:17"] },
  { word: "Grâce", category: "Doctrine", short: "Faveur imméritée de Dieu.", detail: "Don gratuit du salut accordé au pécheur repentant par le moyen de Jésus-Christ.", refs: ["Éphésiens 2:8-9", "Tite 2:11", "2 Corinthiens 12:9"] },
  { word: "Hébreu", category: "Concept", short: "Descendant d'Héber, langue d'Israël.", detail: "Désigne les Israélites et la langue principale de l'Ancien Testament.", refs: ["Genèse 14:13", "Philippiens 3:5"] },
  { word: "Israël", category: "Lieu", short: "Peuple de l'alliance, nom donné à Jacob.", detail: "« Celui qui lutte avec Dieu ». Nom du peuple choisi, ancêtre des douze tribus.", refs: ["Genèse 32:28", "Romains 9-11"] },
  { word: "Jérusalem", category: "Lieu", short: "Ville sainte, capitale spirituelle.", detail: "Lieu du Temple, de la crucifixion et de la résurrection. L'Apocalypse annonce la Nouvelle Jérusalem céleste.", refs: ["2 Samuel 5", "Apocalypse 21:2"] },
  { word: "Jésus", category: "Personnage", short: "« YHWH sauve ».", detail: "Nom donné à l'Enfant par l'ange : Il sauvera son peuple de ses péchés. Pleinement Dieu et pleinement homme.", refs: ["Matthieu 1:21", "Philippiens 2:6-11"] },
  { word: "Judas", category: "Personnage", short: "Disciple qui a trahi Jésus.", detail: "Apôtre devenu traître pour trente pièces d'argent, accomplissant les Écritures.", refs: ["Matthieu 26:14-16", "Actes 1:16-20"] },
  { word: "Justification", category: "Doctrine", short: "Acte par lequel Dieu déclare juste.", detail: "Par la foi en Christ, le croyant est déclaré juste, ses péchés pardonnés et la justice de Christ lui est imputée.", refs: ["Romains 3:24", "Romains 5:1", "Galates 2:16"] },
  { word: "Loi", category: "Doctrine", short: "Commandements donnés par Dieu à Moïse.", detail: "La Loi révèle le péché et conduit à Christ qui en est l'accomplissement.", refs: ["Exode 20", "Romains 7:7", "Matthieu 5:17"] },
  { word: "Marie", category: "Personnage", short: "Mère de Jésus selon la chair.", detail: "Vierge choisie par Dieu pour enfanter le Messie par l'opération du Saint-Esprit.", refs: ["Luc 1:26-38", "Matthieu 1:18-25"] },
  { word: "Messie", category: "Personnage", short: "« Oint » — équivalent hébreu de Christ.", detail: "Le Sauveur promis depuis la Genèse, accompli en Jésus de Nazareth.", refs: ["Daniel 9:25", "Jean 1:41", "Jean 4:25-26"] },
  { word: "Miséricorde", category: "Doctrine", short: "Compassion divine envers le pécheur.", detail: "Attribut de Dieu qui retient le jugement et accorde le pardon par Christ.", refs: ["Lamentations 3:22-23", "Tite 3:5"] },
  { word: "Notse", category: "Lieu", short: "Ville du Togo, centre de la MCSF.", detail: "Siège de l'œuvre Mission Christ Sans Frontière, fondée par le Pasteur ADAM Aboudaminou.", refs: [] },
  { word: "Pâque", category: "Concept", short: "Mémorial de la sortie d'Égypte.", detail: "Fête juive accomplie en Christ, notre Pâque, immolé pour nous.", refs: ["Exode 12", "1 Corinthiens 5:7"] },
  { word: "Péché", category: "Doctrine", short: "Transgression de la loi de Dieu.", detail: "Tout manquement à la sainteté divine. Le salaire du péché est la mort, mais le don de Dieu est la vie éternelle en Christ.", refs: ["Romains 3:23", "Romains 6:23", "1 Jean 3:4"] },
  { word: "Prière", category: "Concept", short: "Dialogue du croyant avec Dieu.", detail: "Adoration, confession, supplication et action de grâces adressées au Père au nom de Jésus.", refs: ["Matthieu 6:9-13", "Philippiens 4:6", "1 Thessaloniciens 5:17"] },
  { word: "Prophète", category: "Personnage", short: "Porte-parole de Dieu.", detail: "Homme suscité par Dieu pour parler en son nom : annoncer, exhorter, prédire.", refs: ["Deutéronome 18:18", "2 Pierre 1:21"] },
  { word: "Rédemption", category: "Doctrine", short: "Rachat par le sang de Christ.", detail: "Affranchissement du péché et de la condamnation au moyen du sacrifice expiatoire de Jésus.", refs: ["Éphésiens 1:7", "1 Pierre 1:18-19"] },
  { word: "Réconciliation", category: "Doctrine", short: "Rétablissement de la paix avec Dieu.", detail: "Par la croix, Dieu a réconcilié le monde avec Lui-même. Le ministère de la réconciliation est confié à l'Église.", refs: ["2 Corinthiens 5:18-21", "Romains 5:10"] },
  { word: "Repentance", category: "Doctrine", short: "Changement de cœur et d'esprit.", detail: "Retour à Dieu avec confession des péchés, accompagné de fruits dignes de la repentance.", refs: ["Actes 3:19", "Luc 13:3", "Matthieu 3:8"] },
  { word: "Royaume de Dieu", category: "Doctrine", short: "Règne souverain de Dieu en Christ.", detail: "Déjà inauguré et pas encore consommé, il s'étend par l'Évangile jusqu'au retour glorieux du Roi.", refs: ["Marc 1:15", "Matthieu 6:33", "Apocalypse 11:15"] },
  { word: "Sabbat", category: "Concept", short: "Jour de repos institué par Dieu.", detail: "Septième jour, signe de l'alliance, accompli en Christ qui est notre repos.", refs: ["Genèse 2:2-3", "Hébreux 4:9-10"] },
  { word: "Sainteté", category: "Doctrine", short: "Séparation pour Dieu, pureté morale.", detail: "Attribut essentiel de Dieu, appelé à se reproduire dans la vie de ses enfants.", refs: ["Lévitique 19:2", "1 Pierre 1:15-16", "Hébreux 12:14"] },
  { word: "Saint-Esprit", category: "Personnage", short: "Troisième personne de la Trinité.", detail: "Esprit de vérité envoyé par le Père au nom du Fils pour habiter les croyants, les enseigner et les fortifier.", refs: ["Jean 14:26", "Actes 1:8", "Romains 8:9"] },
  { word: "Salut", category: "Doctrine", short: "Délivrance du péché et de ses conséquences.", detail: "Œuvre complète de Dieu : justification, sanctification, glorification, accordée par la foi en Christ.", refs: ["Éphésiens 2:8-10", "Romains 1:16"] },
  { word: "Satan", category: "Personnage", short: "« L'adversaire », l'accusateur.", detail: "Ange déchu, opposant de Dieu et du peuple racheté ; vaincu à la croix et destiné au lac de feu.", refs: ["Job 1", "Apocalypse 12:9-10", "Apocalypse 20:10"] },
  { word: "Sela", category: "Concept", short: "Indication musicale des Psaumes.", detail: "Pause invitant à la méditation. Souvent traduit « Pause ». Voir aussi le titre du livre « Sela Hammachlehoth ».", refs: ["Psaume 3:2", "Habacuc 3:3"] },
  { word: "Sion", category: "Lieu", short: "Mont de Jérusalem, image du peuple.", detail: "Désigne la cité de Dieu, et symboliquement l'Église, épouse de l'Agneau.", refs: ["Psaume 2:6", "Hébreux 12:22"] },
  { word: "Trinité", category: "Doctrine", short: "Un seul Dieu en trois personnes.", detail: "Père, Fils et Saint-Esprit : un seul Dieu dans une parfaite unité de nature et de gloire.", refs: ["Matthieu 28:19", "2 Corinthiens 13:13"] },
  { word: "Vérité", category: "Concept", short: "Christ est la Vérité.", detail: "La Parole de Dieu est vérité ; elle libère et sanctifie.", refs: ["Jean 14:6", "Jean 17:17", "Jean 8:32"] },
  { word: "Yahvé / YHWH", category: "Personnage", short: "Nom propre de Dieu dans l'AT.", detail: "« Je suis celui qui suis » : nom révélé à Moïse, exprimant l'éternité et la fidélité de Dieu.", refs: ["Exode 3:14-15"] },
];

const CATEGORIES = ["Tous", "Personnage", "Lieu", "Concept", "Objet", "Doctrine"] as const;

function DictionnairePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tous");
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ENTRIES
      .filter((e) => cat === "Tous" || e.category === cat)
      .filter((e) =>
        !needle ||
        e.word.toLowerCase().includes(needle) ||
        e.short.toLowerCase().includes(needle) ||
        e.detail.toLowerCase().includes(needle),
      )
      .sort((a, b) => a.word.localeCompare(b.word, "fr"));
  }, [q, cat]);

  return (
    <Layout>
      <PageBanner
        title="Dictionnaire biblique"
        subtitle="Recherchez un mot, un nom propre ou un concept biblique avec son explication."
        image="hero2"
        icon={<BookMarked className="h-7 w-7 text-flame" />}
      />

      <section className="container-page py-8">
        <div className="sticky top-16 z-10 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher un mot biblique (ex : grâce, alliance, Sion…)"
              className="w-full rounded-none border border-border bg-card py-3 pl-10 pr-4 text-sm shadow-soft focus:border-flame focus:outline-none"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${cat === c ? "bg-flame text-flame-foreground" : "bg-accent text-foreground hover:bg-flame/15"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{filtered.length} entrée{filtered.length > 1 ? "s" : ""}</p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => {
            const open = openIdx === e.word;
            return (
              <li key={e.word} className="border border-border bg-card p-4 shadow-soft transition hover:shadow-elegant">
                <button onClick={() => setOpenIdx(open ? null : e.word)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-bold text-primary">{e.word}</h3>
                    <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {e.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/85">{e.short}</p>
                </button>
                {open && (
                  <div className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-foreground/90">
                    <p>{e.detail}</p>
                    {e.refs.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {e.refs.map((r) => (
                          <span key={r} className="rounded-full bg-flame/10 px-2 py-0.5 text-[11px] font-medium text-flame">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {filtered.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Aucun résultat pour « {q} ».
          </p>
        )}
      </section>
    </Layout>
  );
}
