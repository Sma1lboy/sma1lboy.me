import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useThemeStore } from "@/store/themeStore";

const SEQUENCE_TIMEOUT = 800;

function isEditableTarget(e: KeyboardEvent): boolean {
  const tag = (e.target as HTMLElement)?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if ((e.target as HTMLElement)?.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts({
  onToggleShortcutsModal,
}: {
  onToggleShortcutsModal: () => void;
}) {
  const navigate = useNavigate();
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = useCallback(() => {
    pendingRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't fire shortcuts when typing in inputs
      if (isEditableTarget(e)) return;

      // Don't intercept modifier combos (Cmd+K, Ctrl+anything, etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;

      // If we have a pending first key, check for second key
      if (pendingRef.current === "g") {
        clearPending();

        const routes: Record<string, string> = {
          h: "/",
          b: "/blog",
          p: "/projects",
          r: "/resume",
          t: "/timeline",
          c: "/contact",
          u: "/uses",
          l: "/reading",
          s: "/snippets",
          n: "/changelog",
        };

        if (routes[key]) {
          e.preventDefault();
          navigate({ to: routes[key] });
          return;
        }
        // Not a valid second key — fall through to handle as standalone
      }

      // Start a sequence with "g"
      if (key === "g") {
        e.preventDefault();
        pendingRef.current = "g";
        timerRef.current = setTimeout(clearPending, SEQUENCE_TIMEOUT);
        return;
      }

      // Single-key shortcuts
      if (key === "t") {
        e.preventDefault();
        toggleTheme();
        return;
      }

      if (key === "/") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("open-command-palette"));
        return;
      }

      if (key === "?") {
        e.preventDefault();
        onToggleShortcutsModal();
        return;
      }

      if (key === "Escape") {
        // Escape is handled by individual modals; no need to preventDefault here
        return;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      clearPending();
    };
  }, [navigate, toggleTheme, onToggleShortcutsModal, clearPending]);
}
