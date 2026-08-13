import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/data/site";

const title = "Privacy Policy | Mohit Gaur Real Estate Consultant";
const description =
  "How Mohit Gaur collects, uses and protects the personal information you share through this real estate consulting website.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/privacy-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/privacy-policy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <Section>
      <SectionHeading as="h1" eyebrow="Legal" title="Privacy Policy" />
      <div className="mt-10 grid max-w-3xl gap-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          This website is operated by {site.name}, an independent real estate consultant. Your privacy
          matters, and the information you share is used only to respond to your property enquiry.
        </p>
        <div>
          <h2 className="text-lg text-foreground">Information collected</h2>
          <p className="mt-2">
            When you submit the enquiry form, contact by phone or message on WhatsApp, I may collect your
            name, phone number, WhatsApp number, email address, preferred location, property type, budget
            and any message you provide.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">How it is used</h2>
          <p className="mt-2">
            Your details are used to understand your requirement, share matching property options,
            schedule site visits and follow up on your enquiry. They are never sold or rented.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Sharing</h2>
          <p className="mt-2">
            Details may be shared with a developer, seller or channel partner only when it is necessary to
            process a property enquiry or booking you have asked about, or when required by law.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Third-party services</h2>
          <p className="mt-2">
            This site embeds Google Maps and links to WhatsApp and social platforms. Those services have
            their own privacy policies and handle data independently.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Your choices</h2>
          <p className="mt-2">
            You can ask me to update or delete your details at any time by writing to{" "}
            <a href={`mailto:${site.email}`} className="text-gold underline underline-offset-4">
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </Section>
  );
}
