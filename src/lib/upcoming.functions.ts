import { createServerFn } from "@tanstack/react-start";
import { loadUpcomingProjects } from "@/lib/upcoming.server";

export const fetchUpcomingProjects = createServerFn({ method: "GET" }).handler(async () => {
  return loadUpcomingProjects();
});
