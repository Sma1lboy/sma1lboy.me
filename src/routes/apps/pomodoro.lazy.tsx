import { createLazyFileRoute } from "@tanstack/react-router";
import Pomodoro from "@/components/apps/pomodoro/Pomodoro";

export const Route = createLazyFileRoute("/apps/pomodoro")({
  component: Pomodoro,
});
