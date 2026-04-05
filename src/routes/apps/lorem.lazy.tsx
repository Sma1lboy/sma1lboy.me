import { createLazyFileRoute } from "@tanstack/react-router";
import LoremGenerator from "@/components/apps/lorem/LoremGenerator";

export const Route = createLazyFileRoute("/apps/lorem")({
  component: LoremGenerator,
});
