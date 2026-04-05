import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/contact")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
