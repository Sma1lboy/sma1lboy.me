import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/apps/tetris")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
