import { Link } from "@tanstack/react-router";
import { Menu, Mail, Phone, HandHeart } from "lucide-react";
import logo from "@/assets/mcsf-logo-official.png";
import { NAV_ITEMS } from "@/lib/nav";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { GlobalSearch } from "@/components/GlobalSearch";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export function ModernHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      {/* ===== TOP STRIP (desktop only) — contact + langues + don ===== */}
      <div className="hidden border-b border-border/50 bg-primary text-primary-foreground lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" /> +228 00 00 00 00</span>
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3 w-3" /> contact@mcsf.org</span>
            <span className="text-primary-foreground/70">Notse, Togo — Centre Rehoboth</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link to="/auth" className="text-primary-foreground/85 hover:text-flame">Mon compte</Link>
          </div>
        </div>
      </div>

      {/* ===== MAIN ROW — logo / nav (desktop) / actions ===== */}
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="MCSF" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
          <div className="leading-tight min-w-0">
            <div className="font-display text-lg font-bold text-primary">MCSF</div>
            <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
              Mission Christ Sans Frontière
            </div>
          </div>
        </Link>

        {/* Desktop nav — second section, aligned center */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {NAV_ITEMS.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="rounded-md px-3 py-2 text-[13px] font-medium text-foreground/85 hover:bg-accent hover:text-primary"
              activeProps={{ className: "rounded-md px-3 py-2 text-[13px] font-bold text-primary bg-accent" }}
              activeOptions={{ exact: it.to === "/" }}
            >
              {t(it.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block lg:hidden">
            <LanguageSwitcher compact />
          </div>
          <div className="hidden md:block">
            <GlobalSearch />
          </div>
          <Link
            to="/don"
            className="hidden items-center gap-1.5 rounded-full bg-gradient-flame px-4 py-2 text-sm font-semibold text-flame-foreground shadow-flame transition hover:scale-[1.03] sm:inline-flex"
          >
            <HandHeart className="h-4 w-4" />
            <span>{t("cta.donate")}</span>
          </Link>

          {/* Mobile sidebar */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="flex items-center gap-2">
                  <img src={logo} alt="MCSF" className="h-8 w-8 object-contain" />
                  <div className="leading-tight text-left">
                    <div className="font-display text-primary">MCSF</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mission Christ Sans Frontière</div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                <div className="mb-3 flex flex-col gap-2">
                  <GlobalSearch trigger="input" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Langue</span>
                    <LanguageSwitcher />
                  </div>
                </div>
                {NAV_ITEMS.map((it) => (
                  <SheetClose asChild key={it.to}>
                    <Link
                      to={it.to}
                      className="rounded-md px-3 py-3 text-base font-semibold hover:bg-accent"
                      activeProps={{ className: "rounded-md px-3 py-3 text-base font-bold text-primary bg-accent" }}
                      activeOptions={{ exact: it.to === "/" }}
                    >
                      {t(it.key)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link to="/don" className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-flame px-4 py-2 text-center text-sm font-semibold text-flame-foreground">
                    <HandHeart className="h-4 w-4" />
                    {t("cta.donate")}
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
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
              {t(it.key)}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
