import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, GitCommit, Clock, FolderGit2, Code2, Coffee, FileCode } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
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

/* ── Animated Counter ── */

function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── Stat Card ── */

const stats = [
  {
    label: "GitHub Contributions",
    value: 2500,
    suffix: "+",
    icon: GitCommit,
  },
  {
    label: "Years Coding",
    value: 5,
    suffix: "+",
    icon: Clock,
  },
  {
    label: "Open Source Projects",
    value: 30,
    suffix: "+",
    icon: FolderGit2,
  },
  {
    label: "Languages Known",
    value: 8,
    suffix: "+",
    icon: Code2,
  },
  {
    label: "Cups of Coffee",
    value: 5000,
    suffix: "+",
    icon: Coffee,
  },
  {
    label: "Lines of Code",
    value: 500,
    suffix: "K+",
    icon: FileCode,
  },
];

/* ── Language Proficiency ── */

const languages = [
  { name: "TypeScript", level: 95 },
  { name: "Java", level: 90 },
  { name: "Python", level: 80 },
  { name: "Go", level: 70 },
  { name: "Rust", level: 55 },
  { name: "C/C++", level: 60 },
];

function SkillBar({ name, level }: { name: string; level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900 dark:text-gray-100">{name}</span>
        <span className="text-gray-400 dark:text-gray-500">{level}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#1a1a1a]">
        <motion.div
          className="h-full rounded-full bg-gray-800 dark:bg-gray-200"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

/* ── Fun Stats ── */

const funStats = [
  { label: "Average bugs per coffee", value: "0.3 (allegedly)" },
  { label: "Tabs vs Spaces", value: "Tabs, obviously" },
  { label: "Favorite time to code", value: "2 AM" },
  { label: "Stack Overflow visits saved by AI", value: "∞" },
  { label: "Git force pushes (regretted)", value: "12" },
  { label: '"It works on my machine" count', value: "Too many" },
  { label: "Longest debugging session", value: "14 hours" },
  { label: "Monitors", value: "3 (minimum viable setup)" },
];

/* ── Page ── */

export default function StatsPage() {
  useSEO({
    title: "Stats",
    description: "Developer stats and metrics.",
    path: "/stats",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
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
            Stats
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            A data-driven look at my developer journey.
          </p>
        </motion.header>

        {/* ── Number Counters ── */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="rounded-xl border border-gray-100 bg-white px-5 py-5 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]"
                >
                  <Icon size={18} className="mb-3 text-gray-400 dark:text-gray-500" />
                  <div className="text-2xl font-bold text-gray-900 tabular-nums sm:text-3xl dark:text-gray-100">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-[#888]">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── Language Proficiency ── */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease }}
        >
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Language Proficiency
          </h2>
          <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-5 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
            {languages.map((lang) => (
              <SkillBar key={lang.name} name={lang.name} level={lang.level} />
            ))}
          </div>
        </motion.section>

        {/* ── Fun Stats ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease }}
        >
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">Fun Facts</h2>
          <motion.div
            className="grid gap-3 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {funStats.map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]"
              >
                <span className="text-sm text-gray-500 dark:text-[#888]">{item.label}</span>
                <span className="ml-4 shrink-0 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
