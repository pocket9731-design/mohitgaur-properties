import type { Property, PropertyStatus, PropertyType } from "@/data/site";

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
};

export const PROPERTY_COLUMNS =
  "id,name,location,city,type,size,size_sqft,price,price_value,image,images,highlights,description,status,bedrooms,bathrooms,parking,amenities,latitude,longitude,created_at";

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
