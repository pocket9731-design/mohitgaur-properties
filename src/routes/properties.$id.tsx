import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  MapPin,
  Maximize2,
  IndianRupee,
  Building2,
  BedDouble,
  Bath,
  Car,
  BadgeCheck,
  Hash,
  Check,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { PropertyCard } from "@/components/site/PropertyCard";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { A, btnStyles } from "@/components/site/buttons";
import { site, agent, waLink } from "@/data/site";
import { ShareButton } from "@/components/site/ShareProperty";
import { fetchProperties } from "@/lib/properties.functions";
import { similarProperties } from "@/lib/property-mapper";
import profileImg from "@/assets/profile-mohit.jpg";

export const Route = createFileRoute("/properties/$id")({
  loader: async ({ params }) => {
    const all = await fetchProperties();
    const property = all.find((p) => p.id === params.id);
    if (!property) throw notFound();
    return { property, similar: similarProperties(all, property) };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.property;
    if (!p) {
      return {
        meta: [
          { title: "Property Not Found | Mohit Gaur" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${p.name}, ${p.location} ${p.city} — ${p.type} at ${p.price} | Mohit Gaur`;
    const description = p.description.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `https://mohitgaur-properties.lovable.app/properties/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `https://mohitgaur-properties.lovable.app/properties/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.name,
            description: p.description,
            url: `https://mohitgaur-properties.lovable.app/properties/${p.id}`,
            datePosted: p.createdAt,
            numberOfBedrooms: p.bedrooms || undefined,
            numberOfBathroomsTotal: p.bathrooms || undefined,
            floorSize: { "@type": "QuantitativeValue", value: p.sizeSqft, unitCode: "FTK" },
            geo: { "@type": "GeoCoordinates", latitude: p.latitude, longitude: p.longitude },
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
              { "@type": "ListItem", position: 1, name: "Home", item: "https://mohitgaur-properties.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Properties", item: "https://mohitgaur-properties.lovable.app/properties" },
              { "@type": "ListItem", position: 3, name: p.name, item: `https://mohitgaur-properties.lovable.app/properties/${p.id}` },
            ],
          }),
        },
      ],
    };
  },
  component: PropertyDetail,
  notFoundComponent: PropertyNotFound,
  errorComponent: PropertyNotFound,
});

function PropertyNotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border p-12 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-3xl">Property Not Found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This listing may have been sold or the link is incorrect. Browse all live properties instead.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/properties" className={btnStyles.gold}>
            View All Properties
          </Link>
          <Link to="/contact" className={btnStyles.outline}>
            Contact Mohit
          </Link>
        </div>
      </div>
    </Section>
  );
}

function PropertyDetail() {
  const { property: p, similar } = Route.useLoaderData();

  const enquiry = waLink(
    `Hello Mohit, I am interested in ${p.name} (${p.location}, ${p.city}) — ${p.price}. Please share details.`,
  );

  const facts = [
    { icon: Building2, label: "Type", value: p.type },
    { icon: MapPin, label: "Location", value: `${p.location}, ${p.city}` },
    { icon: Maximize2, label: "Area", value: p.size },
    { icon: IndianRupee, label: "Price", value: p.price },
    { icon: BedDouble, label: "Bedrooms", value: p.bedrooms ? `${p.bedrooms}` : "—" },
    { icon: Bath, label: "Bathrooms", value: p.bathrooms ? `${p.bathrooms}` : "—" },
    { icon: Car, label: "Parking", value: `${p.parking}` },
    { icon: BadgeCheck, label: "Status", value: p.status },
    { icon: Hash, label: "Property ID", value: p.id.toUpperCase() },
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
          <PropertyGallery images={p.images} alt={`${p.name} — ${p.type} in ${p.location}, ${p.city}`} />

          <div>
            <p className="eyebrow">{p.type}</p>
            <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {p.location}, {p.city}
            </p>
            <p className="mt-4 font-display text-3xl text-gold">{p.price}</p>

            <dl className="mt-8 grid grid-cols-2 gap-5 border-y border-border py-6 text-sm sm:grid-cols-3">
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
              <ShareButton
                url={`${typeof window !== "undefined" ? window.location.origin : "https://mohitgaur.online"}/properties/${p.id}`}
                title={`${p.name} — ${p.type} in ${p.location}, ${p.city}`}
                detail={`${p.price} · ${p.size}`}
              />
              <Link to="/contact" search={{ property: p.name }} className={btnStyles.gold}>
                Contact Agent
              </Link>
              <Link to="/contact" search={{ property: p.name }} className={btnStyles.primary}>
                Schedule a Visit
              </Link>
              <A href={`tel:${site.phone}`} variant="outline">
                Call Now
              </A>
              <A href={enquiry} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                Send Enquiry
              </A>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl">Description</h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.description}</p>

            <h2 className="mt-10 text-2xl">Features & Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {p.amenities.map((a: string) => (
                <li key={a} className="flex items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
                  <Check className="size-4 text-gold" /> {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl">Location</h2>
            <div className="mt-4 overflow-hidden rounded-3xl border border-border">
              <iframe
                title={`Map of ${p.name}, ${p.location}, ${p.city}`}
                src={`https://www.google.com/maps?q=${p.latitude},${p.longitude}&z=14&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-4">
                <img
                  src={profileImg}
                  alt={`${agent.name} — ${agent.role}`}
                  width={96}
                  height={96}
                  className="size-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-xl">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-2 text-sm">
                <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-gold">
                  <Phone className="size-4" /> {agent.phoneDisplay}
                </a>
                <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-gold">
                  <Mail className="size-4" /> {agent.email}
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/contact" search={{ property: p.name }} className={`${btnStyles.gold} px-5 py-2.5`}>
                  Contact Agent
                </Link>
                <A href={enquiry} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="px-5 py-2.5">
                  <MessageCircle className="size-4" /> WhatsApp
                </A>
              </div>
            </div>
          </div>
        </div>

        {similar.length ? (
          <div className="mt-16">
            <SectionHeading eyebrow="Similar Properties" title="You may also like" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <PropertyCard key={s.id} p={s} />
              ))}
            </div>
          </div>
        ) : null}
      </Section>

      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden">
        <div className="flex gap-2">
          <A href={`tel:${site.phone}`} variant="gold" className="flex-1 px-4 py-3">
            Call Now
          </A>
          <A href={enquiry} target="_blank" rel="noopener noreferrer" variant="whatsapp" className="flex-1 px-4 py-3">
            WhatsApp
          </A>
        </div>
      </div>

      <CtaBand title={`Want a site visit at ${p.name}?`} />
    </>
  );
}
