import { createLazyFileRoute } from "@tanstack/react-router";
import Game2048 from "@/components/apps/2048/Game2048";

export const Route = createLazyFileRoute("/apps/2048")({
  component: Game2048,
});
