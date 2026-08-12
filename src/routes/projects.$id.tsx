import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A, btnStyles } from "@/components/site/buttons";
import { projects, site, waLink } from "@/data/site";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.project;
    if (!p) return {};
    const title = `${p.name}, ${p.location} ${p.city} — ${p.type} Project | Mohit Gaur`;
    const description = p.description.slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `/projects/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/projects/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.name,
            description: p.description,
            url: `/projects/${p.id}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: p.location,
              addressLocality: p.city,
              addressCountry: "IN",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: p.price,
              availability: "https://schema.org/InStock",
            },
            amenityFeature: p.highlights.map((h) => ({
              "@type": "LocationFeatureSpecification",
              name: h,
              value: true,
            })),
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
              { "@type": "ListItem", position: 2, name: "Projects", item: "/projects" },
              { "@type": "ListItem", position: 3, name: p.name, item: `/projects/${p.id}` },
            ],
          }),
        },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project: p } = Route.useLoaderData();

  return (
    <>
      <Section>
        <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/projects" className="hover:text-gold">
            Projects
          </Link>{" "}
          / <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="mt-8 max-w-2xl">
          <span className="rounded-full bg-accent px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            {p.status}
          </span>
          <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {p.location}, {p.city} · {p.type}
          </p>
          <span className="gold-rule mt-5" />
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{p.description}</p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {p.gallery.map((g: string, i: number) => (
            <img
              key={g + i}
              src={g}
              alt={`${p.name}, ${p.location} ${p.city} — project image ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              width={1200}
              height={900}
              className="h-56 w-full rounded-3xl object-cover"
            />
          ))}
        </div>

        <dl className="mt-10 grid gap-6 border-y border-border py-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Sizes</dt>
            <dd className="mt-1 font-medium">{p.sizes}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Price</dt>
            <dd className="mt-1 font-display text-lg text-gold">{p.price}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium">{p.status}</dd>
          </div>
        </dl>

        <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {p.highlights.map((h: string) => (
            <li key={h} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap gap-3">
          <A
            href={waLink(`Hello Mohit, please share details about the project ${p.name}, ${p.location}, ${p.city}.`)}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
          >
            Enquire on WhatsApp
          </A>
          <Link to="/contact" search={{ property: p.name }} className={btnStyles.gold}>
            Book a Site Visit
          </Link>
        </div>
      </Section>

      <CtaBand title={`Interested in ${p.name}?`} />
    </>
  );
}
