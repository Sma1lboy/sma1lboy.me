import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "@/components/apps/chat/Chat";

export const Route = createLazyFileRoute("/apps/chat")({
  component: Chat,
});
