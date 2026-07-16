import { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES, useI18n } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white shadow-soft backdrop-blur-sm hover:bg-white/25"
        aria-label="Changer la langue"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-sm leading-none">{current.flag}</span>
        <span className="font-bold tracking-wide">{current.native}</span>
        {!compact && <ChevronDown className="h-3 w-3 opacity-80" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[60] mt-1 w-52 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-elegant">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onMouseDown={(e) => {
                e.preventDefault();
                setLang(l.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-xs text-popover-foreground hover:bg-accent hover:text-accent-foreground ${l.code === lang ? "bg-accent/60 font-semibold" : ""}`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base leading-none">{l.flag}</span>
                <span>{l.label}</span>
              </span>
              {l.code === lang && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
