import { createLazyFileRoute } from "@tanstack/react-router";
import ColorPicker from "@/components/apps/colors/ColorPicker";

export const Route = createLazyFileRoute("/apps/colors")({
  component: ColorPicker,
});
