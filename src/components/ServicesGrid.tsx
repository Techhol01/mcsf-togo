import { Link } from "@tanstack/react-router";
import { BookOpen, Youtube, Mic2, Library, MessagesSquare, CalendarHeart, HandHeart, BookMarked } from "lucide-react";

const SERVICES = [
  { to: "/blog" as const, label: "Blog", desc: "Articles & méditations", Icon: BookOpen, gradient: "from-blue-500 to-indigo-600" },
  { to: "/enseignement" as const, label: "Enseignement", desc: "Vidéos & prédications", Icon: Youtube, gradient: "from-rose-500 to-red-600" },
  { to: "/podcast" as const, label: "Podcast", desc: "Émissions audio", Icon: Mic2, gradient: "from-amber-500 to-orange-600" },
  { to: "/bibliotheque" as const, label: "Bibliothèque", desc: "Livres du Pasteur", Icon: Library, gradient: "from-emerald-500 to-teal-600" },
  { to: "/bible" as const, label: "Bible", desc: "Lire la Parole", Icon: BookMarked, gradient: "from-indigo-500 to-violet-600" },
  { to: "/forum" as const, label: "Forum", desc: "Communauté & prière", Icon: MessagesSquare, gradient: "from-fuchsia-500 to-pink-600" },
  { to: "/evenements" as const, label: "Événements", desc: "Conférences & VUPJ", Icon: CalendarHeart, gradient: "from-cyan-500 to-sky-600" },
  { to: "/don" as const, label: "Faire un don", desc: "Soutenir la mission", Icon: HandHeart, gradient: "from-orange-500 to-amber-600" },
];

export function ServicesGrid() {
  return (
    <section className="container-page py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-flame">Explorer</p>
          <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">Nos modules</h2>
          <p className="text-sm text-muted-foreground">Tout pour grandir dans la foi</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {SERVICES.map(({ to, label, desc, Icon, gradient }) => (
          <Link
            key={to + label}
            to={to}
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition group-hover:scale-110`}>
              <Icon className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-display text-sm font-bold leading-tight text-foreground group-hover:text-primary">{label}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{desc}</div>
            </div>
            <span className="absolute right-3 top-3 text-xs text-muted-foreground opacity-0 transition group-hover:opacity-100">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
