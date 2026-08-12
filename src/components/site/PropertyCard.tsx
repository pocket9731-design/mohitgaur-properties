import { MapPin, Maximize2, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/site";
import { waLink } from "@/data/site";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="card-lift group overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} — ${p.type} in ${p.city}`}
          loading="lazy"
          width={1200}
          height={900}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-foreground">
          {p.type}
        </span>
      </div>

      <div className="p-6">
        <h3 className="text-xl">{p.name}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" /> {p.location}, {p.city}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Maximize2 className="size-3.5" /> {p.size}
        </p>
        <p className="mt-4 font-display text-2xl text-gold">{p.price}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {p.highlights.map((h) => (
            <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/contact"
            search={{ property: p.name }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Details
          </Link>
          <a
            href={waLink(`Hello Mohit, I am interested in ${p.name} (${p.location}, ${p.city}) — ${p.price}. Please share details.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <MessageCircle className="size-4" /> Enquire on WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
