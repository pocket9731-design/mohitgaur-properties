/**
 * SINGLE SOURCE OF TRUTH — edit this file to update contact details,
 * properties, projects, locations and testimonials.
 */

export const site = {
  name: "Mohit Gaur",
  role: "Real Estate Consultant",
  tagline: "Find the Right Property. Make the Right Investment.",
  // TODO: replace with real details
  phone: "+919876543210",
  phoneDisplay: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "contact@mohitgaur.in",
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
  highlights: string[];
};

import plots from "@/assets/prop-plots.jpg";
import villa from "@/assets/hero-villa.jpg";
import villa2 from "@/assets/prop-villa2.jpg";
import apartment from "@/assets/prop-apartment.jpg";
import commercial from "@/assets/prop-commercial.jpg";

export const properties: Property[] = [
  {
    id: "shanti-greens-plots",
    name: "Shanti Greens Plots",
    location: "Inner Ring Road",
    city: "Agra",
    type: "Residential Plots",
    size: "1000 – 2000 sq.ft.",
    sizeSqft: 1000,
    price: "₹32 Lakh onwards",
    priceValue: 32,
    image: plots,
    highlights: ["Gated township", "Clear title", "Ready for registry"],
  },
  {
    id: "riverfront-villa",
    name: "Riverfront Signature Villa",
    location: "Fatehabad Road",
    city: "Agra",
    type: "Villas",
    size: "3200 sq.ft. / 4 BHK",
    sizeSqft: 3200,
    price: "₹2.45 Crore",
    priceValue: 245,
    image: villa,
    highlights: ["Private lawn", "Corner plot", "Modular interiors"],
  },
  {
    id: "expressway-heights",
    name: "Expressway Heights",
    location: "Sector 150",
    city: "Noida",
    type: "Flats & Apartments",
    size: "1450 sq.ft. / 3 BHK",
    sizeSqft: 1450,
    price: "₹1.35 Crore",
    priceValue: 135,
    image: apartment,
    highlights: ["Ready to move", "Club & pool", "High rental yield"],
  },
  {
    id: "sanjay-place-office",
    name: "Sanjay Place Corporate Floor",
    location: "Sanjay Place",
    city: "Agra",
    type: "Commercial Properties",
    size: "2100 sq.ft.",
    sizeSqft: 2100,
    price: "₹1.10 Crore",
    priceValue: 110,
    image: commercial,
    highlights: ["Pre-leased option", "Prime frontage", "Ample parking"],
  },
  {
    id: "jewar-land-bank",
    name: "Jewar Growth Land Bank",
    location: "Yamuna Expressway",
    city: "Greater Noida",
    type: "Investment Properties",
    size: "1800 sq.ft.",
    sizeSqft: 1800,
    price: "₹58 Lakh",
    priceValue: 58,
    image: plots,
    highlights: ["Airport corridor", "High appreciation", "Authority approved"],
  },
  {
    id: "palm-court-villa",
    name: "Palm Court Duplex Villa",
    location: "Ajmer Road",
    city: "Jaipur",
    type: "Villas",
    size: "2400 sq.ft. / 4 BHK",
    sizeSqft: 2400,
    price: "₹1.65 Crore",
    priceValue: 165,
    image: villa2,
    highlights: ["JDA approved", "Landscaped garden", "Vastu compliant"],
  },
  {
    id: "shaheed-path-homes",
    name: "Shaheed Path Smart Homes",
    location: "Shaheed Path",
    city: "Lucknow",
    type: "Flats & Apartments",
    size: "1150 sq.ft. / 2 BHK",
    sizeSqft: 1150,
    price: "₹72 Lakh",
    priceValue: 72,
    image: apartment,
    highlights: ["Bank loan approved", "Under construction", "Flexi payment"],
  },
  {
    id: "golf-extn-residences",
    name: "Golf Extension Residences",
    location: "Golf Course Extn. Road",
    city: "Gurugram",
    type: "Flats & Apartments",
    size: "2650 sq.ft. / 4 BHK",
    sizeSqft: 2650,
    price: "₹4.20 Crore",
    priceValue: 420,
    image: apartment,
    highlights: ["Low density", "Concierge services", "Metro connectivity"],
  },
];

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
    gallery: [plots, villa2, villa],
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
