import { createLazyFileRoute } from "@tanstack/react-router";
import Timer from "@/components/apps/timer/Timer";

export const Route = createLazyFileRoute("/apps/timer")({
  component: Timer,
});
