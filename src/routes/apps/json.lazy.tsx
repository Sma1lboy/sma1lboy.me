import { createLazyFileRoute } from "@tanstack/react-router";
import JsonFormatter from "@/components/apps/json/JsonFormatter";

export const Route = createLazyFileRoute("/apps/json")({
  component: JsonFormatter,
});
