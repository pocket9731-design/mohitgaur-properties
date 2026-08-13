import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A } from "@/components/site/buttons";
import { locations, site, waLink } from "@/data/site";

const title = "Property Locations | Agra, Delhi NCR, Noida, Jaipur — Mohit Gaur";
const description =
  "Property consulting across Agra, Delhi NCR, Noida, Greater Noida, Lucknow, Jaipur, Gurugram and other Indian locations, with local market insight in each.";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/locations" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/locations" }],
  }),
  component: Locations,
});

function Locations() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Locations"
          title="Where I can help you buy or invest"
          subtitle="Agra is my home market. Beyond it, I work with a trusted on-ground network across North India and support outstation and NRI buyers end to end."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((l) => (
            <article key={l.slug} className="card-lift rounded-3xl border border-border bg-card p-7">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="size-5" />
              </span>
              <h2 className="mt-4 text-xl">{l.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {l.highlights.map((h) => (
                  <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    {h}
                  </li>
                ))}
              </ul>
              <A
                href={waLink(`Hello Mohit, I am looking for property in ${l.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                variant="ghost"
                className="mt-5"
              >
                Enquire about {l.name} →
              </A>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Find me" title="Based in Agra" subtitle={site.address} />
        <div className="mt-10 overflow-hidden rounded-3xl border border-border">
          <iframe
            title="Office location on Google Maps"
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[380px] w-full border-0"
          />
        </div>
      </Section>

      <CtaBand title="Don't see your city? Ask anyway." subtitle="I regularly assist buyers investing outside their home city." />
    </>
  );
}
