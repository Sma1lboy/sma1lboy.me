import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/apps/2048")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
