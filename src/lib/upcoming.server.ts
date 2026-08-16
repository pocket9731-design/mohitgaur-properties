import { createClient } from "@supabase/supabase-js";
import {
  UPCOMING_COLUMNS,
  rowToUpcoming,
  type UpcomingProject,
  type UpcomingProjectRow,
} from "@/lib/upcoming-mapper";

function serverClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export async function loadUpcomingProjects(): Promise<UpcomingProject[]> {
  const { data, error } = await serverClient()
    .from("upcoming_projects")
    .select(UPCOMING_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as UpcomingProjectRow[]).map(rowToUpcoming);
}
