import { createLazyFileRoute } from "@tanstack/react-router";
import Password from "@/components/apps/password/Password";

export const Route = createLazyFileRoute("/apps/password")({
  component: Password,
});
