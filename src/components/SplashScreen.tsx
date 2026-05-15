import { useEffect, useState } from "react";
import logo from "@/assets/mcsf-logo.png";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2400);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-primary text-primary-foreground">
      <img
        src={logo}
        alt="MCSF"
        width={160}
        height={160}
        className="h-40 w-40 animate-slide-in drop-shadow-2xl"
      />
      <h1 className="mt-6 text-3xl font-bold tracking-wide animate-slide-in">Bienvenue</h1>
      <p className="mt-2 text-sm text-primary-foreground/80">Mission Christ Sans Frontière</p>
      <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-full animate-pulse bg-flame" />
      </div>
    </div>
  );
}
