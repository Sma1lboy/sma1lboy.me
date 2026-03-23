import { motion } from "framer-motion";
import type { Thought } from "../../constants/thoughts";

interface ThoughtCardProps {
  thought: Thought;
  index: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ThoughtCard({ thought, index }: ThoughtCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group relative w-full max-w-xl"
    >
      <div className="rounded-xl border border-gray-200/60 bg-white px-6 py-5 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md dark:border-[#222]/60 dark:bg-[#141414] dark:hover:border-[#333]">
        {/* Top row: mood + date */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {thought.mood && <span className="text-lg leading-none">{thought.mood}</span>}
            <time className="text-xs text-gray-400 dark:text-gray-500">
              {formatDate(thought.date)}
            </time>
          </div>
        </div>

        {/* Content */}
        <p className="text-[15px] leading-relaxed text-gray-800 dark:text-gray-200">
          {thought.content}
        </p>

        {/* Tags */}
        {thought.tags && thought.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {thought.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#1e1e1e] dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Connector line between cards */}
      <div className="mx-auto h-4 w-px bg-gray-200 dark:bg-[#222]" />
    </motion.article>
  );
}
