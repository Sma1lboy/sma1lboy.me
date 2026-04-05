import { createLazyFileRoute } from "@tanstack/react-router";
import TypingTest from "@/components/apps/typing/TypingTest";

export const Route = createLazyFileRoute("/apps/typing")({
  component: TypingTest,
});
