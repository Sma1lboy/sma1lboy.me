import { createLazyFileRoute } from "@tanstack/react-router";
import DrawingCanvas from "@/components/apps/draw/DrawingCanvas";

export const Route = createLazyFileRoute("/apps/draw")({
  component: DrawingCanvas,
});
