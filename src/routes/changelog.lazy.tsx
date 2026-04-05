import { createLazyFileRoute } from "@tanstack/react-router";
import ChangelogPage from "@/components/changelog/ChangelogPage";

export const Route = createLazyFileRoute("/changelog")({
  component: ChangelogPage,
});
