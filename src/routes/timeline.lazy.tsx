import { createLazyFileRoute } from "@tanstack/react-router";
import TimelinePage from "@/components/timeline/TimelinePage";

export const Route = createLazyFileRoute("/timeline")({
  component: TimelinePage,
});
