import { Link } from "@tanstack/react-router";
import { Home, Video, Library, Mic, Newspaper } from "lucide-react";

const TABS = [
  { to: "/" as const, label: "Accueil", Icon: Home, exact: true },
  { to: "/bibliotheque" as const, label: "Livres", Icon: Library, exact: false },
  { to: "/enseignement" as const, label: "Vidéos", Icon: Video, exact: false },
  { to: "/podcast" as const, label: "Podcast", Icon: Mic, exact: false },
  { to: "/blog" as const, label: "Blog", Icon: Newspaper, exact: false },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-5">
        {TABS.map(({ to, label, Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            className="flex flex-col items-center gap-1 py-2 text-[10px] font-medium text-muted-foreground"
            activeProps={{ className: "flex flex-col items-center gap-1 py-2 text-[10px] font-semibold text-primary" }}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
