import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X, ImageIcon, Eye, EyeOff, ArrowLeft, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { B, btnStyles } from "@/components/site/buttons";
import { supabase } from "@/integrations/supabase/client";
import { propertyTypes } from "@/data/site";
import {
  UPCOMING_COLUMNS,
  rowToUpcoming,
  upcomingToRow,
  emptyUpcoming,
  type UpcomingProject,
  type UpcomingProjectRow,
} from "@/lib/upcoming-mapper";

export const Route = createFileRoute("/_authenticated/admin/upcoming")({
  head: () => ({
    meta: [
      { title: "Manage Upcoming Projects | Mohit Gaur" },
      { name: "description", content: "Add, edit, publish and remove upcoming real-estate projects." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Manage Upcoming Projects" },
      { property: "og:description", content: "Owner dashboard for upcoming projects." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminUpcoming,
});

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "grid gap-1.5 text-sm font-medium";

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const lines = (v: string) =>
  v
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

async function fetchAll(): Promise<UpcomingProject[]> {
  const { data, error } = await supabase
    .from("upcoming_projects")
    .select(UPCOMING_COLUMNS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as UpcomingProjectRow[]).map(rowToUpcoming);
}

function AdminUpcoming() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<UpcomingProject | null>(null);

  const list = useQuery({ queryKey: ["admin-upcoming"], queryFn: fetchAll });

  const pendingEnquiries = useQuery({
    queryKey: ["admin-enquiries-pending"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("project_enquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
  });
  const pendingCount = pendingEnquiries.data ?? 0;


  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("upcoming_projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Project removed");
      qc.invalidateQueries({ queryKey: ["admin-upcoming"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublish = useMutation({
    mutationFn: async (p: UpcomingProject) => {
      const { error } = await supabase
        .from("upcoming_projects")
        .update({ published: !p.published } as never)
        .eq("id", p.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-upcoming"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1 className="mt-3 text-3xl">Upcoming projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Published projects appear on the public Upcoming Projects page immediately.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <B variant="gold" onClick={() => setEditing(emptyUpcoming())}>
            <Plus className="size-4" /> Add project
          </B>
          <Link to="/admin/enquiries" className={btnStyles.outline}>
            <Inbox className="size-4" /> Enquiries
            {pendingCount > 0 ? (
              <span className="ml-1 rounded-full bg-gold px-2 py-0.5 text-[0.7rem] font-semibold text-primary-foreground">
                {pendingCount}
              </span>
            ) : null}
          </Link>
          <Link to="/admin" className={btnStyles.outline}>
            <ArrowLeft className="size-4" /> Properties
          </Link>
        </div>

      </div>

      {editing ? (
        <ProjectForm
          key={editing.id || "new"}
          initial={editing}
          isNew={!list.data?.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin-upcoming"] });
          }}
        />
      ) : null}

      <div className="mt-10 grid gap-4">
        {list.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {list.error ? <p className="text-sm text-destructive">{(list.error as Error).message}</p> : null}
        {list.data?.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-4"
          >
            <img src={p.image} alt="" className="size-20 rounded-2xl object-cover" />
            <div className="min-w-48 flex-1">
              <p className="font-display text-lg">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.location}, {p.city} · {p.status} · {p.expectedLaunch || "Launch TBA"}
              </p>
              <p className="text-sm text-gold">{p.price}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
                p.published ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {p.published ? "Published" : "Draft"}
            </span>
            <div className="flex flex-wrap gap-2">
              <B variant="outline" className="px-4 py-2" onClick={() => togglePublish.mutate(p)}>
                {p.published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {p.published ? "Unpublish" : "Publish"}
              </B>
              <B variant="outline" className="px-4 py-2" onClick={() => setEditing(p)}>
                <Pencil className="size-4" /> Edit
              </B>
              <B
                variant="outline"
                className="px-4 py-2 text-destructive"
                onClick={() => {
                  if (confirm(`Remove "${p.name}"? This cannot be undone.`)) remove.mutate(p.id);
                }}
              >
                <Trash2 className="size-4" /> Delete
              </B>
            </div>
          </div>
        ))}
        {list.data && list.data.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No upcoming projects yet. Add your first one.
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function ProjectForm({
  initial,
  isNew,
  onClose,
  onSaved,
}: {
  initial: UpcomingProject;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [p, setP] = useState<UpcomingProject>(initial);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof UpcomingProject>(k: K, v: UpcomingProject[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  const save = useMutation({
    mutationFn: async () => {
      const id = p.id || slugify(p.name);
      if (!id) throw new Error("Project needs a name");
      const row = upcomingToRow({ ...p, id, image: p.image || p.images[0] || "" });
      const { error } = await supabase.from("upcoming_projects").upsert(row as never);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success(isNew ? "Project added" : "Project updated");
      onSaved();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${slugify(p.name) || "project"}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("property-images").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (error) throw new Error(error.message);
        uploaded.push(`/api/public/property-image/${path}`);
      }
      setP((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
        image: prev.image || uploaded[0] || "",
      }));
      toast.success(`${uploaded.length} image(s) uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="mt-8 rounded-3xl border border-border bg-card p-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{isNew ? "New upcoming project" : `Edit — ${initial.name}`}</h2>
        <button type="button" onClick={onClose} aria-label="Close editor" className="rounded-full p-2 hover:bg-secondary">
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={label}>
          Project name
          <input className={field} required value={p.name} onChange={(e) => set("name", e.target.value)} />
        </label>
        <label className={label}>
          URL slug (ID)
          <input
            className={field}
            value={p.id}
            placeholder={slugify(p.name)}
            disabled={!isNew}
            onChange={(e) => set("id", slugify(e.target.value))}
          />
        </label>
        <label className={label}>
          Locality
          <input className={field} value={p.location} onChange={(e) => set("location", e.target.value)} />
        </label>
        <label className={label}>
          City
          <input className={field} value={p.city} onChange={(e) => set("city", e.target.value)} />
        </label>
        <label className={label}>
          Property type
          <select className={field} value={p.type} onChange={(e) => set("type", e.target.value)}>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Status badge
          <select
            className={field}
            value={p.status}
            onChange={(e) => set("status", e.target.value as UpcomingProject["status"])}
          >
            <option>Coming Soon</option>
            <option>Pre-Launch</option>
          </select>
        </label>
        <label className={label}>
          Expected launch
          <input
            className={field}
            value={p.expectedLaunch}
            onChange={(e) => set("expectedLaunch", e.target.value)}
            placeholder="Q4 2026"
          />
        </label>
        <label className={label}>
          Starting / expected price
          <input
            className={field}
            value={p.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="₹34 Lakh onwards"
          />
        </label>
        <label className={label}>
          Available sizes
          <input
            className={field}
            value={p.sizes}
            onChange={(e) => set("sizes", e.target.value)}
            placeholder="1000 / 1500 / 2000 sq.ft."
          />
        </label>
        <label className={label}>
          Display order
          <input
            type="number"
            className={field}
            value={p.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={p.published}
            onChange={(e) => set("published", e.target.checked)}
            className="size-4"
          />
          Published on website
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <label className={label}>
          Short description (used for SEO &amp; cards)
          <textarea
            className={`${field} min-h-28`}
            value={p.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </label>
        <label className={label}>
          Project overview
          <textarea
            className={`${field} min-h-28`}
            value={p.overview}
            onChange={(e) => set("overview", e.target.value)}
          />
        </label>
      </div>

      <label className={`${label} mt-4`}>
        Location &amp; connectivity
        <textarea
          className={`${field} min-h-24`}
          value={p.connectivity}
          onChange={(e) => set("connectivity", e.target.value)}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={label}>
          Key highlights (one per line)
          <textarea
            className={`${field} min-h-28`}
            value={p.highlights.join("\n")}
            onChange={(e) => set("highlights", lines(e.target.value))}
          />
        </label>
        <label className={label}>
          Amenities (one per line)
          <textarea
            className={`${field} min-h-28`}
            value={p.amenities.join("\n")}
            onChange={(e) => set("amenities", lines(e.target.value))}
          />
        </label>
        <label className={label}>
          Launch timeline steps (one per line)
          <textarea
            className={`${field} min-h-28`}
            value={p.timeline.join("\n")}
            onChange={(e) => set("timeline", lines(e.target.value))}
          />
        </label>
      </div>

      <label className={`${label} mt-4`}>
        FAQs — one per line as: Question | Answer
        <textarea
          className={`${field} min-h-28`}
          value={p.faqs.map((f) => `${f.q} | ${f.a}`).join("\n")}
          onChange={(e) =>
            set(
              "faqs",
              lines(e.target.value)
                .map((row) => {
                  const [q, ...rest] = row.split("|");
                  return { q: (q ?? "").trim(), a: rest.join("|").trim() };
                })
                .filter((f) => f.q && f.a),
            )
          }
        />
      </label>

      <div className="mt-6">
        <p className="text-sm font-medium">Images</p>
        <p className="mt-1 text-xs text-muted-foreground">The first image is used as the card photo.</p>

        <div className="mt-3 flex flex-wrap gap-3">
          {p.images.map((src, i) => (
            <div key={`${src}-${i}`} className="relative">
              <img src={src} alt="" className="size-24 rounded-2xl border border-border object-cover" />
              <button
                type="button"
                aria-label="Remove image"
                className="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow"
                onClick={() =>
                  setP((prev) => {
                    const images = prev.images.filter((_, idx) => idx !== i);
                    return { ...prev, images, image: images.includes(prev.image) ? prev.image : images[0] || "" };
                  })
                }
              >
                <X className="size-3.5" />
              </button>
              {p.image === src ? (
                <span className="absolute bottom-1 left-1 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] text-primary-foreground">
                  Main
                </span>
              ) : (
                <button
                  type="button"
                  className="absolute bottom-1 left-1 rounded-full bg-background/90 px-2 py-0.5 text-[0.6rem]"
                  onClick={() => set("image", src)}
                >
                  Set main
                </button>
              )}
            </div>
          ))}
          {!p.images.length ? (
            <div className="flex size-24 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
              <ImageIcon className="size-5" />
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            <Upload className="size-4" />
            {uploading ? "Uploading…" : "Upload images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void upload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <B type="submit" variant="gold" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save project"}
        </B>
        <B type="button" variant="outline" onClick={onClose}>
          Cancel
        </B>
      </div>
    </form>
  );
}
