import { createLazyFileRoute } from "@tanstack/react-router";
import RegexTester from "@/components/apps/regex/RegexTester";

export const Route = createLazyFileRoute("/apps/regex")({
  component: RegexTester,
});
