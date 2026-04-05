import { createLazyFileRoute } from "@tanstack/react-router";
import Weather from "@/components/apps/weather/Weather";

export const Route = createLazyFileRoute("/apps/weather")({
  component: Weather,
});
