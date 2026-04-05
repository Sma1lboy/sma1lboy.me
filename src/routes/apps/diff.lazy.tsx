import { createLazyFileRoute } from "@tanstack/react-router";
import Diff from "@/components/apps/diff/Diff";

export const Route = createLazyFileRoute("/apps/diff")({
  component: Diff,
});
