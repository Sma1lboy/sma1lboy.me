import { createFileRoute } from "@tanstack/react-router";
import { HomeAscii } from "../components/homes";

export const Route = createFileRoute("/")({
  component: HomeAscii,
});
