import { createLazyFileRoute } from "@tanstack/react-router";
import NetworkInfo from "@/components/apps/network/NetworkInfo";

export const Route = createLazyFileRoute("/apps/network")({
  component: NetworkInfo,
});
