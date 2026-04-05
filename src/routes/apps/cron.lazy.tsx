import { createLazyFileRoute } from "@tanstack/react-router";
import CronParser from "@/components/apps/cron/CronParser";

export const Route = createLazyFileRoute("/apps/cron")({
  component: CronParser,
});
