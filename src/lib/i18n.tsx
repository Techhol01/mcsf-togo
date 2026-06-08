import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "fr" | "en" | "ar" | "ee" | "ajg" | "kbp" | "tem";

export const LANGUAGES: { code: Lang; label: string; flag: string; native: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷", native: "FR" },
  { code: "en", label: "English", flag: "🇬🇧", native: "EN" },
  { code: "ar", label: "العربية", flag: "🇸🇦", native: "AR" },
  { code: "ee", label: "Eʋegbe", flag: "🇹🇬", native: "EWE" },
  { code: "ajg", label: "Ajagbe", flag: "🇹🇬", native: "AJA" },
  { code: "kbp", label: "Kabɩyɛ", flag: "🇹🇬", native: "KAB" },
  { code: "tem", label: "Tem", flag: "🇹🇬", native: "TEM" },
];

const dict: Record<string, Record<Lang, string>> = {
  "nav.home":          { fr: "Accueil", en: "Home", ar: "الرئيسية", ee: "Aƒe", ajg: "Xwé", kbp: "Ɖɩɖɔm", tem: "Aɖaaŋ" },
  "nav.blog":          { fr: "Blog", en: "Blog", ar: "المدونة", ee: "Blog", ajg: "Blog", kbp: "Blog", tem: "Blog" },
  "nav.teaching":      { fr: "Enseignement", en: "Teaching", ar: "تعليم", ee: "Nufiafia", ajg: "Nukpla", kbp: "Wɩlɩtʊ", tem: "Kɔlɔ" },
  "nav.podcast":       { fr: "Podcast", en: "Podcast", ar: "بودكاست", ee: "Podcast", ajg: "Podcast", kbp: "Podcast", tem: "Podcast" },
  "nav.library":       { fr: "Bibliothèque", en: "Library", ar: "المكتبة", ee: "Agbalẽdzraɖoƒe", ajg: "Wémagba", kbp: "Tákayasɩ", tem: "Yaani" },
  "nav.bible":         { fr: "Bible", en: "Bible", ar: "الكتاب المقدس", ee: "Biblia", ajg: "Biblɛ", kbp: "Bibl", tem: "Bibl" },
  "nav.dictionary":    { fr: "Dictionnaire", en: "Dictionary", ar: "قاموس", ee: "Nyagɔmeɖeɖe", ajg: "Nyahlanme", kbp: "Tɔm-takayaɣ", tem: "Tɔndɔr" },
  "nav.forum":         { fr: "Forum", en: "Forum", ar: "منتدى", ee: "Forum", ajg: "Forum", kbp: "Forum", tem: "Forum" },
  "nav.events":        { fr: "Événements", en: "Events", ar: "الفعاليات", ee: "Wɔnawo", ajg: "Nu", kbp: "Sɔsɔɔlɩm", tem: "Sɛm" },
  "cta.donate":        { fr: "Faire un don", en: "Donate", ar: "تبرع", ee: "Na nu", ajg: "Naa nu", kbp: "Pɩsɩ haɣ", tem: "Tɛɛ" },
  "menu":              { fr: "Menu", en: "Menu", ar: "القائمة", ee: "Lista", ajg: "Lista", kbp: "Liste", tem: "Liste" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangCtx = createContext<Ctx>({ lang: "fr", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("mcsf_lang") as Lang | null;
    if (saved) setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("mcsf_lang", l); } catch {}
  };

  const t = (key: string) => dict[key]?.[lang] ?? dict[key]?.fr ?? key;

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useI18n = () => useContext(LangCtx);
