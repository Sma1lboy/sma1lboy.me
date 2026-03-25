import { createLazyFileRoute } from "@tanstack/react-router";
import ApiPage from "@/components/api/ApiPage";

export const Route = createLazyFileRoute("/api")({
  component: ApiPage,
});
