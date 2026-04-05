import { createLazyFileRoute } from "@tanstack/react-router";
import AsciiArt from "@/components/apps/ascii/AsciiArt";

export const Route = createLazyFileRoute("/apps/ascii")({
  component: AsciiArt,
});
