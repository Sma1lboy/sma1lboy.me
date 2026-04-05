import { createLazyFileRoute } from "@tanstack/react-router";
import SnakeGame from "@/components/apps/snake/SnakeGame";

export const Route = createLazyFileRoute("/apps/snake")({
  component: SnakeGame,
});
