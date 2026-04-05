import { createLazyFileRoute } from "@tanstack/react-router";
import Life from "@/components/apps/life/Life";

export const Route = createLazyFileRoute("/apps/life")({
  component: Life,
});
