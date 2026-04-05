import { createLazyFileRoute } from "@tanstack/react-router";
import ResumePage from "@/components/resume/ResumePage";

export const Route = createLazyFileRoute("/resume")({
  component: ResumePage,
});
