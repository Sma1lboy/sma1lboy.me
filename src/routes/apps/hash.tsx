import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/apps/hash")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
