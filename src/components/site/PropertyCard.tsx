import { useState } from "react";
import { MapPin, Maximize2, MessageCircle, BedDouble, Bath, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/site";
import { waLink, isReraRegistered } from "@/data/site";
import { ReraBadge, ReraDetailsModal } from "@/components/site/Rera";
import { ShareButton } from "@/components/site/ShareProperty";
import fallbackImg from "@/assets/prop-plots.jpg";

export function PropertyCard({ p }: { p: Property }) {
  const [reraOpen, setReraOpen] = useState(false);
  const rera = isReraRegistered(p);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://mohitgaur-properties.lovable.app";
  const shareUrl = `${origin}/properties/${p.id}`;

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.image}
          alt={`${p.name} — ${p.type} in ${p.city}`}
          loading="lazy"
          width={1200}
          height={900}
          onError={(e) => {
            e.currentTarget.src = fallbackImg;
          }}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-foreground">
          {p.type}
        </span>
        <span className="absolute right-14 top-4 rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          {p.status}
        </span>
        <ShareButton
          variant="icon"
          url={shareUrl}
          title={`${p.name} — ${p.location}, ${p.city}`}
          detail={`${p.price} · ${p.size}`}
        />
        {rera ? <ReraBadge className="absolute bottom-4 left-4" /> : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl">{p.name}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" /> {p.location}, {p.city}
        </p>

        {rera ? (
          <div className="mt-3 rounded-2xl border border-emerald-600/25 bg-emerald-600/5 p-3 text-xs leading-relaxed">
            <p className="font-semibold">RERA Reg. No. {p.reraRegistrationNumber}</p>
            {p.projectName ? <p className="text-muted-foreground">Project: {p.projectName}</p> : null}
            {p.developerName ? <p className="text-muted-foreground">Developer: {p.developerName}</p> : null}
            {p.possessionStatus ? (
              <p className="text-muted-foreground">Possession: {p.possessionStatus}</p>
            ) : null}
            <button
              type="button"
              onClick={() => setReraOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 font-semibold text-emerald-700 underline-offset-4 hover:underline"
            >
              <ShieldCheck className="size-3.5" /> View RERA Details
            </button>
          </div>
        ) : null}

        <p className="mt-4 font-display text-2xl text-gold">{p.price}</p>

        {p.offer ? (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold">
            <Sparkles className="size-3.5" /> {p.offer}
          </p>
        ) : null}

        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {p.bedrooms > 0 ? (
            <li className="flex items-center gap-1.5">
              <BedDouble className="size-3.5" /> {p.bedrooms} Beds
            </li>
          ) : null}
          {p.bathrooms > 0 ? (
            <li className="flex items-center gap-1.5">
              <Bath className="size-3.5" /> {p.bathrooms} Baths
            </li>
          ) : null}
          <li className="flex items-center gap-1.5">
            <Maximize2 className="size-3.5" /> {p.size}
          </li>
        </ul>

        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {p.highlights.slice(0, 3).map((h) => (
            <li key={h} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Link
            to="/properties/$id"
            params={{ id: p.id }}
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
      {reraOpen ? <ReraDetailsModal property={p} onClose={() => setReraOpen(false)} /> : null}
    </article>

  );
}
