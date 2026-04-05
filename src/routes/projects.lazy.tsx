import { createLazyFileRoute } from "@tanstack/react-router";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";

export const Route = createLazyFileRoute("/projects")({
  component: ProjectsGallery,
});
