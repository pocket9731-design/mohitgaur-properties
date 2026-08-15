import { createClient } from "@supabase/supabase-js";
import type { Property } from "@/data/site";
import { PROPERTY_COLUMNS, rowToProperty, type PropertyRow } from "@/lib/property-mapper";

function serverClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export async function loadProperties(): Promise<Property[]> {
  const { data, error } = await serverClient()
    .from("properties")
    .select(PROPERTY_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as PropertyRow[]).map(rowToProperty);
}
