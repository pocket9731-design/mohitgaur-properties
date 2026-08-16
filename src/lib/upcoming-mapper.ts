export type ProjectStatus = "Coming Soon" | "Pre-Launch";

export type ProjectFaq = { q: string; a: string };

export type UpcomingProject = {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  expectedLaunch: string;
  price: string;
  sizes: string;
  status: ProjectStatus;
  published: boolean;
  image: string;
  images: string[];
  highlights: string[];
  amenities: string[];
  timeline: string[];
  faqs: ProjectFaq[];
  description: string;
  overview: string;
  connectivity: string;
  sortOrder: number;
};

export type UpcomingProjectRow = {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  expected_launch: string;
  price: string;
  sizes: string;
  status: string;
  published: boolean;
  image: string;
  images: string[];
  highlights: string[];
  amenities: string[];
  timeline: string[];
  faqs: unknown;
  description: string;
  overview: string;
  connectivity: string;
  sort_order: number;
};

export const UPCOMING_COLUMNS =
  "id,name,location,city,type,expected_launch,price,sizes,status,published,image,images,highlights,amenities,timeline,faqs,description,overview,connectivity,sort_order";

export const FALLBACK_IMAGE = "/images/prop-plots.jpg";

function parseFaqs(value: unknown): ProjectFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((f): f is { q?: unknown; a?: unknown } => typeof f === "object" && f !== null)
    .map((f) => ({ q: String(f.q ?? ""), a: String(f.a ?? "") }))
    .filter((f) => f.q && f.a);
}

export function rowToUpcoming(row: UpcomingProjectRow): UpcomingProject {
  const images = row.images?.length ? row.images : [row.image || FALLBACK_IMAGE];
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    city: row.city,
    type: row.type,
    expectedLaunch: row.expected_launch,
    price: row.price,
    sizes: row.sizes,
    status: (row.status as ProjectStatus) ?? "Coming Soon",
    published: Boolean(row.published),
    image: row.image || images[0] || FALLBACK_IMAGE,
    images,
    highlights: row.highlights ?? [],
    amenities: row.amenities ?? [],
    timeline: row.timeline ?? [],
    faqs: parseFaqs(row.faqs),
    description: row.description,
    overview: row.overview,
    connectivity: row.connectivity,
    sortOrder: Number(row.sort_order) || 0,
  };
}

export function upcomingToRow(p: UpcomingProject): UpcomingProjectRow {
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    city: p.city,
    type: p.type,
    expected_launch: p.expectedLaunch,
    price: p.price,
    sizes: p.sizes,
    status: p.status,
    published: p.published,
    image: p.image,
    images: p.images,
    highlights: p.highlights,
    amenities: p.amenities,
    timeline: p.timeline,
    faqs: p.faqs,
    description: p.description,
    overview: p.overview,
    connectivity: p.connectivity,
    sort_order: p.sortOrder,
  };
}

export const emptyUpcoming = (): UpcomingProject => ({
  id: "",
  name: "",
  location: "",
  city: "Agra",
  type: "Residential Plots",
  expectedLaunch: "",
  price: "",
  sizes: "",
  status: "Coming Soon",
  published: true,
  image: "",
  images: [],
  highlights: [],
  amenities: [],
  timeline: [],
  faqs: [],
  description: "",
  overview: "",
  connectivity: "",
  sortOrder: 0,
});
