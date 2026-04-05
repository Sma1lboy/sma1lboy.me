import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";
import {
  snippets,
  categoryLabels,
  categoryColors,
  languageLabels,
  type SnippetCategory,
} from "../../constants/snippets";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const filters: Array<{ key: SnippetCategory | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "typescript", label: "TypeScript" },
  { key: "react", label: "React" },
  { key: "python", label: "Python" },
  { key: "shell", label: "Shell" },
  { key: "ai-ml", label: "AI/ML" },
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

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 flex items-center gap-1.5 rounded-md bg-white/10 px-2 py-1 text-xs text-gray-400 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-gray-200"
    >
      {copied ? (
        <>
          <Check size={12} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={12} />
          Copy
        </>
      )}
    </button>
  );
}

export default function SnippetsPage() {
  useSEO({
    title: "Snippets",
    description: "Useful code snippets and patterns.",
    path: "/snippets",
  });

  const [activeFilter, setActiveFilter] = useState<SnippetCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = snippets;

    if (activeFilter !== "all") {
      result = result.filter((s) => s.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [activeFilter, searchQuery]);

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
            Code Snippets
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            Useful patterns, tricks, and mini-tutorials I reach for regularly.
          </p>
        </motion.header>

        {/* Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
        >
          <div className="relative">
            <Search
              size={16}
              className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="text"
              placeholder="Search snippets by title, description, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gray-300 focus:outline-none dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:text-gray-100 dark:placeholder:text-gray-600 dark:focus:border-[#2a2a2a]"
            />
          </div>
        </motion.div>

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

        {/* Snippets */}
        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeFilter}-${searchQuery}`}
        >
          {filtered.length === 0 ? (
            <motion.p
              variants={itemVariants}
              className="py-12 text-center text-sm text-gray-400 dark:text-gray-600"
            >
              No snippets found. Try a different search or filter.
            </motion.p>
          ) : (
            filtered.map((snippet) => (
              <motion.div
                key={snippet.id}
                variants={itemVariants}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-[#1a1a1a] dark:bg-[#0f0f0f]"
              >
                {/* Card Header */}
                <div className="px-5 pt-5 pb-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${categoryColors[snippet.category]}`}
                    >
                      {categoryLabels[snippet.category]}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#1a1a1a] dark:text-gray-500">
                      {languageLabels[snippet.language]}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {snippet.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-[#888]">
                    {snippet.description}
                  </p>
                </div>

                {/* Code Block */}
                <div className="relative">
                  <CopyButton code={snippet.code} />
                  <Highlight
                    theme={themes.nightOwl}
                    code={snippet.code}
                    language={snippet.language}
                  >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                      <pre
                        className={`${className} overflow-x-auto px-5 py-4 text-[13px] leading-relaxed`}
                        style={{
                          ...style,
                          margin: 0,
                          borderRadius: 0,
                          background: "#011627",
                        }}
                      >
                        {tokens.map((line, i) => {
                          const lineProps = getLineProps({ line });
                          return (
                            <div key={i} {...lineProps}>
                              {line.map((token, key) => {
                                const tokenProps = getTokenProps({ token });
                                return <span key={key} {...tokenProps} />;
                              })}
                            </div>
                          );
                        })}
                      </pre>
                    )}
                  </Highlight>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 border-t border-gray-100 px-5 py-3 dark:border-[#1a1a1a]">
                  {snippet.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:bg-[#111] dark:text-gray-600 dark:hover:bg-[#1a1a1a] dark:hover:text-gray-400"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
