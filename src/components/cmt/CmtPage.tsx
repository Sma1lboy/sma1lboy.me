import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { thoughts } from "../../constants/thoughts";
import ThoughtCard from "./ThoughtCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

export default function CmtPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
            Thoughts
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Short notes on building, learning, and shipping.
          </p>
        </motion.header>

        {/* Timeline feed */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {thoughts.map((thought, i) => (
            <ThoughtCard key={thought.id} thought={thought} index={i} />
          ))}

          {/* End dot */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center">
              <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-600">
              End of stream
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
