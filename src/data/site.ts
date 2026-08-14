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
    description:
      "Registry-ready residential plots of 1000–2000 sq.ft. inside a gated township on Inner Ring Road, Agra, with clear title, wide internal roads and park-facing options starting at ₹32 Lakh.",
    images: [plots, villa2, commercial],
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 0,
    parking: 2,
    amenities: ["Gated Security", "Wide Internal Roads", "Park Facing", "Power Backup", "Underground Wiring", "Water Supply"],
    latitude: 27.1592,
    longitude: 77.991,
    createdAt: "2026-01-08",
  },
  {
    id: "krishna-metro-city",
    name: "Krishna Metro City",
    location: "Ring Road",
    city: "Agra",
    type: "Residential Plots",
    size: "900 – 2000 sq.ft.",
    sizeSqft: 900,
    price: "₹28 Lakh onwards",
    priceValue: 28,
    image: plots,
    highlights: ["Gated township", "Ring Road frontage", "Registry ready", "Parks & wide roads"],
    description:
      "Krishna Metro City is a gated plotted township on Ring Road, Agra offering 900–2000 sq.ft. registry-ready residential plots with wide roads, parks, underground wiring and excellent appreciation potential from ₹28 Lakh.",
    images: [plots, villa, apartment],
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 0,
    parking: 2,
    amenities: ["Gated Security", "Parks & Green Belt", "Wide Roads", "Underground Wiring", "Street Lighting", "Registry Ready"],
    latitude: 27.213,
    longitude: 78.008,
    createdAt: "2026-02-02",
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
    description:
      "A 3200 sq.ft. 4 BHK signature villa on Fatehabad Road, Agra with a private lawn, corner-plot frontage and modular interiors — a ready luxury home priced at ₹2.45 Crore.",
    images: [villa, villa2, apartment],
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    amenities: ["Private Lawn", "Modular Kitchen", "Air Conditioning", "Security", "Power Backup", "Furnished"],
    latitude: 27.1585,
    longitude: 78.05,
    createdAt: "2026-01-20",
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
    description:
      "Ready-to-move 3 BHK apartment of 1450 sq.ft. in Sector 150, Noida with clubhouse, pool and strong rental yield along the Noida Expressway, priced at ₹1.35 Crore.",
    images: [apartment, villa2, commercial],
    status: "For Sale",
    bedrooms: 3,
    bathrooms: 3,
    parking: 1,
    amenities: ["Swimming Pool", "Gymnasium", "Clubhouse", "Security", "Power Backup", "Balcony"],
    latitude: 28.43,
    longitude: 77.53,
    createdAt: "2026-01-15",
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
    description:
      "A 2100 sq.ft. corporate floor in Sanjay Place, Agra's prime business belt — pre-leased option, prime frontage and ample parking at ₹1.10 Crore.",
    images: [commercial, apartment, plots],
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 2,
    parking: 6,
    amenities: ["Lift Access", "Power Backup", "Security", "Ample Parking", "Air Conditioning", "Prime Frontage"],
    latitude: 27.199,
    longitude: 78.008,
    createdAt: "2025-12-28",
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
    description:
      "1800 sq.ft. authority-approved investment land on the Yamuna Expressway near the Jewar Airport corridor, Greater Noida — high appreciation potential at ₹58 Lakh.",
    images: [plots, commercial, villa2],
    status: "For Sale",
    bedrooms: 0,
    bathrooms: 0,
    parking: 2,
    amenities: ["Authority Approved", "Airport Corridor", "Wide Roads", "Clear Title"],
    latitude: 28.12,
    longitude: 77.61,
    createdAt: "2026-01-05",
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
    description:
      "JDA-approved 4 BHK duplex villa of 2400 sq.ft. on Ajmer Road, Jaipur with a landscaped garden and Vastu-compliant layout, priced at ₹1.65 Crore.",
    images: [villa2, villa, apartment],
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    amenities: ["Landscaped Garden", "Vastu Compliant", "Security", "Power Backup", "Balcony", "Modular Kitchen"],
    latitude: 26.87,
    longitude: 75.7,
    createdAt: "2026-02-10",
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
    description:
      "Bank loan approved 2 BHK smart home of 1150 sq.ft. on Shaheed Path, Lucknow — under construction with flexi payment plans at ₹72 Lakh.",
    images: [apartment, villa2, plots],
    status: "For Sale",
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    amenities: ["Clubhouse", "Gymnasium", "Security", "Power Backup", "Kids Play Area", "Balcony"],
    latitude: 26.78,
    longitude: 80.98,
    createdAt: "2026-01-30",
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
    description:
      "Low-density 4 BHK residence of 2650 sq.ft. on Golf Course Extension Road, Gurugram with concierge services and metro connectivity, priced at ₹4.20 Crore.",
    images: [apartment, villa, commercial],
    status: "For Sale",
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    amenities: ["Swimming Pool", "Gymnasium", "Concierge", "Security", "Air Conditioning", "Power Backup"],
    latitude: 28.42,
    longitude: 77.07,
    createdAt: "2026-02-05",
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
