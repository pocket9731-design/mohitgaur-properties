import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, ShieldCheck, X, Bookmark, Calculator, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Section, SectionHeading } from "@/components/site/Section";
import { PropertyCard } from "@/components/site/PropertyCard";
import { CtaBand } from "@/components/site/CtaBand";
import { ReraTooltip } from "@/components/site/Rera";
import { propertyTypes, isReraRegistered, type Property } from "@/data/site";
import { fetchProperties } from "@/lib/properties.functions";

const title = "RERA Registered Property for Sale in Agra | Plots, Villas & Flats — Mohit Gaur";
const description =
  "Filter RERA Registered properties for sale in Agra, Noida, Gurugram, Lucknow and Jaipur. Verified listings with RERA registration number, developer details, price, size and possession status.";

export const Route = createFileRoute("/properties/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/properties" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/properties" }],
  }),
  loader: () => fetchProperties(),
  component: Properties,
});

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "grid gap-1.5 text-sm font-medium";

type ReraFilter = "all" | "registered" | "not-registered";

type Filters = {
  q: string;
  rera: ReraFilter;
  city: string;
  locality: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
  approvals: string[];
  features: string[];
  sort: string;
};

const emptyFilters: Filters = {
  q: "",
  rera: "all",
  city: "",
  locality: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  minSize: "",
  maxSize: "",
  approvals: [],
  features: [],
  sort: "relevant",
};

const approvalOptions = [
  { key: "rera", text: "RERA Registered" },
  { key: "authority", text: "Authority Approved" },
  { key: "listing", text: "Verified Listing" },
  { key: "developer", text: "Verified Developer" },
];

const featureOptions = [
  { key: "ready", text: "Ready to Move" },
  { key: "under-construction", text: "Under Construction" },
  { key: "gated", text: "Gated Society" },
  { key: "parking", text: "Parking" },
  { key: "cctv", text: "Security / CCTV" },
  { key: "road", text: "Road Facing" },
  { key: "corner", text: "Corner Property" },
];

const featureMatch: Record<string, (p: Property) => boolean> = {
  ready: (p) => p.possessionStatus === "Ready to Move",
  "under-construction": (p) => p.possessionStatus === "Under Construction",
  gated: (p) => p.gatedSociety,
  parking: (p) => p.parkingAvailable || p.parking > 0,
  cctv: (p) => p.securityCctv,
  road: (p) => p.roadFacing,
  corner: (p) => p.cornerProperty,
};

const approvalMatch: Record<string, (p: Property) => boolean> = {
  rera: (p) => isReraRegistered(p),
  authority: (p) => p.authorityApprovalStatus.trim().length > 0,
  listing: (p) => p.verifiedListing,
  developer: (p) => p.verifiedDeveloper,
};

const STORAGE_KEY = "mg-property-filters";

