import Typewriter from "@/components/apps/typewriter/Typewriter";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/apps/typewriter")({
  component: TypewriterApp,
});

function TypewriterApp() {
  return <Typewriter />;
}
