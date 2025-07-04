import { createFileRoute } from "@tanstack/react-router";
import { Friends } from "../components";

export const Route = createFileRoute("/friends")({
  component: Friends,
});
