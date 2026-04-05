import { motion } from "framer-motion";

/**
 * Route-level loading spinner. Used as `pendingComponent` in TanStack Router.
 * Fades in after a brief delay to avoid flash on fast loads.
 */
export function PageLoader() {
  return (
    <motion.div
      className="flex min-h-screen items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <motion.div
        className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-neutral-600 dark:border-t-neutral-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
