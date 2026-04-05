import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/stats")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
