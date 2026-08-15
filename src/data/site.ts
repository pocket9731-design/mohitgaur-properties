/**
 * SINGLE SOURCE OF TRUTH — edit this file to update contact details,
 * properties, projects, locations and testimonials.
 */

export const site = {
  name: "Mohit Gaur",
  role: "Real Estate Consultant",
  tagline: "Find the Right Property. Make the Right Investment.",
  // TODO: replace with real details
  phone: "+917983551233",
  phoneDisplay: "+91 79835 51233",
  whatsapp: "917983551233",
  email: "mohitgaur9731@gmail.com",
  city: "Agra, Uttar Pradesh",
  address: "Sanjay Place, Agra, Uttar Pradesh 282002, India",
  mapsEmbed:
    "https://www.google.com/maps?q=Sanjay%20Place%2C%20Agra%2C%20Uttar%20Pradesh&output=embed",
  mapsLink: "https://maps.google.com/?q=Sanjay+Place,+Agra,+Uttar+Pradesh",
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "YouTube", href: "https://youtube.com/" },
  ],
};

export const waLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

export const propertyTypes = [
  "Residential Plots",
  "Villas",
  "Flats & Apartments",
  "Commercial Properties",
  "Investment Properties",
] as const;

export type PropertyType = (typeof propertyTypes)[number];

export const locations = [
  {
    name: "Agra",
    slug: "agra",
    blurb: "Home market — plots, villas and township investments along Inner Ring Road and Fatehabad Road.",
    highlights: ["Residential Plots", "Villas", "Investment Land"],
  },
  {
    name: "Delhi NCR",
    slug: "delhi-ncr",
    blurb: "Ready-to-move apartments and commercial floors across South Delhi, Dwarka and Faridabad.",
    highlights: ["Apartments", "Commercial", "Resale"],
  },
  {
    name: "Noida",
    slug: "noida",
    blurb: "Expressway sectors with strong rental yield and metro-linked connectivity.",
    highlights: ["Apartments", "Office Space"],
  },
  {
    name: "Greater Noida",
    slug: "greater-noida",
    blurb: "Authority plots and low-density villa projects near Jewar Airport corridor.",
    highlights: ["Plots", "Villas"],
  },
  {
    name: "Lucknow",
    slug: "lucknow",
    blurb: "Shaheed Path and Sultanpur Road growth belt — plotted townships and builder floors.",
    highlights: ["Plots", "Townships"],
  },
  {
    name: "Jaipur",
    slug: "jaipur",
    blurb: "JDA-approved plots and premium villas on Ajmer Road and Tonk Road.",
    highlights: ["Plots", "Villas"],
  },
  {
    name: "Gurugram",
    slug: "gurugram",
    blurb: "Golf Course Extension and Dwarka Expressway — luxury homes and pre-leased commercial.",
    highlights: ["Luxury Homes", "Pre-leased"],
  },
  {
    name: "Other Indian Locations",
    slug: "india",
    blurb: "Sourcing and site-visit support for buyers across India and NRI clients.",
    highlights: ["Pan-India", "NRI Support"],
  },
];

export type PropertyStatus = "For Sale" | "For Rent" | "Sold";

export type Property = {
  id: string;
  name: string;
  location: string;
  city: string;
  type: PropertyType;
  size: string;
  sizeSqft: number;
  price: string;
  priceValue: number; // in lakhs
  image: string;
  images: string[];
  highlights: string[];
  description: string;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  amenities: string[];
  latitude: number;
  longitude: number;
  createdAt: string;
};

export const agent = {
  name: site.name,
  role: site.role,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  email: site.email,
  whatsapp: site.whatsapp,
};

import plots from "@/assets/prop-plots.jpg";
import villa from "@/assets/hero-villa.jpg";
import villa2 from "@/assets/prop-villa2.jpg";
import apartment from "@/assets/prop-apartment.jpg";
import commercial from "@/assets/prop-commercial.jpg";


export type Project = {
  id: string;
  name: string;
  city: string;
  location: string;
  type: PropertyType;
  sizes: string;
  price: string;
  status: "Featured" | "Completed" | "Ongoing";
  highlights: string[];
  gallery: string[];
  description: string;
};

