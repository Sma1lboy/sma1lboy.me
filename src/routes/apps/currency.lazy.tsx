import { createLazyFileRoute } from "@tanstack/react-router";
import CurrencyConverter from "@/components/apps/currency/CurrencyConverter";

export const Route = createLazyFileRoute("/apps/currency")({
  component: CurrencyConverter,
});
