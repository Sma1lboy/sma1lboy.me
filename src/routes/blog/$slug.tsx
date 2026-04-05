import { createFileRoute } from "@tanstack/react-router";
import { BlogPostSkeleton } from "@/components/blog/BlogPostSkeleton";

export const Route = createFileRoute("/blog/$slug")({
  component: () => null,
  pendingComponent: BlogPostSkeleton,
});
