import { createLazyFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../components/profile";

export const Route = createLazyFileRoute("/profile")({
  component: ProfilePage,
});
