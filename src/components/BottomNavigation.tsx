import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Video, Library } from "lucide-react";

const TABS = [
  { to: "/" as const, label: "Accueil", Icon: Home, exact: true },
  { to: "/enseignement" as const, label: "Vidéos", Icon: Video, exact: false },
  { to: "/bibliotheque" as const, label: "Livres", Icon: Library, exact: false },
  { to: "/bible" as const, label: "Bible", Icon: BookOpen, exact: false },
];

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-4">
        {TABS.map(({ to, label, Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-primary" }}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
