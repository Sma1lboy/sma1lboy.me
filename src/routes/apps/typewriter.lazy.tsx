import { createLazyFileRoute } from "@tanstack/react-router";
import Typewriter from "@/components/apps/typewriter/Typewriter";

export const Route = createLazyFileRoute("/apps/typewriter")({
  component: Typewriter,
});
