import { createLazyFileRoute } from "@tanstack/react-router";
import BlogPostPage from "@/components/blog/BlogPostPage";

export const Route = createLazyFileRoute("/blog/$slug")({
  component: BlogPostPage,
});
