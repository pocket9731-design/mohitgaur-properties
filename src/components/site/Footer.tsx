import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { site, waLink } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-ink px-5 py-14 text-primary-foreground sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl">{site.name}</p>
          <p className="mt-1 text-sm uppercase tracking-[0.18em] opacity-70">{site.role}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-80">
            Helping families and investors buy, sell and invest in the right properties across Agra,
            Delhi NCR and India — with verified options and transparent guidance.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-primary-foreground/25 px-4 py-1.5 text-xs transition-colors hover:bg-primary-foreground/10"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-60">Explore</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {[
              { to: "/properties", label: "Properties" },
              { to: "/projects", label: "Projects" },
              { to: "/services", label: "Services" },
              { to: "/locations", label: "Locations" },
              { to: "/about", label: "About Me" },
              { to: "/testimonials", label: "Testimonials" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="opacity-80 transition-opacity hover:opacity-100">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] opacity-60">Contact</p>
          <ul className="mt-4 grid gap-3 text-sm">
            <li>
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 opacity-80 hover:opacity-100">
                <Phone className="size-4" /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 opacity-80 hover:opacity-100">
                <Mail className="size-4" /> {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2 opacity-80">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {site.address}
            </li>
            <li>
              <a
                href={waLink("Hello Mohit, I would like to discuss a property.")}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100"
              >
                WhatsApp Me
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs opacity-70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/privacy-policy" className="hover:opacity-100">Privacy Policy</Link>
          <Link to="/terms" className="hover:opacity-100">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
