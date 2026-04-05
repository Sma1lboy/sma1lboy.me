import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/i18n";

interface ShortcutItem {
  keys: string[];
  descriptionKey: string;
}

interface ShortcutGroup {
  titleKey: string;
  items: ShortcutItem[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    titleKey: "shortcuts.navigation",
    items: [
      { keys: ["g", "h"], descriptionKey: "shortcuts.goToHome" },
      { keys: ["g", "b"], descriptionKey: "shortcuts.goToBlog" },
      { keys: ["g", "p"], descriptionKey: "shortcuts.goToProjects" },
      { keys: ["g", "r"], descriptionKey: "shortcuts.goToResume" },
      { keys: ["g", "t"], descriptionKey: "shortcuts.goToTimeline" },
      { keys: ["g", "c"], descriptionKey: "shortcuts.goToContact" },
      { keys: ["g", "u"], descriptionKey: "shortcuts.goToUses" },
      { keys: ["g", "l"], descriptionKey: "shortcuts.goToReadingList" },
      { keys: ["g", "s"], descriptionKey: "shortcuts.goToSnippets" },
      { keys: ["g", "n"], descriptionKey: "shortcuts.goToChangelog" },
    ],
  },
  {
    titleKey: "shortcuts.actions",
    items: [
      { keys: ["t"], descriptionKey: "shortcuts.toggleTheme" },
      { keys: ["/"], descriptionKey: "shortcuts.openSearch" },
      { keys: ["?"], descriptionKey: "shortcuts.showHelp" },
      { keys: ["Esc"], descriptionKey: "shortcuts.closeModal" },
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
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => {
        const closeBtn = modalRef.current?.querySelector<HTMLElement>("button");
        closeBtn?.focus();
      });
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

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
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-modal-title"
            className="border-border bg-card relative mx-4 w-full max-w-lg overflow-hidden rounded-xl border shadow-2xl"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
              <h2 id="shortcuts-modal-title" className="text-foreground text-sm font-semibold">{t("shortcuts.title")}</h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("common.close")}
              >
                <kbd className="border-border bg-muted text-muted-foreground rounded border px-1.5 py-0.5 text-[10px] font-medium">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-5">
              {shortcutGroups.map((group, gi) => (
                <div key={group.titleKey} className={gi > 0 ? "mt-5" : ""}>
                  <h3 className="text-muted-foreground mb-2.5 text-xs font-medium uppercase tracking-wide">
                    {t(group.titleKey)}
                  </h3>
                  <div className="space-y-1.5">
                    {group.items.map((item) => (
                      <div
                        key={item.descriptionKey}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5"
                      >
                        <span className="text-foreground text-sm">{t(item.descriptionKey)}</span>
                        <span className="flex items-center gap-1">
                          {item.keys.map((k, ki) => (
                            <span key={ki} className="flex items-center gap-1">
                              {ki > 0 && (
                                <span className="text-muted-foreground text-xs">
                                  {t("shortcuts.then")}
                                </span>
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
              {t("shortcuts.footer")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
