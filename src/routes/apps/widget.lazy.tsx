import { createLazyFileRoute } from "@tanstack/react-router";
import WidgetGenerator from "@/components/apps/widget/WidgetGenerator";

export const Route = createLazyFileRoute("/apps/widget")({
  component: WidgetGenerator,
});
