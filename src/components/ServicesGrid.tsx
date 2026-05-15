import { Link } from "@tanstack/react-router";
import { BookOpen, Video, Headphones, Library, MessagesSquare, Calendar, Heart, BookMarked } from "lucide-react";

const SERVICES = [
  { to: "/blog" as const, label: "Blog", Icon: BookOpen, color: "bg-blue-100 text-blue-700" },
  { to: "/enseignement" as const, label: "Enseignement", Icon: Video, color: "bg-rose-100 text-rose-700" },
  { to: "/podcast" as const, label: "Podcast", Icon: Headphones, color: "bg-amber-100 text-amber-700" },
  { to: "/bibliotheque" as const, label: "Bibliothèque", Icon: Library, color: "bg-emerald-100 text-emerald-700" },
  { to: "/bible" as const, label: "Bible", Icon: BookMarked, color: "bg-indigo-100 text-indigo-700" },
  { to: "/forum" as const, label: "Forum", Icon: MessagesSquare, color: "bg-fuchsia-100 text-fuchsia-700" },
  { to: "/evenements" as const, label: "Événements", Icon: Calendar, color: "bg-cyan-100 text-cyan-700" },
  { to: "/don" as const, label: "Faire un don", Icon: Heart, color: "bg-orange-100 text-orange-700" },
];

export function ServicesGrid() {
  return (
    <section className="container-page py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Nos modules</h2>
          <p className="text-sm text-muted-foreground">Tout pour grandir dans la foi</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:grid-cols-8 md:gap-4">
        {SERVICES.map(({ to, label, Icon, color }) => (
          <Link
            key={to + label}
            to={to}
            className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:bg-accent"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} shadow-soft transition group-hover:scale-105 md:h-16 md:w-16`}>
              <Icon className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <span className="text-center text-[11px] font-medium leading-tight md:text-xs">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
