import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import { site } from "@/data/site";
import { L } from "./buttons";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/properties", label: "Properties" },
  { to: "/projects", label: "Projects" },
  { to: "/upcoming-projects", label: "Upcoming" },
  { to: "/services", label: "Services" },
  { to: "/locations", label: "Locations" },
  { to: "/emi-calculator", label: "EMI" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-base text-primary-foreground">
            MG
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg">{site.name}</span>
            <span className="block text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
              {site.role}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.phone}`}
            aria-label="Call Mohit Gaur"
            className="hidden size-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary sm:flex"
          >
            <Phone className="size-4" />
          </a>
          <L to="/contact" variant="gold" className="hidden px-5 py-2.5 sm:inline-flex">
            Book a Site Visit
          </L>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-background px-5 py-4 lg:hidden">
          <ul className="grid gap-1">
            {nav.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-secondary"
                  activeProps={{ className: "bg-secondary font-semibold" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
