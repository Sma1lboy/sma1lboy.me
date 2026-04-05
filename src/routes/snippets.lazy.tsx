import { createLazyFileRoute } from "@tanstack/react-router";
import SnippetsPage from "@/components/snippets/SnippetsPage";

export const Route = createLazyFileRoute("/snippets")({
  component: SnippetsPage,
});
