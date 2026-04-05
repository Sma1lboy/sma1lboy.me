import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/resume")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
