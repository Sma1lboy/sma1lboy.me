import { motion } from "framer-motion";
import { thoughts } from "../../../constants/thoughts";

export function ThoughtsFeed() {
  return (
    <motion.div
      className="h-full overflow-y-auto p-6 md:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="space-y-8">
        {thoughts.map((thought) => (
          <article key={thought.id}>
            <time
              className="block text-[11px]"
              style={{ color: "#666666" }}
              dateTime={thought.date}
            >
              {thought.date}
            </time>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "#b0b0b0" }}
            >
              {thought.content}
            </p>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
