import { createLazyFileRoute } from "@tanstack/react-router";
import MinesweeperGame from "@/components/apps/minesweeper/MinesweeperGame";

export const Route = createLazyFileRoute("/apps/minesweeper")({
  component: MinesweeperGame,
});
