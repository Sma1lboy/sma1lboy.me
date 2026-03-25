import { createLazyFileRoute } from "@tanstack/react-router";
import Receipt from "@/components/apps/receipt/Receipt";

export const Route = createLazyFileRoute("/apps/receipt")({
  component: Receipt,
});