function Properties() {
  const properties = Route.useLoaderData();
  const [f, setF] = useState<Filters>(emptyFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const toggle = (k: "approvals" | "features", v: string) =>
    setF((prev) => ({
      ...prev,
      [k]: prev[k].includes(v) ? prev[k].filter((x) => x !== v) : [...prev[k], v],
    }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setF({ ...emptyFilters, ...(JSON.parse(saved) as Partial<Filters>) });
    } catch {
      /* ignore */
    }
  }, []);

  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), [properties]);
  const localities = useMemo(
    () =>
      Array.from(
        new Set(properties.filter((p) => !f.city || p.city === f.city).map((p) => p.location).filter(Boolean)),
      ).sort(),
    [properties, f.city],
  );

  const reraCount = useMemo(() => properties.filter(isReraRegistered).length, [properties]);

  const filtered = useMemo(() => {
    const term = f.q.trim().toLowerCase();
    const min = f.minPrice ? Number(f.minPrice) : 0;
    const max = f.maxPrice ? Number(f.maxPrice) : Infinity;
    const minS = f.minSize ? Number(f.minSize) : 0;
    const maxS = f.maxSize ? Number(f.maxSize) : Infinity;

    const list = properties.filter((p) => {
      const registered = isReraRegistered(p);
      if (f.rera === "registered" && !registered) return false;
      if (f.rera === "not-registered" && registered) return false;
      if (!f.approvals.every((k) => approvalMatch[k]?.(p))) return false;
      if (!f.features.every((k) => featureMatch[k]?.(p))) return false;

      const matchesTerm =
        !term ||
        [p.name, p.location, p.city, p.type, p.projectName, p.developerName].some((v) =>
          (v || "").toLowerCase().includes(term),
        );

      return (
        matchesTerm &&
        (!f.city || p.city === f.city) &&
        (!f.locality || p.location === f.locality) &&
        (!f.type || p.type === f.type) &&
        p.priceValue >= min &&
        p.priceValue <= max &&
        p.sizeSqft >= minS &&
        p.sizeSqft <= maxS
      );
    });

    if (f.sort === "price-asc") return [...list].sort((a, b) => a.priceValue - b.priceValue);
    if (f.sort === "price-desc") return [...list].sort((a, b) => b.priceValue - a.priceValue);
    if (f.sort === "newest")
      return [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
    return [...list].sort((a, b) => Number(isReraRegistered(b)) - Number(isReraRegistered(a)));
  }, [properties, f]);

  const chips: { label: string; clear: () => void }[] = [];
  if (f.rera === "registered") chips.push({ label: "RERA Registered", clear: () => set("rera", "all") });
  if (f.rera === "not-registered") chips.push({ label: "Not RERA Registered", clear: () => set("rera", "all") });
  if (f.q) chips.push({ label: `“${f.q}”`, clear: () => set("q", "") });
  if (f.city) chips.push({ label: f.city, clear: () => set("city", "") });
  if (f.locality) chips.push({ label: f.locality, clear: () => set("locality", "") });
  if (f.type) chips.push({ label: f.type, clear: () => set("type", "") });
  if (f.minPrice || f.maxPrice)
    chips.push({
      label: `₹${f.minPrice || "0"}L–₹${f.maxPrice || "∞"}L`,
      clear: () => setF((p) => ({ ...p, minPrice: "", maxPrice: "" })),
    });
  if (f.minSize || f.maxSize)
    chips.push({
      label: `${f.minSize || "0"}–${f.maxSize || "∞"} sq.ft.`,
      clear: () => setF((p) => ({ ...p, minSize: "", maxSize: "" })),
    });
  for (const a of f.approvals) {
    const text = approvalOptions.find((o) => o.key === a)?.text ?? a;
    chips.push({ label: text, clear: () => toggle("approvals", a) });
  }
  for (const a of f.features) {
    const text = featureOptions.find((o) => o.key === a)?.text ?? a;
    chips.push({ label: text, clear: () => toggle("features", a) });
  }

  const showingRera = f.rera === "registered" || f.approvals.includes("rera");

  const reraTabs: { value: ReraFilter; text: string }[] = [
    { value: "registered", text: "✅ RERA Registered" },
    { value: "not-registered", text: "❌ Not RERA Registered" },
    { value: "all", text: "🔍 All Properties" },
  ];

  const filterFields = (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className={label}>
          City
          <select
            className={field}
            value={f.city}
            onChange={(e) => setF((p) => ({ ...p, city: e.target.value, locality: "" }))}
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Locality / landmark
          <select className={field} value={f.locality} onChange={(e) => set("locality", e.target.value)}>
            <option value="">All localities</option>
            {localities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Property type
          <select className={field} value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option value="">All types</option>
            {propertyTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className={label}>
          Sort by
          <select className={field} value={f.sort} onChange={(e) => set("sort", e.target.value)}>
            <option value="relevant">Most relevant</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </label>
        <label className={label}>
          Min price (₹ Lakh)
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className={field}
            value={f.minPrice}
            onChange={(e) => set("minPrice", e.target.value)}
            placeholder="e.g. 20"
          />
        </label>
        <label className={label}>
          Max price (₹ Lakh)
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className={field}
            value={f.maxPrice}
            onChange={(e) => set("maxPrice", e.target.value)}
            placeholder="e.g. 50"
          />
        </label>
        <label className={label}>
          Min size (sq.ft.)
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className={field}
            value={f.minSize}
            onChange={(e) => set("minSize", e.target.value)}
          />
        </label>
        <label className={label}>
          Max size (sq.ft.)
          <input
            type="number"
            min={0}
            inputMode="numeric"
            className={field}
            value={f.maxSize}
            onChange={(e) => set("maxSize", e.target.value)}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium">Approval &amp; verification</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {approvalOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => toggle("approvals", o.key)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  f.approvals.includes(o.key)
                    ? "border-emerald-600 bg-emerald-600/10 font-semibold text-emerald-700"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Other features</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {featureOptions.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => toggle("features", o.key)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  f.features.includes(o.key)
                    ? "border-gold bg-gold/10 font-semibold text-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Properties"
          title="Verified properties for sale"
          subtitle="Residential plots, villas, flats, commercial and investment options — each personally inspected before it reaches this page."
        />

        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-600/25 bg-emerald-600/5 px-4 py-3 text-sm">
          <ShieldCheck className="size-4 text-emerald-700" />
          <span className="font-medium">Buy with confidence — filter and discover RERA Registered properties.</span>
          <span className="text-muted-foreground">
            {reraCount} RERA Registered of {properties.length} listings
          </span>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold">RERA status</p>
            <ReraTooltip />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {reraTabs.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set("rera", t.value)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  f.rera === t.value
                    ? "border-emerald-600 bg-emerald-600 font-semibold text-primary-foreground"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {t.text}
              </button>
            ))}
          </div>

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={f.q}
              onChange={(e) => set("q", e.target.value)}
              placeholder="Search location, project or developer…"
              aria-label="Search properties"
              className={`${field} pl-11`}
            />
          </div>

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold md:hidden"
          >
            <SlidersHorizontal className="size-4" /> Filters
            {chips.length ? (
              <span className="rounded-full bg-gold px-2 text-xs text-primary-foreground">{chips.length}</span>
            ) : null}
          </button>

          <div className="mt-5 hidden md:block">{filterFields}</div>
        </div>

        {chips.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c.label}
                type="button"
                onClick={c.clear}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs text-secondary-foreground"
              >
                {c.label} <X className="size-3" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} {showingRera ? "RERA Registered " : ""}
            {filtered.length === 1 ? "property" : "properties"}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
                toast.success("Filters saved on this device");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <Bookmark className="size-3.5" /> Save filters
            </button>
            <button
              type="button"
              onClick={() => {
                setF(emptyFilters);
                localStorage.removeItem(STORAGE_KEY);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
            >
              <SlidersHorizontal className="size-3.5" /> Clear all filters
            </button>
          </div>
        </div>

        {filtered.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="text-base">No properties match these filters.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell me your requirement — I source off-market options regularly.
            </p>
          </div>
        )}

        <div className="mt-10 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 to-gold/5 p-6 sm:p-8">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-primary-foreground">
                <Calculator className="size-6" />
              </span>
              <div>
                <h3 className="font-display text-xl">Plan your property budget</h3>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Estimate your monthly EMI before you shortlist. Enter property price, down payment, interest rate
                  and tenure to see what fits your budget.
                </p>
              </div>
            </div>
            <Link
              to="/emi-calculator"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open EMI Calculator <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      {sheetOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end bg-foreground/50 md:hidden"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-card p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setSheetOpen(false)} className="rounded-full p-2 hover:bg-secondary">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4">{filterFields}</div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setF(emptyFilters)}
                className="flex-1 rounded-full border border-border px-4 py-3 text-sm"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <CtaBand
        title="Looking for something specific?"
        subtitle="Share your budget, location and purpose. You will get a shortlist of 3–5 genuine options."
      />
    </>
  );
}
