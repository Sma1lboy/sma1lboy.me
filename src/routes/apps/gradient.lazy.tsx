import { createLazyFileRoute } from "@tanstack/react-router";
import GradientGenerator from "@/components/apps/gradient/GradientGenerator";

export const Route = createLazyFileRoute("/apps/gradient")({
  component: GradientGenerator,
});
