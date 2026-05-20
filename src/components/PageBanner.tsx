import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const IMAGES = { hero1, hero2, hero3 } as const;

export function PageBanner({
  title,
  subtitle,
  image = "hero1",
  icon,
}: {
  title: string;
  subtitle?: string;
  image?: keyof typeof IMAGES;
  icon?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden text-primary-foreground">
      <img
        src={IMAGES[image]}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover blur-sm scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/55" />
      <div className="container-page relative py-12 md:py-16">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h1 className="font-display text-3xl font-bold drop-shadow md:text-4xl">{title}</h1>
            {subtitle && (
              <p className="mt-2 max-w-2xl text-sm text-primary-foreground/95 drop-shadow md:text-base">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
