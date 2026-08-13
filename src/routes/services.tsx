import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { services } from "@/data/site";

const title = "Real Estate Services | Buying, Selling & Investment — Mohit Gaur";
const description =
  "Property buying and selling assistance, investment consultation, site visits, shortlisting, market analysis, documentation guidance and NRI buyer support.";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/services" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/services" }],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title="Everything you need, handled properly"
          subtitle="Practical, hands-on consulting for buyers, sellers and investors — in Agra and across India."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <div key={s.title} className="card-lift rounded-3xl border border-border bg-card p-7">
              <span className="font-display text-sm text-gold">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="mt-3 text-xl leading-snug">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Process" title="A simple four-step process" />
        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {[
            { t: "Understand", d: "We discuss your purpose, budget and timeline." },
            { t: "Shortlist", d: "You receive 3–5 verified, matched options." },
            { t: "Site Visit", d: "We visit together with honest comparisons." },
            { t: "Close", d: "Negotiation, paperwork and registry support." },
          ].map((s, i) => (
            <li key={s.t} className="rounded-3xl border border-border bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-primary-foreground">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand title="Need help with a property decision?" />
    </>
  );
}
