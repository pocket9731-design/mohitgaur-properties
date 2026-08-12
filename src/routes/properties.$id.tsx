import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { MapPin, Maximize2, IndianRupee, Building2 } from "lucide-react";
import { Section } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A, btnStyles } from "@/components/site/buttons";
import { properties, site, waLink } from "@/data/site";

export const Route = createFileRoute("/properties/$id")({
  loader: ({ params }) => {
    const property = properties.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.property;
    if (!p) return {};
    const title = `${p.name}, ${p.location} ${p.city} — ${p.type} at ${p.price} | Mohit Gaur`;
    const description = p.description.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/properties/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/properties/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.name,
            description: p.description,
            url: `/properties/${p.id}`,
            datePosted: "2026-01-01",
            floorSize: { "@type": "QuantitativeValue", value: p.sizeSqft, unitCode: "FTK" },
            address: {
              "@type": "PostalAddress",
              streetAddress: p.location,
              addressLocality: p.city,
              addressCountry: "IN",
            },
            offers: {
              "@type": "Offer",
              price: p.priceValue * 100000,
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            provider: {
              "@type": "RealEstateAgent",
              name: site.name,
              telephone: site.phone,
              email: site.email,
              areaServed: p.city,
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: "Properties", item: "/properties" },
              { "@type": "ListItem", position: 3, name: p.name, item: `/properties/${p.id}` },
            ],
          }),
        },
      ],
    };
  },
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property: p } = Route.useLoaderData();

  const facts = [
    { icon: Building2, label: "Type", value: p.type },
    { icon: MapPin, label: "Location", value: `${p.location}, ${p.city}` },
    { icon: Maximize2, label: "Size", value: p.size },
    { icon: IndianRupee, label: "Price", value: p.price },
  ];

  return (
    <>
      <Section>
        <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/properties" className="hover:text-gold">
            Properties
          </Link>{" "}
          / <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <img
            src={p.image}
            alt={`${p.name} — ${p.type} in ${p.location}, ${p.city}`}
            width={1200}
            height={900}
            className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-card)]"
          />

          <div>
            <p className="eyebrow">{p.type}</p>
            <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {p.location}, {p.city}
            </p>
            <p className="mt-4 font-display text-3xl text-gold">{p.price}</p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{p.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-border py-6 text-sm">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    <f.icon className="size-3.5" /> {f.label}
                  </dt>
                  <dd className="mt-1 font-medium">{f.value}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 flex flex-wrap gap-2">
              {p.highlights.map((h: string) => (
                <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <A
                href={waLink(`Hello Mohit, I am interested in ${p.name} (${p.location}, ${p.city}) — ${p.price}. Please share details.`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
              >
                Enquire on WhatsApp
              </A>
              <Link to="/contact" search={{ property: p.name }} className={btnStyles.gold}>
                Book a Site Visit
              </Link>
              <A href={`tel:${site.phone}`} variant="outline">
                Call {site.phoneDisplay}
              </A>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand title={`Want a site visit at ${p.name}?`} />
    </>
  );
}
