import { Link } from "@tanstack/react-router";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/mcsf-logo-official.png";
import { NAV_ITEMS, MEGA_MENU } from "@/lib/nav";

export function ModernHeader() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="MCSF" width={40} height={40} className="h-10 w-10" />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-primary">MCSF</div>
            <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              Mission Christ Sans Frontière
            </div>
          </div>
        </Link>

        {/* Desktop mega menu */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            activeProps={{ className: "rounded-md px-3 py-2 text-sm font-bold text-primary bg-accent" }}
            activeOptions={{ exact: true }}
          >
            Accueil
          </Link>
          {MEGA_MENU.map((group) => (
            <div
              key={group.label}
              onMouseEnter={() => setMegaOpen(group.label)}
              onMouseLeave={() => setMegaOpen(null)}
              className="relative"
            >
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">
                {group.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {megaOpen === group.label && (
                <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-2">
                  <div className="rounded-xl border border-border bg-popover p-2 shadow-soft">
                    {group.items.map((it) => (
                      <Link
                        key={it.to}
                        to={it.to}
                        className="block rounded-lg p-3 hover:bg-accent"
                      >
                        <div className="text-sm font-semibold text-foreground">{it.label}</div>
                        <div className="text-xs text-muted-foreground">{it.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Search + CTA + mobile burger */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 md:flex">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground lg:w-44"
            />
          </div>
          <Link
            to="/don"
            className="hidden rounded-full bg-gradient-flame px-4 py-2 text-sm font-semibold text-flame-foreground shadow-flame transition hover:scale-[1.03] sm:inline-flex"
          >
            Faire un don
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent lg:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Tablet horizontal nav */}
      <div className="hidden border-t border-border bg-background/60 md:block lg:hidden">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2">
          {NAV_ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium hover:bg-accent"
              activeProps={{ className: "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground" }}
              activeOptions={{ exact: it.to === "/" }}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page py-3">
            <div className="mb-3 flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="flex-1 bg-transparent text-sm outline-none"
              />
            </div>
            <nav className="grid gap-1">
              {NAV_ITEMS.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {it.label}
                </Link>
              ))}
              <Link
                to="/don"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-md bg-gradient-flame px-3 py-2 text-center text-sm font-semibold text-flame-foreground"
              >
                Faire un don
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
