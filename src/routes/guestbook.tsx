import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";

export const Route = createFileRoute("/guestbook")({
  component: () => null,
  errorComponent: RouteErrorBoundary,
});
