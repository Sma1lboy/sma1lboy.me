import { useCallback, useState } from "react";
import { createRootRoute } from "@tanstack/react-router";
import { CommandPalette } from "@/components/CommandPalette";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { PageTransition } from "@/components/PageTransition";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function RootComponent() {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const toggleShortcuts = useCallback(() => setShortcutsOpen((v) => !v), []);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useKeyboardShortcuts({ onToggleShortcutsModal: toggleShortcuts });

  return (
    <>
      <CommandPalette />
      <KeyboardShortcutsModal open={shortcutsOpen} onClose={closeShortcuts} />
      <PageTransition />
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
