import { useEffect, useState } from "react";
import { ShieldCheck, X, Info, ExternalLink, BadgeCheck } from "lucide-react";
import type { Property } from "@/data/site";
import { isReraRegistered } from "@/data/site";

export function ReraBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground ${className}`}
    >
      <ShieldCheck className="size-3.5" /> RERA Registered
    </span>
  );
}

export function ReraTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="About RERA registration"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Info className="size-4" />
      </button>
      {open ? (
        <span className="absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-2xl border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground shadow-[var(--shadow-card)]">
          RERA registration helps buyers access project registration and regulatory information. Always verify
          the registration details with the relevant state RERA authority before making a purchase.
        </span>
      ) : null}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="grid gap-0.5 border-b border-border py-3 last:border-0 sm:grid-cols-[11rem_1fr]">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export function ReraDetailsModal({ property, onClose }: { property: Property; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const registered = isReraRegistered(property);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`RERA details for ${property.name}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {registered ? <ReraBadge /> : null}
            <h3 className="mt-3 text-2xl">{property.name}</h3>
            <p className="text-sm text-muted-foreground">
              {property.location}, {property.city}
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 hover:bg-secondary">
            <X className="size-4" />
          </button>
        </div>

        <dl className="mt-5">
          <Row label="RERA Reg. No." value={property.reraRegistrationNumber} />
          <Row label="RERA Status" value={property.reraStatus} />
          <Row label="RERA Authority" value={property.reraAuthority} />
          <Row label="Platform Verification" value={property.reraVerificationStatus} />
          <Row label="Last Verified" value={property.reraLastVerifiedDate ?? ""} />
          <Row label="Project Name" value={property.projectName} />
          <Row label="Developer / Promoter" value={property.developerName} />
          <Row label="Property Type" value={property.type} />
          <Row label="Location" value={`${property.location}, ${property.city}`} />
          <Row label="Price" value={property.price} />
          <Row label="Size" value={property.size} />
          <Row label="Possession" value={property.possessionStatus} />
          <Row label="Authority Approval" value={property.authorityApprovalStatus} />
        </dl>

        {property.reraProjectUrl ? (
          <a
            href={property.reraProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            <ExternalLink className="size-4" /> Open official RERA project page
          </a>
        ) : null}

        <p className="mt-5 rounded-2xl bg-secondary p-4 text-xs leading-relaxed text-muted-foreground">
          <BadgeCheck className="mr-1 inline size-3.5" />
          RERA registration indicates the project is registered with the state RERA authority. It is not a
          guarantee or government endorsement of the property. Please verify all details directly with the
          relevant state RERA authority before purchase.
        </p>
      </div>
    </div>
  );
}
