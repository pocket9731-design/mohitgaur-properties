import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClock, MapPin, Ruler, IndianRupee, Check, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { PropertyGallery } from "@/components/site/PropertyGallery";
import { ProjectEnquiryForm } from "@/components/site/ProjectEnquiryForm";
import { A, btnStyles } from "@/components/site/buttons";
import { fetchUpcomingProjects } from "@/lib/upcoming.functions";
import { site, waLink } from "@/data/site";

const upcomingQuery = queryOptions({
  queryKey: ["upcoming-projects"],
  queryFn: () => fetchUpcomingProjects(),
});

const BASE = "https://mohitgaur-properties.lovable.app";

export const Route = createFileRoute("/upcoming-projects/$id")({
  loader: async ({ context, params }) => {
    const projects = await context.queryClient.ensureQueryData(upcomingQuery);
    const project = projects.find((p) => p.id === params.id);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ params, loaderData }) => {
    const p = loaderData?.project;
    if (!p) return {};
    const title = `${p.name}, ${p.location} ${p.city} — Upcoming ${p.type} | Mohit Gaur`;
    const description = (p.description || p.overview).slice(0, 158);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: `${BASE}/upcoming-projects/${params.id}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `${BASE}/upcoming-projects/${params.id}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            name: p.name,
            description: p.description || p.overview,
            url: `${BASE}/upcoming-projects/${p.id}`,
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
              availability: "https://schema.org/PreOrder",
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
        ...(p.faqs.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: p.faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  errorComponent: () => (
    <Section>
      <p className="text-sm text-muted-foreground">Could not load this project. Please try again.</p>
    </Section>
  ),
  notFoundComponent: () => (
    <Section>
      <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-border p-12 text-center">
        <h1 className="text-2xl">Project Not Found</h1>
        <p className="mt-3 text-sm text-muted-foreground">This project may have launched or been removed.</p>
        <Link to="/upcoming-projects" className={`${btnStyles.gold} mt-6`}>
          See all upcoming projects
        </Link>
      </div>
    </Section>
  ),
  component: UpcomingProjectDetail,
});

function UpcomingProjectDetail() {
  const { id } = Route.useParams();
  const { data: projects } = useSuspenseQuery(upcomingQuery);
  const p = projects.find((x) => x.id === id) ?? Route.useLoaderData().project;

  const wa = waLink(`Hello Mohit, please share complete details about the upcoming project ${p.name}, ${p.location}, ${p.city}.`);

  return (
    <>
      <Section>
        <nav className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/upcoming-projects" className="hover:text-gold">
            Upcoming Projects
          </Link>{" "}
          / <span className="text-foreground">{p.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <PropertyGallery images={p.images} alt={`${p.name}, ${p.location} ${p.city}`} />
          </div>

          <div>
            <span className="rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
              {p.status}
            </span>
            <h1 className="mt-4 text-3xl leading-tight sm:text-4xl">{p.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4 text-gold" />
              {p.location}, {p.city} · {p.type}
            </p>
            <span className="gold-rule mt-5" />

            <dl className="mt-6 grid gap-4 border-y border-border py-5 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <IndianRupee className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Expected price</dt>
                  <dd className="mt-1 font-display text-lg text-gold">{p.price || "On request"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Ruler className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Available sizes</dt>
                  <dd className="mt-1 font-medium">{p.sizes || "Multiple options"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarClock className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Expected launch</dt>
                  <dd className="mt-1 font-medium">{p.expectedLaunch || "To be announced"}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Status</dt>
                  <dd className="mt-1 font-medium">{p.status}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap gap-3">
              <A href={wa} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                WhatsApp Enquiry
              </A>
              <A href={`tel:${site.phone}`} variant="outline">
                <Phone className="size-4" /> {site.phoneDisplay}
              </A>
              <a href="#get-details" className={btnStyles.gold}>
                Get Complete Details
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Project overview</h2>
            <span className="gold-rule mt-4" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{p.overview || p.description}</p>
          </div>
          <div>
            <h2 className="text-2xl">Location &amp; connectivity</h2>
            <span className="gold-rule mt-4" />
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {p.connectivity || `${p.location}, ${p.city}.`}
            </p>
            <iframe
              title={`Map of ${p.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${p.location}, ${p.city}`)}&output=embed`}
              loading="lazy"
              className="mt-6 h-64 w-full rounded-3xl border border-border"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          {p.highlights.length ? (
            <div>
              <h2 className="text-2xl">Key highlights</h2>
              <span className="gold-rule mt-4" />
              <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground">
                {p.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {p.amenities.length ? (
            <div>
              <h2 className="text-2xl">Amenities</h2>
              <span className="gold-rule mt-4" />
              <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {p.timeline.length ? (
          <div className="mt-14">
            <h2 className="text-2xl">Expected launch timeline</h2>
            <span className="gold-rule mt-4" />
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {p.timeline.map((t, i) => (
                <li key={t} className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <span className="font-display text-sm text-gold">Step {i + 1}</span>
                  <p className="mt-2 text-sm text-muted-foreground">{t}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {p.faqs.length ? (
          <div className="mt-14 max-w-3xl">
            <h2 className="text-2xl">Frequently asked questions</h2>
            <span className="gold-rule mt-4" />
            <div className="mt-6 grid gap-3">
              {p.faqs.map((f) => (
                <details key={f.q} className="rounded-3xl border border-border bg-card p-5">
                  <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        ) : null}
      </Section>

      <Section tone="sand" id="get-details">
        <SectionHeading
          center
          eyebrow="Enquiry"
          title="Get complete details"
          subtitle="Share your details and our consultant will send the complete project brochure, pricing and launch plan."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <ProjectEnquiryForm projectName={p.name} />
        </div>
      </Section>

      <CtaBand title={`Interested in ${p.name}?`} />
    </>
  );
}
