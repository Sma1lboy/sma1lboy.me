import { createLazyFileRoute } from "@tanstack/react-router";
import KanbanBoard from "@/components/apps/kanban/KanbanBoard";

export const Route = createLazyFileRoute("/apps/kanban")({
  component: KanbanBoard,
});
