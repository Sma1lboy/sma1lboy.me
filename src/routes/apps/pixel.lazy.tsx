import { createLazyFileRoute } from "@tanstack/react-router";
import PixelEditor from "@/components/apps/pixel/PixelEditor";

export const Route = createLazyFileRoute("/apps/pixel")({
  component: PixelEditor,
});
