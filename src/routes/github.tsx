import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/github")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
