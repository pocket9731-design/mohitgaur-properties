import { Link } from "@tanstack/react-router";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import { site, waLink } from "@/data/site";

export function FloatingCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur md:inset-auto md:bottom-6 md:right-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
      <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-3">
        <a
          href={`tel:${site.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold md:flex-none md:size-14 md:p-0 md:shadow-[var(--shadow-lift)]"
          aria-label="Call now"
        >
          <Phone className="size-4" />
          <span className="md:hidden">Call</span>
        </a>
        <Link
          to="/contact"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-primary-foreground md:flex-none md:size-14 md:p-0 md:shadow-[var(--shadow-lift)]"
          aria-label="Book a site visit"
        >
          <CalendarCheck className="size-4" />
          <span className="md:hidden">Site Visit</span>
        </Link>
        <a
          href={waLink("Hello Mohit, I am interested in a property. Please guide me.")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-3 text-sm font-semibold text-primary-foreground md:flex-none md:size-14 md:p-0 md:shadow-[var(--shadow-lift)]"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="size-4" />
          <span className="md:hidden">WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
