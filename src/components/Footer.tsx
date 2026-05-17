import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/mcsf-logo-official.png";

const RECENT_POSTS = [
  { to: "/blog", title: "L'Armageddon : ce que dit l'Écriture" },
  { to: "/blog", title: "Ils crieront — Apocalypse 6" },
  { to: "/blog", title: "Préparer son cœur pour le retour de Christ" },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="MCSF" width={48} height={48} className="h-12 w-12" loading="lazy" />
            <div>
              <div className="font-display text-xl font-bold">MCSF</div>
              <div className="text-[11px] uppercase tracking-wider text-primary-foreground/70">
                Mission Christ Sans Frontière
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
            Une œuvre missionnaire dirigée par le Pasteur ADAM Aboudaminou,
            consacrée à la prédication de l'Évangile et à la révélation parfaite.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Navigation</h4>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/85">
            <li><Link to="/" className="hover:text-flame">Accueil</Link></li>
            <li><Link to="/blog" className="hover:text-flame">Blog</Link></li>
            <li><Link to="/enseignement" className="hover:text-flame">Enseignements</Link></li>
            <li><Link to="/podcast" className="hover:text-flame">Podcasts</Link></li>
            <li><Link to="/bibliotheque" className="hover:text-flame">Bibliothèque</Link></li>
            <li><Link to="/evenements" className="hover:text-flame">Événements</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Dernier du blog</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            {RECENT_POSTS.map((p) => (
              <li key={p.title}>
                <Link to={p.to} className="leading-snug hover:text-flame">{p.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/85">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-flame" /><span>Notse, Togo — Centre Rehoboth</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-flame" /><span>+228 00 00 00 00</span></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-flame" /><span>contact@mcsf.org</span></li>
          </ul>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-flame"><Facebook className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="rounded-full bg-white/10 p-2 hover:bg-flame"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-flame"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-primary-foreground/70">
        © {new Date().getFullYear()} Mission Christ Sans Frontière (MCSF) — Tous droits réservés.
      </div>
    </footer>
  );
}
