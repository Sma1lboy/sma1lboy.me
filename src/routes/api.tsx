import ApiPage from "@/components/api/ApiPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api")({
  component: ApiPage,
});
