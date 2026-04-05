import { createFileRoute } from "@tanstack/react-router";
import { BlogListSkeleton } from "@/components/blog/BlogListSkeleton";

export const Route = createFileRoute("/blog/")({
  component: () => null,
  pendingComponent: BlogListSkeleton,
});
