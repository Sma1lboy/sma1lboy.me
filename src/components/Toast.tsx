import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useToastStore } from "@/store/toastStore";

function ToastItem({ id, message }: { id: string; message: string }) {
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 3000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="pointer-events-auto relative flex w-80 items-center gap-3 overflow-hidden rounded-lg border border-white/10 bg-gray-900 px-4 py-3 text-sm text-white shadow-lg"
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-white"
      >
        <X size={14} />
      </button>
      {/* Progress bar */}
      <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-white/10">
        <motion.div
          className="h-full bg-white/40"
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 3, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export function Toast() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} id={t.id} message={t.message} />
        ))}
      </AnimatePresence>
    </div>
  );
}
