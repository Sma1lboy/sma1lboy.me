import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  items: ShortcutItem[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    items: [
      { keys: ["g", "h"], description: "Go to Home" },
      { keys: ["g", "b"], description: "Go to Blog" },
      { keys: ["g", "p"], description: "Go to Projects" },
      { keys: ["g", "r"], description: "Go to Resume" },
      { keys: ["g", "t"], description: "Go to Timeline" },
      { keys: ["g", "c"], description: "Go to Contact" },
      { keys: ["g", "u"], description: "Go to Uses" },
      { keys: ["g", "l"], description: "Go to Reading List" },
      { keys: ["g", "s"], description: "Go to Snippets" },
      { keys: ["g", "n"], description: "Go to Changelog" },
    ],
  },
  {
    title: "Actions",
    items: [
      { keys: ["t"], description: "Toggle theme" },
      { keys: ["/"], description: "Open search" },
      { keys: ["?"], description: "Show this help" },
      { keys: ["Esc"], description: "Close modal / overlay" },
    ],
  },
];

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="border-border bg-muted text-muted-foreground inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 font-mono text-xs font-medium">
      {children}
    </kbd>
  );
}

export function KeyboardShortcutsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="border-border bg-card relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
              <h2 className="text-foreground text-sm font-semibold">Keyboard Shortcuts</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <kbd className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-medium">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {shortcutGroups.map((group, gi) => (
                <div key={group.title} className={gi > 0 ? "mt-5" : ""}>
                  <h3 className="text-muted-foreground mb-2.5 text-xs font-medium uppercase tracking-wide">
                    {group.title}
                  </h3>
                  <div className="space-y-1.5">
                    {group.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5"
                      >
                        <span className="text-foreground text-sm">{item.description}</span>
                        <span className="flex items-center gap-1">
                          {item.keys.map((k, ki) => (
                            <span key={ki} className="flex items-center gap-1">
                              {ki > 0 && (
                                <span className="text-muted-foreground text-xs">then</span>
                              )}
                              <Kbd>{k}</Kbd>
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-border text-muted-foreground border-t px-5 py-2.5 text-center text-[11px]">
              Press{" "}
              <kbd className="border-border bg-muted rounded border px-1 py-0.5 text-[10px]">
                ?
              </kbd>{" "}
              to toggle this overlay
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
