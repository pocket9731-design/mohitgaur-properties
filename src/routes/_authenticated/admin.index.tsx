import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Upload, X, LogOut, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { B, btnStyles } from "@/components/site/buttons";
import { supabase } from "@/integrations/supabase/client";
import { propertyTypes, type Property } from "@/data/site";
import {
  PROPERTY_COLUMNS,
  rowToProperty,
  propertyToRow,
  type PropertyRow,
} from "@/lib/property-mapper";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Manage Properties | Mohit Gaur" },
      { name: "description", content: "Add, edit and remove property listings for the website." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Manage Properties" },
      { property: "og:description", content: "Owner dashboard for property listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
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

const emptyProperty = (): Property => ({
  id: "",
  name: "",
  location: "",
  city: "Agra",
  type: "Residential Plots",
  size: "",
  sizeSqft: 0,
  price: "",
  priceValue: 0,
  image: "",
  images: [],
  highlights: [],
  description: "",
  status: "For Sale",
  bedrooms: 0,
  bathrooms: 0,
  parking: 0,
  amenities: [],
  latitude: 0,
  longitude: 0,
  createdAt: new Date().toISOString().slice(0, 10),
  projectName: "",
  developerName: "",
  reraStatus: "Not Registered",
  reraRegistrationNumber: "",
  reraAuthority: "",
  reraProjectUrl: "",
  reraVerificationStatus: "Unverified",
  reraLastVerifiedDate: null,
  possessionStatus: "",
  authorityApprovalStatus: "",
  verifiedListing: false,
  verifiedDeveloper: false,
  gatedSociety: false,
  parkingAvailable: false,
  securityCctv: false,
  roadFacing: false,
  cornerProperty: false,
});


async function fetchAll(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as PropertyRow[]).map(rowToProperty);
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<Property | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setIsAdmin(Boolean(data));
    })();
    return () => {
      active = false;
    };
  }, []);

  const list = useQuery({ queryKey: ["admin-properties"], queryFn: fetchAll });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Property removed");
      qc.invalidateQueries({ queryKey: ["admin-properties"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (isAdmin === false) {
    return (
      <Section>
        <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-border p-12 text-center">
          <h1 className="text-2xl">No admin access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This account is not allowed to manage listings. Sign in with the owner account.
          </p>
          <B variant="outline" className="mt-6" onClick={signOut}>
            Sign out
          </B>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1 className="mt-3 text-3xl">Manage properties</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Changes appear on the public website immediately.
          </p>
        </div>
        <div className="flex gap-3">
          <B variant="gold" onClick={() => setEditing(emptyProperty())}>
            <Plus className="size-4" /> Add property
          </B>
          <Link to="/admin/upcoming" className={btnStyles.outline}>
            Upcoming projects
          </Link>
          <B variant="outline" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </B>
        </div>
      </div>

      {editing ? (
        <PropertyForm
          key={editing.id || "new"}
          initial={editing}
          isNew={!list.data?.some((p) => p.id === editing.id)}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            qc.invalidateQueries({ queryKey: ["admin-properties"] });
          }}
        />
      ) : null}

      <div className="mt-10 grid gap-4">
        {list.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {list.error ? (
          <p className="text-sm text-destructive">{(list.error as Error).message}</p>
        ) : null}
        {list.data?.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-4"
          >
            <img
              src={p.image}
              alt={p.name}
              className="size-20 rounded-2xl object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <div className="min-w-[12rem] flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted-foreground">
                {p.location}, {p.city} · {p.type} · {p.price} · {p.status}
              </p>
            </div>
            <div className="flex gap-2">
              <B variant="outline" onClick={() => setEditing(p)}>
                <Pencil className="size-4" /> Edit
              </B>
              <B
                variant="outline"
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
            No properties yet. Add your first listing.
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function PropertyForm({
  initial,
  isNew,
  onClose,
  onSaved,
}: {
  initial: Property;
  isNew: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [p, setP] = useState<Property>(initial);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof Property>(k: K, v: Property[K]) => setP((prev) => ({ ...prev, [k]: v }));

  const listText = useMemo(
    () => ({
      highlights: p.highlights.join("\n"),
      amenities: p.amenities.join("\n"),
    }),
    [p.highlights, p.amenities],
  );

  const save = useMutation({
    mutationFn: async () => {
      const id = p.id || slugify(p.name);
      if (!id) throw new Error("Property needs a name");
      const row = propertyToRow({ ...p, id, image: p.image || p.images[0] || "" });
      const { error } = await supabase.from("properties").upsert(row as never);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success(isNew ? "Property added" : "Property updated");
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
        const path = `${slugify(p.name) || "property"}/${crypto.randomUUID()}.${ext}`;
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
        <h2 className="text-2xl">{isNew ? "New property" : `Edit — ${initial.name}`}</h2>
        <button type="button" onClick={onClose} aria-label="Close editor" className="rounded-full p-2 hover:bg-secondary">
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className={label}>
          Name
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
          Type
          <select className={field} value={p.type} onChange={(e) => set("type", e.target.value as Property["type"])}>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Status
          <select
            className={field}
            value={p.status}
            onChange={(e) => set("status", e.target.value as Property["status"])}
          >
            {["For Sale", "For Rent", "Sold"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Size (display)
          <input className={field} value={p.size} onChange={(e) => set("size", e.target.value)} placeholder="1450 sq.ft. / 3 BHK" />
        </label>
        <label className={label}>
          Size in sq.ft. (for filters)
          <input type="number" className={field} value={p.sizeSqft} onChange={(e) => set("sizeSqft", Number(e.target.value))} />
        </label>
        <label className={label}>
          Price (display)
          <input className={field} value={p.price} onChange={(e) => set("price", e.target.value)} placeholder="₹1.35 Crore" />
        </label>
        <label className={label}>
          Price in ₹ Lakh (for filters)
          <input type="number" className={field} value={p.priceValue} onChange={(e) => set("priceValue", Number(e.target.value))} />
        </label>
        <label className={label}>
          Bedrooms
          <input type="number" className={field} value={p.bedrooms} onChange={(e) => set("bedrooms", Number(e.target.value))} />
        </label>
        <label className={label}>
          Bathrooms
          <input type="number" className={field} value={p.bathrooms} onChange={(e) => set("bathrooms", Number(e.target.value))} />
        </label>
        <label className={label}>
          Parking
          <input type="number" className={field} value={p.parking} onChange={(e) => set("parking", Number(e.target.value))} />
        </label>
        <label className={label}>
          Latitude
          <input type="number" step="any" className={field} value={p.latitude} onChange={(e) => set("latitude", Number(e.target.value))} />
        </label>
        <label className={label}>
          Longitude
          <input type="number" step="any" className={field} value={p.longitude} onChange={(e) => set("longitude", Number(e.target.value))} />
        </label>
      </div>

      <label className={`${label} mt-4`}>
        Description
        <textarea
          className={`${field} min-h-32`}
          value={p.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Highlights (one per line)
          <textarea
            className={`${field} min-h-28`}
            value={listText.highlights}
            onChange={(e) => set("highlights", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
          />
        </label>
        <label className={label}>
          Amenities (one per line)
          <textarea
            className={`${field} min-h-28`}
            value={listText.amenities}
            onChange={(e) => set("amenities", e.target.value.split("\n").map((v) => v.trim()).filter(Boolean))}
          />
        </label>
      </div>

      <fieldset className="mt-8 rounded-3xl border border-border p-5">
        <legend className="px-2 text-sm font-semibold">RERA & verification</legend>
        <p className="text-xs text-muted-foreground">
          The RERA badge only shows publicly when status is “Registered” and a registration number is filled in.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className={label}>
            Project name
            <input className={field} value={p.projectName} onChange={(e) => set("projectName", e.target.value)} />
          </label>
          <label className={label}>
            Developer / promoter
            <input className={field} value={p.developerName} onChange={(e) => set("developerName", e.target.value)} />
          </label>
          <label className={label}>
            RERA status
            <select
              className={field}
              value={p.reraStatus}
              onChange={(e) => set("reraStatus", e.target.value as Property["reraStatus"])}
            >
              {reraStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            RERA registration no.
            <input
              className={field}
              value={p.reraRegistrationNumber}
              onChange={(e) => set("reraRegistrationNumber", e.target.value)}
              placeholder="UPRERAPRJ123456"
            />
          </label>
          <label className={label}>
            RERA authority
            <input
              className={field}
              value={p.reraAuthority}
              onChange={(e) => set("reraAuthority", e.target.value)}
              placeholder="UP RERA"
            />
          </label>
          <label className={label}>
            Official RERA project URL
            <input
              className={field}
              type="url"
              value={p.reraProjectUrl}
              onChange={(e) => set("reraProjectUrl", e.target.value)}
              placeholder="https://up-rera.in/..."
            />
          </label>
          <label className={label}>
            Verification status
            <select
              className={field}
              value={p.reraVerificationStatus}
              onChange={(e) => set("reraVerificationStatus", e.target.value as Property["reraVerificationStatus"])}
            >
              {reraVerificationStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Last verified on
            <input
              type="date"
              className={field}
              value={p.reraLastVerifiedDate ?? ""}
              onChange={(e) => set("reraLastVerifiedDate", e.target.value || null)}
            />
          </label>
          <label className={label}>
            Possession status
            <select
              className={field}
              value={p.possessionStatus}
              onChange={(e) => set("possessionStatus", e.target.value)}
            >
              <option value="">Not specified</option>
              {possessionStatuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className={label}>
            Authority approval
            <input
              className={field}
              value={p.authorityApprovalStatus}
              onChange={(e) => set("authorityApprovalStatus", e.target.value)}
              placeholder="ADA approved layout"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["verifiedListing", "Verified listing"],
              ["verifiedDeveloper", "Verified developer"],
              ["gatedSociety", "Gated society"],
              ["parkingAvailable", "Parking"],
              ["securityCctv", "Security / CCTV"],
              ["roadFacing", "Road facing"],
              ["cornerProperty", "Corner property"],
            ] as const
          ).map(([key, text]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4 accent-[hsl(var(--gold,45_60%_50%))]"
                checked={p[key]}
                onChange={(e) => set(key, e.target.checked)}
              />
              {text}
            </label>
          ))}
        </div>
      </fieldset>



      <div className="mt-6">
        <p className="text-sm font-medium">Images</p>
        <p className="mt-1 text-xs text-muted-foreground">
          The first image is used as the card photo. Upload files or paste an image URL.
        </p>

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
          <AddImageUrl onAdd={(url) => setP((prev) => ({ ...prev, images: [...prev.images, url], image: prev.image || url }))} />
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <B type="submit" variant="gold" disabled={save.isPending || uploading}>
          {save.isPending ? "Saving…" : "Save property"}
        </B>
        <B type="button" variant="outline" onClick={onClose}>
          Cancel
        </B>
      </div>
    </form>
  );
}

function AddImageUrl({ onAdd }: { onAdd: (url: string) => void }) {
  const [url, setUrl] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        className="rounded-full border border-input bg-card px-4 py-2 text-sm outline-none focus:border-gold"
        placeholder="https://image-url.jpg"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <B
        type="button"
        variant="outline"
        onClick={() => {
          if (!url.trim()) return;
          onAdd(url.trim());
          setUrl("");
        }}
      >
        Add
      </B>
    </div>
  );
}
