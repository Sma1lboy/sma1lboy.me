import { createLazyFileRoute } from "@tanstack/react-router";
import MarkdownEditor from "@/components/apps/markdown/MarkdownEditor";

export const Route = createLazyFileRoute("/apps/markdown")({
  component: MarkdownEditor,
});
