import { createLazyFileRoute } from "@tanstack/react-router";
import Terminal from "@/components/apps/terminal/Terminal";

export const Route = createLazyFileRoute("/apps/terminal")({
  component: Terminal,
});
