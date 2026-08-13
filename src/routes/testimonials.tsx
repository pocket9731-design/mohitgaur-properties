import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { testimonials } from "@/data/site";

const title = "Client Testimonials | Mohit Gaur, Real Estate Consultant";
const description =
  "Read reviews from buyers, sellers, investors and NRI clients who worked with real estate consultant Mohit Gaur in Agra, NCR and across India.";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/testimonials" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/testimonials" }],
  }),
  component: Testimonials,
});

function Testimonials() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Testimonials"
          title="Trusted by families and investors"
          subtitle="Most of my clients come through referrals — here is why."
          center
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="card-lift rounded-3xl border border-border bg-card p-7">
              <Quote className="size-6 text-gold" />
              <blockquote className="mt-4 text-sm leading-relaxed">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent font-display text-lg text-accent-foreground">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{t.name}</span>
                  <span className="block text-xs text-muted-foreground">{t.city}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <CtaBand title="Ready to start your property search?" />
    </>
  );
}
