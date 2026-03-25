import { createLazyFileRoute } from "@tanstack/react-router";
import CmtPage from "@/components/cmt/CmtPage";

export const Route = createLazyFileRoute("/cmt")({
  component: CmtPage,
});
