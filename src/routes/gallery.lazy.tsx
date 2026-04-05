import { createLazyFileRoute } from "@tanstack/react-router";
import GalleryPage from "@/components/gallery/GalleryPage";

export const Route = createLazyFileRoute("/gallery")({
  component: GalleryPage,
});
