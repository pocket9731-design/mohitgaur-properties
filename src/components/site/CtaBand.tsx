import { site, waLink } from "@/data/site";
import { A, L } from "./buttons";

export function CtaBand({
  title = "Let's find the right property for you",
  subtitle = "Share your requirement and get a curated shortlist with honest, transparent guidance.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-[2rem] bg-ink px-6 py-14 text-primary-foreground sm:px-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed opacity-80">{subtitle}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <L to="/contact" variant="gold">Book a Site Visit</L>
          <A href={waLink("Hello Mohit, I would like to discuss my property requirement.")} target="_blank" rel="noopener noreferrer" variant="whatsapp">
            WhatsApp Me
          </A>
          <A href={`tel:${site.phone}`} variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
            Call {site.phoneDisplay}
          </A>
        </div>
      </div>
    </section>
  );
}
