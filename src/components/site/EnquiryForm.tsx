import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { locations, propertyTypes, site, waLink } from "@/data/site";
import { B } from "./buttons";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s]{8,16}$/, "Enter a valid phone number"),
  whatsapp: z.string().trim().max(16).optional().or(z.literal("")),
  location: z.string().trim().max(60).optional().or(z.literal("")),
  type: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(800).optional().or(z.literal("")),
});

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";

export function EnquiryForm({ presetProperty }: { presetProperty?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    const v = parsed.data;
    const text = [
      "New property enquiry",
      presetProperty ? `Property: ${presetProperty}` : "",
      `Name: ${v.name}`,
      `Phone: ${v.phone}`,
      v.whatsapp ? `WhatsApp: ${v.whatsapp}` : "",
      v.location ? `Preferred Location: ${v.location}` : "",
      v.type ? `Property Type: ${v.type}` : "",
      v.budget ? `Budget: ${v.budget}` : "",
      v.message ? `Message: ${v.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(waLink(text), "_blank", "noopener,noreferrer");
    toast.success("Thank you! Your enquiry is ready to send on WhatsApp.");
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      {presetProperty ? (
        <p className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          Enquiry for: <strong>{presetProperty}</strong>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name*</label>
          <input id="name" name="name" className={`${field} mt-1.5`} placeholder="Your full name" maxLength={80} />
          {errors["name"] ? <p className="mt-1 text-xs text-destructive">{errors["name"]}</p> : null}
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium">Phone Number*</label>
          <input id="phone" name="phone" inputMode="tel" className={`${field} mt-1.5`} placeholder="+91 XXXXX XXXXX" maxLength={16} />
          {errors["phone"] ? <p className="mt-1 text-xs text-destructive">{errors["phone"]}</p> : null}
        </div>
        <div>
          <label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp Number</label>
          <input id="whatsapp" name="whatsapp" inputMode="tel" className={`${field} mt-1.5`} placeholder="Same as phone?" maxLength={16} />
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium">Preferred Location</label>
          <select id="location" name="location" className={`${field} mt-1.5`} defaultValue="">
            <option value="">Select location</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.name}>{l.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="text-sm font-medium">Property Type</label>
          <select id="type" name="type" className={`${field} mt-1.5`} defaultValue="">
            <option value="">Select type</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="text-sm font-medium">Budget</label>
          <select id="budget" name="budget" className={`${field} mt-1.5`} defaultValue="">
            <option value="">Select budget</option>
            <option>Under ₹50 Lakh</option>
            <option>₹50 Lakh – ₹1 Crore</option>
            <option>₹1 Crore – ₹2 Crore</option>
            <option>Above ₹2 Crore</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium">Message</label>
        <textarea id="message" name="message" rows={4} maxLength={800} className={`${field} mt-1.5 resize-none`} placeholder="Tell me what you are looking for…" />
      </div>

      <B type="submit" variant="gold" className="w-full sm:w-auto">Send Enquiry</B>
      <p className="text-xs text-muted-foreground">
        Prefer talking? Call {site.phoneDisplay} — I usually respond the same day.
      </p>
    </form>
  );
}
