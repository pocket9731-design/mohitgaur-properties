import { createServerFn } from "@tanstack/react-start";
import { loadProperties } from "@/lib/properties.server";

export const fetchProperties = createServerFn({ method: "GET" }).handler(async () => {
  return loadProperties();
});
