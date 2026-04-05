import { createLazyFileRoute } from "@tanstack/react-router";
import PerfPage from "@/components/perf/PerfPage";

export const Route = createLazyFileRoute("/perf")({
  component: PerfPage,
});
