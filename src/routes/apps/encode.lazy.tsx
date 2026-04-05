import { createLazyFileRoute } from "@tanstack/react-router";
import EncoderDecoder from "@/components/apps/encode/EncoderDecoder";

export const Route = createLazyFileRoute("/apps/encode")({
  component: EncoderDecoder,
});
