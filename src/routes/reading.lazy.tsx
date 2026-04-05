import { createLazyFileRoute } from "@tanstack/react-router";
import ReadingPage from "@/components/reading/ReadingPage";

export const Route = createLazyFileRoute("/reading")({
  component: ReadingPage,
});
