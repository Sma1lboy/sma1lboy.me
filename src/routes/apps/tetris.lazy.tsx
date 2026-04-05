import { createLazyFileRoute } from "@tanstack/react-router";
import TetrisGame from "@/components/apps/tetris/TetrisGame";

export const Route = createLazyFileRoute("/apps/tetris")({
  component: TetrisGame,
});
