import { Layout } from "@/components/Layout";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <Layout>
      <section className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-gradient-primary p-10 text-center text-primary-foreground shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-flame">MCSF</p>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-3 text-primary-foreground/85">{description}</p>
          <p className="mt-6 text-sm text-primary-foreground/70">
            Ce module sera enrichi dans la prochaine itération.
          </p>
        </div>
      </section>
    </Layout>
  );
}
