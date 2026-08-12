import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { z } from "zod";
import { Section, SectionHeading } from "@/components/site/Section";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { site, waLink } from "@/data/site";

const title = "Contact Mohit Gaur | Real Estate Consultant in Agra";
const description =
  "Call, WhatsApp or send an enquiry to Mohit Gaur — real estate consultant in Agra. Book a site visit or get a property shortlist for your budget.";

const searchSchema = z.object({ property: z.string().max(120).optional() });

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { property } = Route.useSearch();

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Let's discuss your requirement"
          subtitle="Share a few details and I will get back with matched, verified options — usually the same day."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <EnquiryForm {...(property ? { presetProperty: property } : {})} />

          <div className="grid content-start gap-4">
            <a
              href={`tel:${site.phone}`}
              className="card-lift flex items-center gap-4 rounded-3xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Call directly</span>
                <span className="block font-semibold">{site.phoneDisplay}</span>
              </span>
            </a>
            <a
              href={waLink("Hello Mohit, I would like to enquire about a property.")}
              target="_blank"
              rel="noopener noreferrer"
              className="card-lift flex items-center gap-4 rounded-3xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-whatsapp text-primary-foreground">
                <MessageCircle className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Chat instantly</span>
                <span className="block font-semibold">WhatsApp Me</span>
              </span>
            </a>
            <a
              href={`mailto:${site.email}`}
              className="card-lift flex items-center gap-4 rounded-3xl border border-border bg-card p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Mail className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-muted-foreground">Email</span>
                <span className="block font-semibold break-all">{site.email}</span>
              </span>
            </a>
            <div className="rounded-3xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MapPin className="size-5" />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">Office</p>
              <p className="font-medium">{site.address}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {site.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-4 py-1.5 text-xs transition-colors hover:bg-secondary"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden rounded-3xl border border-border">
          <iframe
            title="Mohit Gaur office location on Google Maps"
            src={site.mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full border-0"
          />
        </div>
      </Section>
    </>
  );
}
