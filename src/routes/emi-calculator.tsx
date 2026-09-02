import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { EmiCalculator } from "@/components/site/EmiCalculator";
import { CtaBand } from "@/components/site/CtaBand";

const title = "EMI Calculator | Property Loan EMI — Mohit Gaur Real Estate";
const description =
  "Calculate your home loan EMI instantly. Enter property price, down payment, interest rate and tenure to see monthly EMI, total interest and payable amount for Agra properties.";

export const Route = createFileRoute("/emi-calculator")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/emi-calculator" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/emi-calculator" }],
  }),
  component: EmiCalculatorPage,
});

function EmiCalculatorPage() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Tools"
          title="Property EMI Calculator"
          subtitle="Plan your property budget with a quick, transparent EMI estimate — no personal details required."
          center
        />
        <div className="mt-12">
          <EmiCalculator />
        </div>
      </Section>

      <CtaBand title="Need help choosing the right loan and property?" />
    </>
  );
}
