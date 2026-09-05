import type {
  Property,
  PropertyStatus,
  PropertyType,
  ReraStatus,
  ReraVerificationStatus,
} from "@/data/site";

export type PropertyRow = {
  id: string;
  name: string;
  location: string;
  city: string;
  type: string;
  size: string;
  size_sqft: number;
  price: string;
  price_value: number;
  image: string;
  images: string[];
  highlights: string[];
  description: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  amenities: string[];
  latitude: number;
  longitude: number;
  created_at: string;
  offer: string;
  project_name: string;
  developer_name: string;
  rera_status: string;
  rera_registration_number: string;
  rera_authority: string;
  rera_project_url: string;
  rera_verification_status: string;
  rera_last_verified_date: string | null;
  possession_status: string;
  authority_approval_status: string;
  verified_listing: boolean;
  verified_developer: boolean;
  gated_society: boolean;
  parking_available: boolean;
  security_cctv: boolean;
  road_facing: boolean;
  corner_property: boolean;
};

export const PROPERTY_COLUMNS =
  "id,name,location,city,type,size,size_sqft,price,price_value,image,images,highlights,description,status,bedrooms,bathrooms,parking,amenities,latitude,longitude,created_at,offer,project_name,developer_name,rera_status,rera_registration_number,rera_authority,rera_project_url,rera_verification_status,rera_last_verified_date,possession_status,authority_approval_status,verified_listing,verified_developer,gated_society,parking_available,security_cctv,road_facing,corner_property";

export const FALLBACK_IMAGE = "/images/prop-plots.jpg";

export function rowToProperty(row: PropertyRow): Property {
  const images = row.images?.length ? row.images : [row.image || FALLBACK_IMAGE];
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    city: row.city,
    type: row.type as PropertyType,
    size: row.size,
    sizeSqft: Number(row.size_sqft) || 0,
    price: row.price,
    priceValue: Number(row.price_value) || 0,
    image: row.image || images[0] || FALLBACK_IMAGE,
    images,
    highlights: row.highlights ?? [],
    description: row.description,
    status: (row.status as PropertyStatus) ?? "For Sale",
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    parking: Number(row.parking) || 0,
    amenities: row.amenities ?? [],
    latitude: Number(row.latitude) || 0,
    longitude: Number(row.longitude) || 0,
    createdAt: row.created_at,
    offer: row.offer ?? "",
    projectName: row.project_name ?? "",
    developerName: row.developer_name ?? "",
    reraStatus: (row.rera_status as ReraStatus) ?? "Not Registered",
    reraRegistrationNumber: row.rera_registration_number ?? "",
    reraAuthority: row.rera_authority ?? "",
    reraProjectUrl: row.rera_project_url ?? "",
    reraVerificationStatus: (row.rera_verification_status as ReraVerificationStatus) ?? "Unverified",
    reraLastVerifiedDate: row.rera_last_verified_date ?? null,
    possessionStatus: row.possession_status ?? "",
    authorityApprovalStatus: row.authority_approval_status ?? "",
    verifiedListing: Boolean(row.verified_listing),
    verifiedDeveloper: Boolean(row.verified_developer),
    gatedSociety: Boolean(row.gated_society),
    parkingAvailable: Boolean(row.parking_available),
    securityCctv: Boolean(row.security_cctv),
    roadFacing: Boolean(row.road_facing),
    cornerProperty: Boolean(row.corner_property),
  };
}

export function propertyToRow(p: Property): PropertyRow {
  return {
    id: p.id,
    name: p.name,
    location: p.location,
    city: p.city,
    type: p.type,
    size: p.size,
    size_sqft: p.sizeSqft,
    price: p.price,
    price_value: p.priceValue,
    image: p.image,
    images: p.images,
    highlights: p.highlights,
    description: p.description,
    status: p.status,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    amenities: p.amenities,
    latitude: p.latitude,
    longitude: p.longitude,
    created_at: p.createdAt,
    offer: p.offer,
    project_name: p.projectName,
    developer_name: p.developerName,
    rera_status: p.reraStatus,
    rera_registration_number: p.reraRegistrationNumber,
    rera_authority: p.reraAuthority,
    rera_project_url: p.reraProjectUrl,
    rera_verification_status: p.reraVerificationStatus,
    rera_last_verified_date: p.reraLastVerifiedDate,
    possession_status: p.possessionStatus,
    authority_approval_status: p.authorityApprovalStatus,
    verified_listing: p.verifiedListing,
    verified_developer: p.verifiedDeveloper,
    gated_society: p.gatedSociety,
    parking_available: p.parkingAvailable,
    security_cctv: p.securityCctv,
    road_facing: p.roadFacing,
    corner_property: p.cornerProperty,
  };
}


export function similarProperties(all: Property[], property: Property, count = 3): Property[] {
  return all
    .filter((p) => p.id !== property.id)
    .map((p) => ({
      p,
      score:
        (p.city === property.city ? 3 : 0) +
        (p.type === property.type ? 2 : 0) +
        (Math.abs(p.priceValue - property.priceValue) <= property.priceValue * 0.6 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((x) => x.p);
}
