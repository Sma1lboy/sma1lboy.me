import { motion } from "framer-motion";
import type { Thought } from "../../constants/thoughts";

interface ThoughtCardProps {
  thought: Thought;
  index: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatYear(iso: string): string {
  return new Date(iso).getFullYear().toString();
}

export default function ThoughtCard({ thought, index }: ThoughtCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative flex w-full gap-5"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center pt-1.5">
        <div className="h-2.5 w-2.5 rounded-full border-2 border-gray-300 bg-white transition-colors group-hover:border-gray-500 dark:border-gray-600 dark:bg-black dark:group-hover:border-gray-400" />
        <div className="w-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Card body */}
      <div className="mb-8 flex-1 pb-1">
        {/* Date row */}
        <div className="mb-2 flex items-center gap-2">
          {thought.mood && (
            <span className="text-base leading-none">{thought.mood}</span>
          )}
          <time className="text-xs font-medium tracking-wide text-gray-400 dark:text-gray-500">
            {formatDate(thought.date)}, {formatYear(thought.date)}
          </time>
        </div>

        {/* Content */}
        <p className="text-[15px] leading-[1.7] text-gray-700 dark:text-gray-300">
          {thought.content}
        </p>

        {/* Tags */}
        {thought.tags && thought.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {thought.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
