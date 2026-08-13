import { createFileRoute } from "@tanstack/react-router";
import profile from "@/assets/profile-mohit.jpg";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A, L } from "@/components/site/buttons";
import { site, waLink } from "@/data/site";

const title = "About Mohit Gaur | Property Investment Consultant in Agra";
const description =
  "Meet Mohit Gaur — a real estate consultant with deep Agra market knowledge, transparent guidance and end-to-end investment assistance for local and outstation buyers.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/about" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/about" }],
  }),
  component: About,
});

const pillars = [
  {
    title: "Real Estate Experience",
    body: "A decade of advising buyers, sellers and investors across plots, villas, apartments and commercial assets.",
  },
  {
    title: "Local Market Knowledge",
    body: "Street-level understanding of Agra's rates, approvals and upcoming infrastructure — plus active networks in NCR, Lucknow and Jaipur.",
  },
  {
    title: "Property Investment Assistance",
    body: "Purpose-first advice: end use, holding period, expected appreciation and realistic exit — before you commit.",
  },
  {
    title: "Transparent & Client-Focused",
    body: "Verified documents, honest pricing and zero pressure. If a deal isn't right for you, I will say so.",
  },
];

function About() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.2rem] bg-accent/60" />
            <img
              src={profile}
              alt="Mohit Gaur, professional real estate consultant"
              loading="lazy"
              width={1008}
              height={1200}
              className="w-full rounded-[2rem] object-cover shadow-[var(--shadow-card)]"
            />
          </div>
          <div>
            <SectionHeading
              as="h1"
              eyebrow="About Me"
              title="Mohit Gaur — your property advisor, not just a broker"
              subtitle="I help families and investors make confident property decisions in Agra and across India. My work starts with understanding your purpose and budget, and ends only after the registry is safely done."
            />
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              Over the years I have handled plotted townships, luxury villas, ready-to-move apartments and
              pre-leased commercial spaces. Whether you are buying your first home, selling an inherited
              property, or investing from another city or country, you get one dedicated point of contact
              and complete clarity at every step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <L to="/contact" variant="gold">Book a Consultation</L>
              <A href={waLink("Hello Mohit, I read your profile and would like to connect.")} target="_blank" rel="noopener noreferrer" variant="whatsapp">
                WhatsApp Me
              </A>
              <A href={`tel:${site.phone}`} variant="outline">Call {site.phoneDisplay}</A>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading eyebrow="Approach" title="How I work" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="card-lift rounded-3xl border border-border bg-card p-7">
              <h2 className="text-xl">{p.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand title="Have a property question? Let's talk." />
    </>
  );
}
