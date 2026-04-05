import { createLazyFileRoute } from "@tanstack/react-router";
import BoxShadowGenerator from "@/components/apps/shadow/BoxShadowGenerator";

export const Route = createLazyFileRoute("/apps/shadow")({
  component: BoxShadowGenerator,
});
