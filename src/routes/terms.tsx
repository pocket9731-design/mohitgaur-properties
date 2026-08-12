import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { site } from "@/data/site";

const title = "Terms & Conditions | Mohit Gaur Real Estate Consultant";
const description =
  "Terms of use for the Mohit Gaur real estate consulting website, including listing accuracy, pricing and advisory disclaimers.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <Section>
      <SectionHeading as="h1" eyebrow="Legal" title="Terms & Conditions" />
      <div className="mt-10 grid max-w-3xl gap-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          By using this website you agree to the terms below. {site.name} works as an independent real
          estate consultant and facilitator between buyers, sellers and developers.
        </p>
        <div>
          <h2 className="text-lg text-foreground">Property information</h2>
          <p className="mt-2">
            Property names, sizes, prices, images and highlights shown here are indicative and may change
            without notice. Images may include representative photography. Always verify final details,
            approvals and documents before making any payment.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">No offer or guarantee</h2>
          <p className="mt-2">
            Nothing on this website constitutes a legal offer, an assured return promise or investment
            advice. Property investments carry market risk and past appreciation does not guarantee future
            results.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Enquiries</h2>
          <p className="mt-2">
            By submitting an enquiry you consent to be contacted by phone, WhatsApp or email regarding your
            property requirement.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Intellectual property</h2>
          <p className="mt-2">
            Content, branding and layout of this website belong to {site.name} and may not be reproduced
            without permission.
          </p>
        </div>
        <div>
          <h2 className="text-lg text-foreground">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Write to{" "}
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
