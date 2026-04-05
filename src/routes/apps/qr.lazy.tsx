import { createLazyFileRoute } from "@tanstack/react-router";
import QrGenerator from "@/components/apps/qr/QrGenerator";

export const Route = createLazyFileRoute("/apps/qr")({
  component: QrGenerator,
});
