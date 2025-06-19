import { createFileRoute } from "@tanstack/react-router";
import { Home } from "../components";

export const Route = createFileRoute("/")({
  component: Home,
});
