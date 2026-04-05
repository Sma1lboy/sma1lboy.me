import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  changelogEntries,
  typeLabels,
  typeColors,
  type ChangelogEntry,
} from "../../constants/changelog";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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

function groupByMonth(entries: ChangelogEntry[]) {
  const groups: { label: string; entries: ChangelogEntry[] }[] = [];
  const map = new Map<string, ChangelogEntry[]>();

  for (const entry of entries) {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!map.has(key)) {
      map.set(key, []);
      groups.push({ label, entries: map.get(key)! });
    }
    map.get(key)!.push(entry);
  }

  return groups;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  const groups = groupByMonth(changelogEntries);

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
            Changelog
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            What's new on this site
          </p>
        </motion.header>

        {/* Entries by month */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {groups.map((group) => (
            <motion.section key={group.label} variants={itemVariants} className="mb-12">
              {/* Month heading */}
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {group.label}
              </h2>

              <div className="space-y-4">
                {group.entries.map((entry) => {
                  const colors = typeColors[entry.type];
                  return (
                    <motion.div
                      key={entry.id}
                      variants={itemVariants}
                      className="rounded-xl border border-gray-100 bg-white p-5 transition-colors duration-200 hover:border-gray-200 dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:hover:border-[#2a2a2a]"
                    >
                      {/* Top row: date, version, type badge */}
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(entry.date)}
                        </span>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] font-medium text-gray-500 dark:bg-[#1a1a1a] dark:text-gray-400">
                          {entry.version}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${colors.badge}`}
                        >
                          <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                          {typeLabels[entry.type]}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {entry.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-[#999]">
                        {entry.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
