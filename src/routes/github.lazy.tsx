import { createLazyFileRoute } from "@tanstack/react-router";
import GitHubActivityPage from "@/components/github";

export const Route = createLazyFileRoute("/github")({
  component: GitHubActivityPage,
});
