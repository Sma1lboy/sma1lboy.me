import { createLazyFileRoute } from "@tanstack/react-router";
import UnitConverter from "@/components/apps/units/UnitConverter";

export const Route = createLazyFileRoute("/apps/units")({
  component: UnitConverter,
});
