import { createLazyFileRoute } from "@tanstack/react-router";
import BorderRadiusGenerator from "@/components/apps/radius/BorderRadiusGenerator";

export const Route = createLazyFileRoute("/apps/radius")({
  component: BorderRadiusGenerator,
});
