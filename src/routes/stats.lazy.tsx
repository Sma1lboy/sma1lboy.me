import { createLazyFileRoute } from "@tanstack/react-router";
import StatsPage from "@/components/stats/StatsPage";

export const Route = createLazyFileRoute("/stats")({
  component: StatsPage,
});
