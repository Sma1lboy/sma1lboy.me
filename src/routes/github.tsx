import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { GitHubPageSkeleton } from "@/components/github/GitHubPageSkeleton";

export const Route = createFileRoute("/github")({
  component: () => null,
  pendingComponent: GitHubPageSkeleton,
  errorComponent: RouteErrorBoundary,
});
