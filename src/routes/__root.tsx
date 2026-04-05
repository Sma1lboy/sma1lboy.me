import { useCallback, useState } from "react";
import { createRootRoute } from "@tanstack/react-router";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { MobileNav } from "@/components/MobileNav";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { Footer } from "@/components/Footer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function RootComponent() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const toggleShortcuts = useCallback(() => setShortcutsOpen((v) => !v), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useKeyboardShortcuts({ onToggleShortcutsModal: toggleShortcuts });

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-2 top-2 z-[99999] -translate-y-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0 dark:bg-white dark:text-gray-900"
      >
        Skip to content
      </a>
      <CommandPalette />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />
      <MobileNav />
      <PageTransition />
      <Footer />
      <ScrollToTop />
      <AmbientPlayer />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: RootErrorBoundary,
});

interface Props extends React.ComponentProps<"div"> {}

export function RootErrorBoundary({ ...rest }: Props) {
  return (
    <div {...rest}>
      <h1 className="text-center text-4xl font-bold">Error</h1>
      <p className="text-center text-2xl">An error occurred. Please try again later.</p>
    </div>
  );
}
