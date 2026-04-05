import { createLazyFileRoute } from "@tanstack/react-router";
import ContactPage from "@/components/contact";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPage,
});
