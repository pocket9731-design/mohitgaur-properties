import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { PropertyCard } from "@/components/site/PropertyCard";
import { CtaBand } from "@/components/site/CtaBand";
import { properties, propertyTypes } from "@/data/site";

const title = "Property for Sale in Agra | Plots, Villas & Flats — Mohit Gaur";
const description =
  "Browse verified plots, villas, flats, commercial and investment properties for sale in Agra, Noida, Gurugram, Lucknow and Jaipur. Filter by location, type, budget, bedrooms and size.";

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
  component: Properties,
});

const areas = [
  { label: "Any area", min: 0 },
  { label: "1000+ sq.ft.", min: 1000 },
  { label: "1500+ sq.ft.", min: 1500 },
  { label: "2500+ sq.ft.", min: 2500 },
];

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

const label = "grid gap-1.5 text-sm font-medium";

function Properties() {
  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), []);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [area, setArea] = useState(0);
  const [sort, setSort] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : Infinity;

    const list = properties.filter((p) => {
      const matchesTerm =
        !term ||
        [p.name, p.location, p.city, p.type].some((v) => v.toLowerCase().includes(term));
      return (
        matchesTerm &&
        (!city || p.city === city) &&
        (!type || p.type === type) &&
        p.priceValue >= min &&
        p.priceValue <= max &&
        (!beds || p.bedrooms >= Number(beds)) &&
        (!baths || p.bathrooms >= Number(baths)) &&
        p.sizeSqft >= areas[area]!.min
      );
    });

    if (sort === "asc") return [...list].sort((a, b) => a.priceValue - b.priceValue);
    if (sort === "desc") return [...list].sort((a, b) => b.priceValue - a.priceValue);
    return list;
  }, [q, city, type, minPrice, maxPrice, beds, baths, area, sort]);

  const reset = () => {
    setQ("");
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
    setBeds("");
    setBaths("");
    setArea(0);
    setSort("");
  };

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Properties"
          title="Verified properties for sale"
          subtitle="Residential plots, villas, flats, commercial and investment options — each personally inspected before it reaches this page."
        />

        <div className="mt-10 rounded-3xl border border-border bg-card p-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by property name or location…"
              aria-label="Search properties"
              className={`${field} pl-11`}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className={label}>
              Location
              <select className={field} value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All locations</option>
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Property Type
              <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                {propertyTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className={label}>
              Min Price (₹ Lakh)
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="e.g. 30"
                className={field}
              />
            </label>
            <label className={label}>
              Max Price (₹ Lakh)
              <input
                type="number"
                min={0}
                inputMode="numeric"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 200"
                className={field}
              />
            </label>
            <label className={label}>
              Bedrooms
              <select className={field} value={beds} onChange={(e) => setBeds(e.target.value)}>
                <option value="">Any</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}+ Beds
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Bathrooms
              <select className={field} value={baths} onChange={(e) => setBaths(e.target.value)}>
                <option value="">Any</option>
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}+ Baths
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Area
              <select className={field} value={area} onChange={(e) => setArea(Number(e.target.value))}>
                {areas.map((a, i) => (
                  <option key={a.label} value={i}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={label}>
              Sort by price
              <select className={field} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Recommended</option>
                <option value="asc">Low → High</option>
                <option value="desc">High → Low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {properties.length} properties
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <SlidersHorizontal className="size-3.5" /> Reset filters
          </button>
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
      </Section>

      <CtaBand
        title="Looking for something specific?"
        subtitle="Share your budget, location and purpose. You will get a shortlist of 3–5 genuine options."
      />
    </>
  );
}
