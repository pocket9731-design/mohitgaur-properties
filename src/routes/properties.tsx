import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { PropertyCard } from "@/components/site/PropertyCard";
import { CtaBand } from "@/components/site/CtaBand";
import { properties, propertyTypes } from "@/data/site";

const title = "Property for Sale in Agra | Plots, Villas & Flats — Mohit Gaur";
const description =
  "Browse verified plots, villas, flats, commercial and investment properties for sale in Agra, Noida, Gurugram, Lucknow and Jaipur. Filter by location, type, budget and size.";

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Properties,
});

const budgets = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under ₹50 Lakh", min: 0, max: 50 },
  { label: "₹50 Lakh – ₹1 Cr", min: 50, max: 100 },
  { label: "₹1 Cr – ₹2 Cr", min: 100, max: 200 },
  { label: "Above ₹2 Cr", min: 200, max: Infinity },
];

const sizes = [
  { label: "Any size", min: 0 },
  { label: "1000+ sq.ft.", min: 1000 },
  { label: "1500+ sq.ft.", min: 1500 },
  { label: "2500+ sq.ft.", min: 2500 },
];

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

function Properties() {
  const cities = useMemo(() => Array.from(new Set(properties.map((p) => p.city))).sort(), []);
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState(0);
  const [size, setSize] = useState(0);

  const filtered = properties.filter(
    (p) =>
      (!city || p.city === city) &&
      (!type || p.type === type) &&
      p.priceValue > budgets[budget]!.min - 0.001 &&
      p.priceValue <= budgets[budget]!.max &&
      p.sizeSqft >= sizes[size]!.min,
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

        <div className="mt-10 grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-medium">
            Location
            <select className={field} value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">All locations</option>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Property Type
            <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              {propertyTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Budget
            <select className={field} value={budget} onChange={(e) => setBudget(Number(e.target.value))}>
              {budgets.map((b, i) => (
                <option key={b.label} value={i}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Size
            <select className={field} value={size} onChange={(e) => setSize(Number(e.target.value))}>
              {sizes.map((s, i) => (
                <option key={s.label} value={i}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing {filtered.length} of {properties.length} properties
        </p>

        {filtered.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <PropertyCard key={p.id + p.city} p={p} />
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
