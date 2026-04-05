import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/timeline")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
