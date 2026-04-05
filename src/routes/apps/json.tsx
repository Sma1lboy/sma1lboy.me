import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/apps/json")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
