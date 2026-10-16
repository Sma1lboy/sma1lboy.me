import { createLazyFileRoute } from "@tanstack/react-router";
import Resume from "@/components/resume/Resume";

export const Route = createLazyFileRoute("/resume")({
  component: Resume,
});