export const projects: Project[] = [
  {
    id: "shanti-greens",
    name: "Shanti Greens Township",
    city: "Agra",
    location: "Inner Ring Road",
    type: "Residential Plots",
    sizes: "1000 / 1500 / 2000 sq.ft.",
    price: "₹32 Lakh onwards",
    status: "Featured",
    highlights: ["Gated community", "Wide internal roads", "Registry ready", "Park facing options"],
    description:
      "Shanti Greens Township on Inner Ring Road, Agra — a gated plotted development with 1000/1500/2000 sq.ft. registry-ready plots, wide internal roads and park-facing options from ₹32 Lakh.",
    gallery: [plots, villa2, villa],
  },
  {
    id: "krishna-metro-city-project",
    name: "Krishna Metro City",
    city: "Agra",
    location: "Ring Road",
    type: "Residential Plots",
    sizes: "900 / 1200 / 1500 / 2000 sq.ft.",
    price: "₹28 Lakh onwards",
    status: "Featured",
    highlights: ["Ring Road frontage", "Gated plotted township", "Underground wiring", "Parks & open spaces"],
    description:
      "Krishna Metro City, Ring Road Agra — a featured gated plotted township offering 900–2000 sq.ft. registry-ready plots with parks, wide roads and strong investment growth from ₹28 Lakh.",
    gallery: [plots, villa2, apartment],
  },
  {
    id: "riverfront-villas",
    name: "Riverfront Villas",
    city: "Agra",
    location: "Fatehabad Road",
    type: "Villas",
    sizes: "2400 – 3200 sq.ft.",
    price: "₹1.85 Cr onwards",
    status: "Completed",
    highlights: ["24 villas delivered", "Private lawns", "Premium fittings", "Full documentation support"],
    description:
      "Riverfront Villas on Fatehabad Road, Agra — 24 delivered luxury villas of 2400–3200 sq.ft. with private lawns, premium fittings and complete documentation support from ₹1.85 Crore.",
    gallery: [villa, villa2, plots],
  },
  {
    id: "expressway-heights-project",
    name: "Expressway Heights",
    city: "Noida",
    location: "Sector 150",
    type: "Flats & Apartments",
    sizes: "1150 – 1850 sq.ft.",
    price: "₹98 Lakh onwards",
    status: "Ongoing",
    highlights: ["80% open green", "Sports township", "Metro linked", "Investor friendly"],
    description:
      "Expressway Heights, Sector 150 Noida — an ongoing sports township of 1150–1850 sq.ft. apartments with 80% open green and metro connectivity from ₹98 Lakh.",
    gallery: [apartment, commercial, villa],
  },
  {
    id: "sanjay-place-hub",
    name: "Sanjay Place Business Hub",
    city: "Agra",
    location: "Sanjay Place",
    type: "Commercial Properties",
    sizes: "600 – 2100 sq.ft.",
    price: "₹45 Lakh onwards",
    status: "Featured",
    highlights: ["Prime commercial belt", "Pre-leased options", "Assured rental", "High footfall"],
    description:
      "Sanjay Place Business Hub, Agra — commercial units of 600–2100 sq.ft. in the city's prime business belt with pre-leased and assured rental options from ₹45 Lakh.",
    gallery: [commercial, apartment, plots],
  },
];

export const services = [
  {
    title: "Property Buying Assistance",
    body: "End-to-end help from shortlisting to registry, with verified options only.",
  },
  {
    title: "Property Selling Assistance",
    body: "Right pricing, genuine buyers and clean, quick closure of your deal.",
  },
  {
    title: "Investment Consultation",
    body: "Data-backed advice on locations with real appreciation potential.",
  },
  {
    title: "Site Visit Assistance",
    body: "Planned site visits with pickup support and honest on-ground feedback.",
  },
  {
    title: "Property Shortlisting",
    body: "A curated 3–5 option shortlist matched to your budget and purpose.",
  },
  {
    title: "Market & Location Analysis",
    body: "Rate trends, infrastructure plans and resale outlook before you commit.",
  },
  {
    title: "Documentation Guidance",
    body: "Title check, agreement, registry and loan paperwork guided step by step.",
  },
  {
    title: "NRI / Outstation Buyer Assistance",
    body: "Video site visits, verified reports and complete remote deal handling.",
  },
];

export const whyChooseMe = [
  { title: "Local Market Expertise", body: "Years of on-ground experience in Agra and the North India belt." },
  { title: "Verified Property Options", body: "Every listing is title-checked and personally inspected." },
  { title: "Transparent Guidance", body: "Clear pricing, honest advice — no pressure, no hidden charges." },
  { title: "Personalized Assistance", body: "One point of contact from first call to final registry." },
  { title: "Site Visit Support", body: "Scheduled visits with complete on-site clarity and comparison." },
];

export const testimonials = [
  {
    name: "Rajeev Sharma",
    city: "Agra",
    quote:
      "Mohit helped us buy a plot in Agra without any stress. Every document was verified before we paid a rupee. Truly transparent guidance.",
  },
  {
    name: "Anita Verma",
    city: "Noida",
    quote:
      "We were investing from outside the city. The video site visits and honest comparisons made the decision easy and safe.",
  },
  {
    name: "Sandeep Chauhan",
    city: "Gurugram",
    quote:
      "Sold my apartment at a fair price within six weeks. Professional, responsive and genuinely client-focused.",
  },
  {
    name: "Dr. Neha Agarwal",
    city: "Lucknow",
    quote:
      "He explained the market rates and future growth clearly. That clarity is why I have referred him to my family too.",
  },
  {
    name: "Imran Qureshi",
    city: "Dubai (NRI)",
    quote:
      "As an NRI buyer I needed someone trustworthy on the ground. Mohit handled everything end to end for my Agra villa.",
  },
  {
    name: "Poonam Singh",
    city: "Jaipur",
    quote:
      "Patient, knowledgeable and never pushy. He showed only properties that matched my budget and purpose.",
  },
];
