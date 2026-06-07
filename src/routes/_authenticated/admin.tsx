import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { LogOut, Users, FileText, BookOpen, Video, Radio, Trash2, Plus, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Tableau de bord admin — MCSF" }] }),
  component: AdminPage,
});

type Tab = "registrations" | "articles" | "books" | "videos" | "podcasts";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("registrations");
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
    { id: "registrations", label: "Inscriptions", icon: Users },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "books", label: "Livres", icon: BookOpen },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Radio },
  ];

  return (
    <Layout>
      <section className="bg-gradient-primary py-6 text-primary-foreground">
        <div className="container-page flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">Tableau de bord admin</h1>
            <p className="text-sm text-primary-foreground/85">Gérer le contenu et les inscriptions du site MCSF</p>
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-flame px-4 py-2 text-sm font-semibold text-flame-foreground">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </section>

      <section className="container-page py-6">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition ${tab === t.id ? "border-flame text-flame" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === "registrations" && <Registrations />}
        {tab === "articles" && <ContentTable table="articles" fields={[{ name: "title", label: "Titre" }, { name: "category", label: "Catégorie" }, { name: "excerpt", label: "Extrait", textarea: true }, { name: "cover_url", label: "URL image" }]} />}
        {tab === "books" && <ContentTable table="books" fields={[{ name: "title", label: "Titre" }, { name: "author", label: "Auteur" }, { name: "chapters", label: "Chapitres", type: "number" }, { name: "cover_url", label: "URL couverture" }]} />}
        {tab === "videos" && <ContentTable table="videos" fields={[{ name: "title", label: "Titre" }, { name: "youtube_id", label: "ID YouTube" }, { name: "duration", label: "Durée" }]} />}
        {tab === "podcasts" && <ContentTable table="podcasts" fields={[{ name: "title", label: "Titre" }, { name: "duration", label: "Durée" }, { name: "audio_url", label: "URL audio" }]} />}
      </section>
    </Layout>
  );
}

function Registrations() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    const { error } = await supabase.from("event_registrations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); load(); }
  };

  const exportCsv = () => {
    const headers = ["Date", "Événement", "Nom", "Email", "Téléphone", "Ville", "Église", "Message"];
    const lines = rows.map((r) => [
      new Date(r.created_at).toLocaleString("fr-FR"),
      r.event_title, r.full_name, r.email, r.phone ?? "", r.city ?? "", r.church ?? "", (r.message ?? "").replace(/\n/g, " "),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `inscriptions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rows.length} inscription(s)</p>
        <button onClick={exportCsv} disabled={!rows.length} className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">
          Exporter CSV
        </button>
      </div>
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Aucune inscription pour le moment.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{r.full_name}</h3>
                  <p className="text-xs text-flame">{r.event_title}</p>
                </div>
                <button onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {r.email}</p>
                {r.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.phone}</p>}
                {(r.city || r.church) && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {[r.city, r.church].filter(Boolean).join(" • ")}</p>}
                {r.message && <p className="mt-1 italic">"{r.message}"</p>}
                <p className="pt-1 text-[10px]">{new Date(r.created_at).toLocaleString("fr-FR")}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

type Field = { name: string; label: string; type?: string; textarea?: boolean };

function ContentTable({ table, fields }: { table: "articles" | "books" | "videos" | "podcasts"; fields: Field[] }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editing, setEditing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [table]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    fields.forEach((f) => { if (f.type === "number" && payload[f.name]) payload[f.name] = Number(payload[f.name]); });
    const client = supabase.from(table) as any;
    const { error } = editing
      ? await client.update(payload).eq("id", editing)
      : await client.insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editing ? "Mis à jour" : "Ajouté"); setForm({}); setEditing(null); load(); }
  };

  const edit = (row: any) => {
    setEditing(row.id);
    const f: Record<string, any> = {};
    fields.forEach((field) => f[field.name] = row[field.name] ?? "");
    setForm(f);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Supprimé"); load(); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Chargement…</p>
        ) : rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Rien à afficher. Ajoutez le premier élément →</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-soft">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{r.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.author || r.category || r.youtube_id || r.duration || ""}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(r)} className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground">Modifier</button>
                  <button onClick={() => remove(r.id)} className="rounded bg-destructive/10 p-1.5 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside>
        <form onSubmit={save} className="space-y-2 rounded-lg border border-border bg-card p-4 shadow-soft">
          <h3 className="flex items-center gap-2 font-semibold text-foreground"><Plus className="h-4 w-4 text-flame" /> {editing ? "Modifier" : "Ajouter"}</h3>
          {fields.map((f) => (
            <label key={f.name} className="block text-xs">
              <span className="mb-1 block font-medium text-muted-foreground">{f.label}</span>
              {f.textarea ? (
                <textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} rows={3} className="w-full rounded border border-border bg-background p-2 text-sm" />
              ) : (
                <input type={f.type ?? "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} className="w-full rounded border border-border bg-background p-2 text-sm" />
              )}
            </label>
          ))}
          <div className="flex gap-2 pt-1">
            <button type="submit" className="flex-1 rounded-full bg-flame py-2 text-xs font-semibold text-flame-foreground">{editing ? "Mettre à jour" : "Créer"}</button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({}); }} className="rounded-full border border-border px-3 py-2 text-xs">Annuler</button>}
          </div>
        </form>
      </aside>
    </div>
  );
}
