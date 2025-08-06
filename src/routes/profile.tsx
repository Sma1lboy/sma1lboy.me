import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../components/profile";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});