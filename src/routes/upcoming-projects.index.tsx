import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, MapPin, Ruler, IndianRupee, Search, SlidersHorizontal } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/Section";
import { CtaBand } from "@/components/site/CtaBand";
import { A, btnStyles } from "@/components/site/buttons";
import { ProjectEnquiryForm } from "@/components/site/ProjectEnquiryForm";
import { fetchUpcomingProjects } from "@/lib/upcoming.functions";
import { FALLBACK_IMAGE, type ProjectStatus } from "@/lib/upcoming-mapper";
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

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

const label = "grid gap-1.5 text-sm font-medium";

const statuses: ProjectStatus[] = ["Coming Soon", "Pre-Launch"];

function UpcomingProjects() {
  const { data: projects } = useSuspenseQuery(upcomingQuery);

  const cities = useMemo(() => Array.from(new Set(projects.map((p) => p.city))).sort(), [projects]);
  const types = useMemo(() => Array.from(new Set(projects.map((p) => p.type))).sort(), [projects]);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesTerm =
        !term || [p.name, p.location, p.city, p.type].some((v) => v.toLowerCase().includes(term));
      return matchesTerm && (!city || p.city === city) && (!type || p.type === type) && (!status || p.status === status);
    });
  }, [projects, q, city, type, status]);

  const reset = () => {
    setQ("");
    setCity("");
    setType("");
    setStatus("");
  };

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
          <>
            <div className="mt-10 rounded-3xl border border-border bg-card p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by project name or location…"
                  aria-label="Search upcoming projects"
                  className={`${field} pl-11`}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className={label}>
                  Location
                  <select className={field} value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="">All locations</option>
                    {cities.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <label className={label}>
                  Project Type
                  <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All types</option>
                    {types.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className={label}>
                  Status
                  <select className={field} value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}>
                    <option value="">All statuses</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={label}>
                  Sort by
                  <select className={field} value={"sort_order"} disabled>
                    <option value="sort_order">Launch order</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Showing {filtered.length} of {projects.length} projects
              </p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
              >
                <SlidersHorizontal className="size-3.5" /> Reset filters
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border p-12 text-center">
                <p className="text-base">No projects match these filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search or register your interest below to be notified first.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p) => (
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
          </>
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
