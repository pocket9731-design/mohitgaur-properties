import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Handshake, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import heroVilla from "@/assets/hero-villa.jpg";
import locAgra from "@/assets/loc-agra.jpg";
import locNcr from "@/assets/loc-ncr.jpg";
import { Section, SectionHeading } from "@/components/site/Section";
import { PropertyCard } from "@/components/site/PropertyCard";
import { CtaBand } from "@/components/site/CtaBand";
import { A, L } from "@/components/site/buttons";
import { services, site, testimonials, waLink, whyChooseMe } from "@/data/site";
import { fetchProperties } from "@/lib/properties.functions";

const title = "Real Estate Consultant in Agra | Mohit Gaur — Plots, Villas & Property";
const description =
  "Mohit Gaur is a professional real estate consultant helping clients buy, sell and invest in plots, villas, apartments and commercial property in Agra, Delhi NCR and across India.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app" }],
  }),
  loader: () => fetchProperties(),
  component: Index,
});

const icons = [MapPinned, BadgeCheck, ShieldCheck, Handshake, Sparkles];

function Index() {
  const featured = Route.useLoaderData().slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroVilla}
          alt="Luxury villa exterior at golden hour representing premium property consulting"
          width={1600}
          height={1104}
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/92 via-ink/75 to-ink/35" />
        <div className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8 md:py-36">
          <div className="fade-up max-w-2xl text-primary-foreground">
            <p className="eyebrow">{site.role} · Agra & Pan-India</p>
            <h1 className="mt-4 text-4xl leading-[1.1] sm:text-5xl md:text-6xl">{site.tagline}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed opacity-85 sm:text-lg">
              Professional Real Estate Consultant helping clients buy, sell and invest in the right
              properties.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <L to="/properties" variant="gold">Explore Properties</L>
              <A
                href={waLink("Hello Mohit, I saw your website and would like to discuss a property.")}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
              >
                WhatsApp Me
              </A>
              <L
                to="/contact"
                variant="outline"
                className="border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Book a Site Visit
              </L>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-primary-foreground/20 pt-6">
              {[
                { k: "10+ yrs", v: "Market experience" },
                { k: "500+", v: "Clients guided" },
                { k: "8 cities", v: "Across India" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="font-display text-2xl">{s.k}</dt>
                  <dd className="text-xs uppercase tracking-[0.14em] opacity-70">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Featured"
            title="Handpicked properties"
            subtitle="A small, verified selection — every option personally inspected and title-checked."
          />
          <L to="/properties" variant="outline">View all properties</L>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow="Services"
          title="Complete consulting, start to registry"
          subtitle="From shortlisting the right options to handing over the keys — one point of contact throughout."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 8).map((s) => (
            <div key={s.title} className="card-lift rounded-3xl border border-border bg-card p-6">
              <h3 className="text-lg leading-snug">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <L to="/services" variant="primary">Explore all services</L>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Trust"
          title="Why Clients Choose Me"
          subtitle="Real estate decisions are big. My job is to make them clear, safe and simple."
          center
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {whyChooseMe.map((w, i) => {
            const Icon = icons[i % icons.length]!;
            return (
              <div key={w.title} className="rounded-3xl border border-border bg-card p-6 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          eyebrow="Locations"
          title="Featured locations"
          subtitle="Deep local expertise in Agra, plus active networks across North India."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            { img: locAgra, name: "Agra", copy: "Plots, villas and township investments in my home market." },
            { img: locNcr, name: "Delhi NCR & Noida", copy: "Apartments, commercial floors and high-yield investments." },
          ].map((l) => (
            <Link
              key={l.name}
              to="/locations"
              className="card-lift group relative block overflow-hidden rounded-3xl"
            >
              <img
                src={l.img}
                alt={`Property market in ${l.name}`}
                loading="lazy"
                width={1200}
                height={800}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-primary-foreground">
                <h3 className="text-2xl">{l.name}</h3>
                <p className="mt-1 text-sm opacity-85">{l.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Testimonials" title="What clients say" center />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <figure key={t.name} className="rounded-3xl border border-border bg-card p-7">
              <p className="text-sm leading-relaxed text-foreground">“{t.quote}”</p>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent font-display text-accent-foreground">
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

      <CtaBand />
    </>
  );
}
