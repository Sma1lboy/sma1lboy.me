import { motion } from "framer-motion";
import { thoughts, type Thought } from "../../../constants/thoughts";

function ThoughtEntry({ thought }: { thought: Thought }) {
  const type = thought.type || "thought";

  if (type === "quote") {
    return (
      <article
        className="border-l-2 pl-4"
        style={{ borderColor: "#333333" }}
      >
        <p
          className="text-sm italic leading-relaxed"
          style={{ color: "#999999" }}
        >
          {thought.content}
        </p>
      </article>
    );
  }

  if (type === "milestone") {
    return (
      <article>
        {thought.date && (
          <time
            className="block text-[11px]"
            style={{ color: "#666666" }}
            dateTime={thought.date}
          >
            {thought.date}
          </time>
        )}
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "#b0b0b0" }}
        >
          <span style={{ color: "#666666" }}>{">"} </span>
          {thought.content}
        </p>
        {thought.tags && thought.tags.length > 0 && (
          <p className="mt-1.5 text-[10px] uppercase tracking-widest" style={{ color: "#555555" }}>
            {thought.tags.join(" / ")}
          </p>
        )}
      </article>
    );
  }

  if (type === "update") {
    return (
      <article>
        {thought.date && (
          <time
            className="block text-[11px]"
            style={{ color: "#666666" }}
            dateTime={thought.date}
          >
            {thought.date}
          </time>
        )}
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: "#b0b0b0" }}
        >
          {thought.content}
        </p>
        {thought.tags && thought.tags.length > 0 && (
          <p className="mt-1.5 text-[10px] uppercase tracking-widest" style={{ color: "#555555" }}>
            {thought.tags.join(" / ")}
          </p>
        )}
      </article>
    );
  }

  // Default: "thought" type
  return (
    <article>
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
  );
}

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
          <ThoughtEntry key={thought.id} thought={thought} />
        ))}
      </div>
    </motion.div>
  );
}
