import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Heart, CreditCard, Smartphone } from "lucide-react";

export const Route = createFileRoute("/don")({
  head: () => ({
    meta: [
      { title: "Faire un don — MCSF" },
      { name: "description", content: "Soutenez la mission de la MCSF par un don." },
    ],
  }),
  component: DonPage,
});

const AMOUNTS = [5, 10, 25, 50, 100];

function DonPage() {
  const [amount, setAmount] = useState(25);
  const [method, setMethod] = useState<"card" | "mobile">("card");

  return (
    <Layout>
      <section className="bg-gradient-primary py-10 text-primary-foreground">
        <div className="container-page text-center">
          <Heart className="mx-auto h-10 w-10 text-flame" />
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Soutenir la mission</h1>
          <p className="mt-2 mx-auto max-w-xl text-primary-foreground/85">
            Votre don soutient l'évangélisation, l'enseignement et l'aide aux nécessiteux à travers le Togo et au-delà.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-lg font-semibold text-foreground">Montant (EUR)</h2>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`rounded-full border py-2 text-sm font-semibold transition ${amount === a ? "border-flame bg-flame text-flame-foreground" : "border-border bg-background text-foreground hover:bg-accent"}`}
              >
                {a} €
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />

          <h2 className="mt-6 font-display text-lg font-semibold text-foreground">Mode de paiement</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => setMethod("card")} className={`inline-flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium ${method === "card" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`}>
              <CreditCard className="h-4 w-4" /> Carte bancaire
            </button>
            <button onClick={() => setMethod("mobile")} className={`inline-flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium ${method === "mobile" ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"}`}>
              <Smartphone className="h-4 w-4" /> Mobile Money
            </button>
          </div>

          <button
            onClick={() => alert(`Merci ! Don de ${amount}€ via ${method === "card" ? "carte" : "Mobile Money"}.\n(Activez Lovable Cloud + Stripe pour traiter les dons réellement.)`)}
            className="mt-6 w-full rounded-full bg-flame py-3 font-semibold text-flame-foreground hover:opacity-90"
          >
            Donner {amount} € maintenant
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Paiement sécurisé. La MCSF est une mission évangélique basée à Notse, Togo.
          </p>
        </div>
      </section>
    </Layout>
  );
}
