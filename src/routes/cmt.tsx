import CmtPage from "@/components/cmt/CmtPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cmt")({
  component: CmtPage,
});
