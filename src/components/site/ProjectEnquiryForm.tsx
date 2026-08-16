import { useState } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { B } from "@/components/site/buttons";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  mobile: z
    .string()
    .trim()
    .min(6, "Please enter a valid mobile number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid mobile number"),
  project: z.string().trim().max(150),
  budget: z.string().trim().max(100),
  buyerType: z.enum(["Buyer", "Investor"]),
});

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";
const label = "grid gap-1.5 text-sm font-medium";

export function ProjectEnquiryForm({
  projectName,
  projectOptions = [],
}: {
  projectName?: string;
  projectOptions?: string[];
}) {
  const [values, setValues] = useState({
    name: "",
    mobile: "",
    project: projectName ?? projectOptions[0] ?? "",
    budget: "",
    buyerType: "Buyer" as "Buyer" | "Investor",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof values, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setSending(true);
    const { error } = await supabase.from("project_enquiries").insert({
      name: parsed.data.name,
      mobile: parsed.data.mobile,
      project: parsed.data.project,
      budget: parsed.data.budget,
      buyer_type: parsed.data.buyerType,
    } as never);
    setSending(false);
    if (error) {
      setErrors({ form: "Could not send right now. Please call or WhatsApp us instead." });
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <CheckCircle2 className="mx-auto size-10 text-gold" />
        <p className="mt-4 text-base leading-relaxed text-foreground">
          Thank you for your interest. Our consultant will contact you shortly with the latest project
          information.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Name
          <input className={field} value={values.name} onChange={(e) => set("name", e.target.value)} maxLength={100} />
          {errors["name"] ? <span className="text-xs text-destructive">{errors["name"]}</span> : null}
        </label>
        <label className={label}>
          Mobile number
          <input
            className={field}
            inputMode="tel"
            value={values.mobile}
            onChange={(e) => set("mobile", e.target.value)}
            maxLength={20}
          />
          {errors["mobile"] ? <span className="text-xs text-destructive">{errors["mobile"]}</span> : null}
        </label>
        <label className={label}>
          Interested project
          {projectOptions.length ? (
            <select className={field} value={values.project} onChange={(e) => set("project", e.target.value)}>
              {projectOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input className={field} value={values.project} onChange={(e) => set("project", e.target.value)} maxLength={150} />
          )}
        </label>
        <label className={label}>
          Budget
          <input
            className={field}
            value={values.budget}
            onChange={(e) => set("budget", e.target.value)}
            placeholder="₹30 – 50 Lakh"
            maxLength={100}
          />
        </label>
        <label className={label}>
          I am a
          <select className={field} value={values.buyerType} onChange={(e) => set("buyerType", e.target.value)}>
            <option>Buyer</option>
            <option>Investor</option>
          </select>
        </label>
      </div>

      {errors["form"] ? <p className="mt-4 text-sm text-destructive">{errors["form"]}</p> : null}

      <B type="submit" variant="gold" className="mt-6 w-full sm:w-auto" disabled={sending}>
        {sending ? "Sending…" : "Register Interest"}
      </B>
    </form>
  );
}
