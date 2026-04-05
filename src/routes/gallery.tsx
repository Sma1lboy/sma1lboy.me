import { createFileRoute } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { GalleryPageSkeleton } from "@/components/gallery/GalleryPageSkeleton";

export const Route = createFileRoute("/gallery")({
  component: () => null,
  pendingComponent: GalleryPageSkeleton,
  errorComponent: RouteErrorBoundary,
});
