import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { Link } from "@tanstack/react-router";
import { A, btnStyles } from "@/components/site/buttons";
import { projects, waLink } from "@/data/site";

const title = "Projects & Portfolio | Completed Real Estate Projects — Mohit Gaur";
const description =
  "Featured and completed real estate projects — plotted townships, villas, apartments and commercial hubs in Agra, Noida and beyond, with sizes, pricing and highlights.";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/projects" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/projects" }],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Portfolio"
          title="Featured & completed projects"
          subtitle="A look at the projects I have advised on and delivered for clients."
        />

        <div className="mt-12 grid gap-10">
          {projects.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-card)]"
            >
              <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
                <div className="grid grid-cols-3 gap-1 p-1 lg:grid-cols-2 lg:grid-rows-2">
                  {p.gallery.map((g, i) => (
                    <img
                      key={g + i}
                      src={g}
                      alt={`${p.name} gallery image ${i + 1}`}
                      loading="lazy"
                      width={1200}
                      height={900}
                      className={`h-40 w-full rounded-2xl object-cover lg:h-full ${i === 0 ? "lg:col-span-2" : ""}`}
                    />
                  ))}
                </div>
                <div className="p-7 sm:p-9">
                  <span className="rounded-full bg-accent px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
                    {p.status}
                  </span>
                  <h2 className="mt-4 text-2xl">{p.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {p.location}, {p.city} · {p.type}
                  </p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-sm">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Sizes</dt>
                      <dd className="mt-1 font-medium">{p.sizes}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Price</dt>
                      <dd className="mt-1 font-display text-lg text-gold">{p.price}</dd>
                    </div>
                  </dl>
                  <ul className="mt-5 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link to="/projects/$id" params={{ id: p.id }} className={btnStyles.primary}>
                      View Project
                    </Link>
                    <A
                      href={waLink(`Hello Mohit, please share details about the project ${p.name}, ${p.city}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="whatsapp"
                    >
                      Enquire about this project
                    </A>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaBand title="Want a walkthrough of any project?" />
    </>
  );
}
