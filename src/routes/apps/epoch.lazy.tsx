import { createLazyFileRoute } from "@tanstack/react-router";
import EpochConverter from "@/components/apps/epoch/EpochConverter";

export const Route = createLazyFileRoute("/apps/epoch")({
  component: EpochConverter,
});
