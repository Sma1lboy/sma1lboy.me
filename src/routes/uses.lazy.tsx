import { createLazyFileRoute } from "@tanstack/react-router";
import UsesPage from "@/components/uses/UsesPage";

export const Route = createLazyFileRoute("/uses")({
  component: UsesPage,
});
