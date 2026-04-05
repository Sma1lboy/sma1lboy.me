import { createLazyFileRoute } from "@tanstack/react-router";
import GuestbookPage from "@/components/guestbook/GuestbookPage";

export const Route = createLazyFileRoute("/guestbook")({
  component: GuestbookPage,
});
