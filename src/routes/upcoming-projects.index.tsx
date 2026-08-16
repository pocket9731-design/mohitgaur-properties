import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CalendarClock, MapPin, Ruler, IndianRupee } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A, btnStyles } from "@/components/site/buttons";
import { ProjectEnquiryForm } from "@/components/site/ProjectEnquiryForm";
import { fetchUpcomingProjects } from "@/lib/upcoming.functions";
import { FALLBACK_IMAGE } from "@/lib/upcoming-mapper";
import { waLink } from "@/data/site";

const upcomingQuery = queryOptions({
  queryKey: ["upcoming-projects"],
  queryFn: () => fetchUpcomingProjects(),
});

const title = "Upcoming Real Estate Projects in Agra & NCR | Mohit Gaur";
const description =
  "Discover upcoming real-estate projects and get early access to the latest property opportunities in Agra, Noida, Greater Noida and across India.";

export const Route = createFileRoute("/upcoming-projects/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(upcomingQuery),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mohitgaur-properties.lovable.app/upcoming-projects" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: "https://mohitgaur-properties.lovable.app/upcoming-projects" }],
  }),
  errorComponent: () => (
    <Section>
      <p className="text-sm text-muted-foreground">Could not load upcoming projects. Please try again.</p>
    </Section>
  ),
  notFoundComponent: () => (
    <Section>
      <p className="text-sm text-muted-foreground">Nothing here.</p>
    </Section>
  ),
  component: UpcomingProjects,
});

function UpcomingProjects() {
  const { data: projects } = useSuspenseQuery(upcomingQuery);

  return (
    <>
      <Section>
        <SectionHeading
          as="h1"
          eyebrow="Early access"
          title="Upcoming Projects"
          subtitle="Discover upcoming real-estate projects and get early access to the latest property opportunities."
        />

        {projects.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            New projects are being announced soon. Register your interest below to hear first.
          </p>
        ) : (
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="relative">
                  <img
                    src={p.image}
                    alt={`${p.name}, ${p.location} ${p.city} — upcoming ${p.type} project`}
                    loading="lazy"
                    width={900}
                    height={640}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                    {p.status}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl leading-snug">{p.name}</h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-gold" />
                    {p.location}, {p.city}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">{p.type}</p>

                  <dl className="mt-5 grid gap-3 border-y border-border py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="size-4 shrink-0 text-gold" />
                      <dt className="sr-only">Expected launch</dt>
                      <dd>Expected launch · {p.expectedLaunch || "To be announced"}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="size-4 shrink-0 text-gold" />
                      <dt className="sr-only">Starting price</dt>
                      <dd className="font-display text-base text-gold">{p.price || "Price on request"}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="size-4 shrink-0 text-gold" />
                      <dt className="sr-only">Available sizes</dt>
                      <dd>{p.sizes || "Multiple sizes"}</dd>
                    </div>
                  </dl>

                  <ul className="mt-4 grid gap-1.5 text-sm text-muted-foreground">
                    {p.highlights.slice(0, 4).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2 pt-1">
                    <Link
                      to="/upcoming-projects/$id"
                      params={{ id: p.id }}
                      className={`${btnStyles.primary} flex-1 px-5 py-2.5`}
                    >
                      View Project
                    </Link>
                    <a href="#register-interest" className={`${btnStyles.gold} flex-1 px-5 py-2.5`}>
                      Register Interest
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section tone="sand" id="register-interest">
        <SectionHeading
          center
          eyebrow="Enquiry"
          title="Register your interest"
          subtitle="Share a few details and we will send you complete project information, pricing and launch updates."
        />
        <div className="mx-auto mt-10 max-w-2xl">
          <ProjectEnquiryForm projectOptions={[...projects.map((p) => p.name), "Any upcoming project"]} />
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Prefer to talk?{" "}
            <A
              href={waLink("Hello Mohit, please share details about your upcoming projects.")}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
            >
              Message on WhatsApp
            </A>
          </p>
        </div>
      </Section>

      <CtaBand title="Want early access to pre-launch pricing?" />
    </>
  );
}
