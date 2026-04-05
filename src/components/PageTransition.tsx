import { motion, AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "@tanstack/react-router";

export function PageTransition() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        id="main-content"
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ minHeight: "100vh" }}
      >
        <Outlet />
      </motion.main>
    </AnimatePresence>
  );
}
