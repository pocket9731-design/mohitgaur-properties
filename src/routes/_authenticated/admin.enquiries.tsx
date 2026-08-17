import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, MessageCircle, Phone, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/site/Section";
import { B, btnStyles } from "@/components/site/buttons";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Project Enquiries | Mohit Gaur" },
      { name: "description", content: "Review and reply to project enquiry requests from the website." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Project Enquiries" },
      { property: "og:description", content: "Owner dashboard for project enquiry requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminEnquiries,
});

type Enquiry = {
  id: string;
  name: string;
  mobile: string;
  project: string;
  budget: string;
  buyer_type: string;
  message: string;
  status: string;
  admin_note: string;
  replied_at: string | null;
  created_at: string;
};

const ENQUIRY_COLUMNS =
  "id,name,mobile,project,budget,buyer_type,message,status,admin_note,replied_at,created_at";

const field =
  "w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-gold";

const waNumber = (mobile: string) => {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits.replace(/^0+/, "");
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

async function fetchEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase
    .from("project_enquiries")
    .select(ENQUIRY_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Enquiry[];
}

function AdminEnquiries() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "replied" | "all">("pending");

  const list = useQuery({ queryKey: ["admin-enquiries"], queryFn: fetchEnquiries });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("project_enquiries").update(patch as never).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("project_enquiries").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Enquiry removed");
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const all = list.data ?? [];
  const pending = all.filter((e) => e.status !== "replied");
  const rows = tab === "all" ? all : tab === "pending" ? pending : all.filter((e) => e.status === "replied");

  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Owner dashboard</p>
          <h1 className="mt-3 text-3xl">Project enquiries</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {pending.length} pending {pending.length === 1 ? "request" : "requests"} waiting for a reply.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/upcoming" className={btnStyles.outline}>
            <ArrowLeft className="size-4" /> Upcoming projects
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["pending", "replied", "all"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full border px-4 py-2 text-sm capitalize transition-colors ${
              tab === t ? "border-gold bg-gold/10 text-gold" : "border-border hover:bg-secondary"
            }`}
          >
            {t}
            {t === "pending" && pending.length > 0 ? ` (${pending.length})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {list.isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : null}
        {list.error ? <p className="text-sm text-destructive">{(list.error as Error).message}</p> : null}
        {rows.map((e) => (
          <EnquiryCard
            key={e.id}
            enquiry={e}
            onToggle={() =>
              update.mutate({
                id: e.id,
                patch:
                  e.status === "replied"
                    ? { status: "pending", replied_at: null }
                    : { status: "replied", replied_at: new Date().toISOString() },
              })
            }
            onSaveNote={(note) => update.mutate({ id: e.id, patch: { admin_note: note } })}
            onDelete={() => {
              if (confirm(`Remove the enquiry from "${e.name}"?`)) remove.mutate(e.id);
            }}
          />
        ))}
        {!list.isLoading && rows.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No {tab === "all" ? "" : tab} enquiries yet.
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function EnquiryCard({
  enquiry: e,
  onToggle,
  onSaveNote,
  onDelete,
}: {
  enquiry: Enquiry;
  onToggle: () => void;
  onSaveNote: (note: string) => void;
  onDelete: () => void;
}) {
  const [note, setNote] = useState(e.admin_note ?? "");
  const replied = e.status === "replied";
  const wa = `https://wa.me/${waNumber(e.mobile)}?text=${encodeURIComponent(
    `Hello ${e.name}, thank you for your interest in ${e.project || "our upcoming projects"}. Here are the complete details you requested.`,
  )}`;

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg">{e.name}</p>
          <p className="text-sm text-muted-foreground">
            {e.mobile} · {e.buyer_type}
            {e.budget ? ` · ${e.budget}` : ""}
          </p>
          <p className="mt-1 text-sm text-gold">{e.project || "General enquiry"}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${
            replied ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {replied ? "Replied" : "Pending"}
        </span>
      </div>

      {e.message ? <p className="mt-3 text-sm text-muted-foreground">{e.message}</p> : null}

      <p className="mt-3 text-xs text-muted-foreground">
        Received {fmt(e.created_at)}
        {replied && e.replied_at ? ` · Replied ${fmt(e.replied_at)}` : ""}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={wa} target="_blank" rel="noreferrer" className={`${btnStyles.gold} px-4 py-2`}>
          <MessageCircle className="size-4" /> Reply on WhatsApp
        </a>
        <a href={`tel:${e.mobile.replace(/\s/g, "")}`} className={`${btnStyles.outline} px-4 py-2`}>
          <Phone className="size-4" /> Call
        </a>
        <B variant="outline" className="px-4 py-2" onClick={onToggle}>
          {replied ? <RotateCcw className="size-4" /> : <Check className="size-4" />}
          {replied ? "Mark pending" : "Mark replied"}
        </B>
        <B variant="outline" className="px-4 py-2 text-destructive" onClick={onDelete}>
          <Trash2 className="size-4" /> Delete
        </B>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-start">
        <textarea
          className={`${field} min-h-16`}
          placeholder="Internal note (what you told the client, next follow-up…)"
          value={note}
          onChange={(ev) => setNote(ev.target.value)}
        />
        <B
          variant="outline"
          className="px-4 py-2"
          onClick={() => {
            onSaveNote(note);
            toast.success("Note saved");
          }}
        >
          Save note
        </B>
      </div>
    </article>
  );
}
