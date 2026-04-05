import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/reading")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
