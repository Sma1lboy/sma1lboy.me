import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import {
  readingList,
  categoryLabels,
  categoryColors,
  type ReadingCategory,
} from "../../constants/reading";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const filters: Array<{ key: ReadingCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "ai-ml", label: "AI/ML Papers" },
  { key: "software-engineering", label: "Software Engineering" },
  { key: "design", label: "Design" },
  { key: "productivity", label: "Productivity" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

export default function ReadingPage() {
  useSEO({
    title: "Reading",
    description: "Books and articles I recommend.",
    path: "/reading",
  });

  const [activeFilter, setActiveFilter] = useState<ReadingCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? readingList
      : readingList.filter((entry) => entry.category === activeFilter);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-20">
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
          transition={{ duration: 0.45, ease }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            Reading List
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            Books, papers, and resources that shaped how I think about building software.
          </p>
        </motion.header>

        {/* Filter Tabs */}
        <motion.div
          className="mb-10 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#151515] dark:text-gray-400 dark:hover:bg-[#1f1f1f]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Entries Grid */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeFilter}
        >
          {filtered.map((entry) => {
            const colors = categoryColors[entry.category];
            return (
              <motion.a
                key={entry.id}
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="group block rounded-xl border border-gray-100 bg-white p-5 transition-colors duration-200 hover:border-gray-200 dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:hover:border-[#2a2a2a]"
              >
                {/* Category + Link icon */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${colors.badge}`}
                  >
                    {categoryLabels[entry.category]}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-gray-300 transition-colors group-hover:text-gray-500 dark:text-[#333] dark:group-hover:text-[#888]"
                  />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {entry.title}
                </h3>

                {/* Author */}
                <p className="mt-0.5 text-sm text-gray-500 dark:text-[#888]">{entry.author}</p>

                {/* Personal note */}
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-[#999]">
                  {entry.note}
                </p>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
