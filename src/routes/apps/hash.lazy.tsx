import { createLazyFileRoute } from "@tanstack/react-router";
import HashGenerator from "@/components/apps/hash/HashGenerator";

export const Route = createLazyFileRoute("/apps/hash")({
  component: HashGenerator,
});
