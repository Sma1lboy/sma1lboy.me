import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, BookOpen, X } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MatchInfo {
  fullMatch: string;
  index: number;
  endIndex: number;
  groups: { index: number; value: string }[];
}

// ---------------------------------------------------------------------------
// Cheat sheet data
// ---------------------------------------------------------------------------

const cheatSheet = [
  {
    title: "Character Classes",
    items: [
      { pattern: ".", desc: "Any character (except newline)" },
      { pattern: "\\d", desc: "Digit [0-9]" },
      { pattern: "\\D", desc: "Non-digit" },
      { pattern: "\\w", desc: "Word char [a-zA-Z0-9_]" },
      { pattern: "\\W", desc: "Non-word char" },
      { pattern: "\\s", desc: "Whitespace" },
      { pattern: "\\S", desc: "Non-whitespace" },
      { pattern: "[abc]", desc: "Any of a, b, or c" },
      { pattern: "[^abc]", desc: "Not a, b, or c" },
      { pattern: "[a-z]", desc: "Range: a to z" },
    ],
  },
  {
    title: "Quantifiers",
    items: [
      { pattern: "*", desc: "0 or more" },
      { pattern: "+", desc: "1 or more" },
      { pattern: "?", desc: "0 or 1" },
      { pattern: "{n}", desc: "Exactly n" },
      { pattern: "{n,}", desc: "n or more" },
      { pattern: "{n,m}", desc: "Between n and m" },
      { pattern: "*?", desc: "0 or more (lazy)" },
      { pattern: "+?", desc: "1 or more (lazy)" },
    ],
  },
  {
    title: "Anchors",
    items: [
      { pattern: "^", desc: "Start of string/line" },
      { pattern: "$", desc: "End of string/line" },
      { pattern: "\\b", desc: "Word boundary" },
      { pattern: "\\B", desc: "Non-word boundary" },
    ],
  },
  {
    title: "Groups & References",
    items: [
      { pattern: "(abc)", desc: "Capture group" },
      { pattern: "(?:abc)", desc: "Non-capture group" },
      { pattern: "(?<name>abc)", desc: "Named capture group" },
      { pattern: "\\1", desc: "Backreference to group 1" },
      { pattern: "(a|b)", desc: "Alternation: a or b" },
    ],
  },
  {
    title: "Assertions",
    items: [
      { pattern: "(?=abc)", desc: "Positive lookahead" },
      { pattern: "(?!abc)", desc: "Negative lookahead" },
      { pattern: "(?<=abc)", desc: "Positive lookbehind" },
      { pattern: "(?<!abc)", desc: "Negative lookbehind" },
    ],
  },
  {
    title: "Common Patterns",
    items: [
      { pattern: "\\d{1,3}(\\.\\d{1,3}){3}", desc: "IPv4 address" },
      { pattern: "[\\w.-]+@[\\w.-]+\\.\\w+", desc: "Email (simple)" },
      { pattern: "https?://\\S+", desc: "URL (simple)" },
      { pattern: "#[0-9a-fA-F]{3,8}", desc: "Hex color" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Flag toggle button
// ---------------------------------------------------------------------------

function FlagButton({
  flag,
  active,
  onToggle,
}: {
  flag: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-bold transition-all ${
        active
          ? "bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/40"
          : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700"
      }`}
    >
      {flag}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Cheat sheet category (collapsible)
// ---------------------------------------------------------------------------

function CheatCategory({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: { pattern: string; desc: string }[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2">
              {items.map((item) => (
                <div key={item.pattern} className="flex items-baseline gap-2 py-0.5">
                  <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-purple-600 dark:bg-gray-800 dark:text-purple-400">
                    {item.pattern}
                  </code>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function RegexTester() {
  useSEO({
    title: "Regex Tester — sma1lboy's Lab",
    description:
      "Test regular expressions in real-time with live match highlighting, capture groups, and a handy cheat sheet.",
  });

  const [pattern, setPattern] = useState("(\\w+)@(\\w+)\\.(\\w+)");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState(
    "Contact us at hello@example.com or support@test.org\nVisit https://example.com for more info\nID: 12345, Phone: 555-0123",
  );
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  const toggleFlag = useCallback(
    (flag: keyof typeof flags) => setFlags((f) => ({ ...f, [flag]: !f[flag] })),
    [],
  );

  const flagString = useMemo(
    () =>
      (Object.entries(flags) as [string, boolean][])
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(""),
    [flags],
  );

  // Build regex and compute matches
  const { regex, error, matches } = useMemo(() => {
    if (!pattern) {
      return { regex: null, error: null, matches: [] as MatchInfo[] };
    }

    try {
      const re = new RegExp(pattern, flagString);
      const result: MatchInfo[] = [];

      if (flags.g) {
        let m: RegExpExecArray | null;
        let safety = 0;
        while ((m = re.exec(testString)) !== null && safety < 1000) {
          safety++;
          const groups: { index: number; value: string }[] = [];
          for (let i = 1; i < m.length; i++) {
            if (m[i] !== undefined) {
              groups.push({ index: i, value: m[i] });
            }
          }
          result.push({
            fullMatch: m[0],
            index: m.index,
            endIndex: m.index + m[0].length,
            groups,
          });
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        const m = re.exec(testString);
        if (m) {
          const groups: { index: number; value: string }[] = [];
          for (let i = 1; i < m.length; i++) {
            if (m[i] !== undefined) {
              groups.push({ index: i, value: m[i] });
            }
          }
          result.push({
            fullMatch: m[0],
            index: m.index,
            endIndex: m.index + m[0].length,
            groups,
          });
        }
      }

      return { regex: re, error: null, matches: result };
    } catch (e) {
      return {
        regex: null,
        error: (e as Error).message,
        matches: [] as MatchInfo[],
      };
    }
  }, [pattern, flagString, testString, flags.g]);

  // Build highlighted HTML from test string + matches
  const highlightedHtml = useMemo(() => {
    if (!regex || matches.length === 0) {
      return escapeHtml(testString);
    }

    // Build segments
    const segments: { text: string; highlight: boolean }[] = [];
    let lastEnd = 0;

    // Sort matches by index
    const sorted = [...matches].sort((a, b) => a.index - b.index);

    for (const match of sorted) {
      if (match.index > lastEnd) {
        segments.push({
          text: testString.slice(lastEnd, match.index),
          highlight: false,
        });
      }
      if (match.index >= lastEnd) {
        segments.push({
          text: testString.slice(match.index, match.endIndex),
          highlight: true,
        });
        lastEnd = match.endIndex;
      }
    }

    if (lastEnd < testString.length) {
      segments.push({
        text: testString.slice(lastEnd),
        highlight: false,
      });
    }

    return segments
      .map((seg) =>
        seg.highlight
          ? `<mark class="bg-green-500/20 text-green-300 rounded-sm px-0.5">${escapeHtml(seg.text)}</mark>`
          : escapeHtml(seg.text),
      )
      .join("");
  }, [regex, matches, testString]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Regex Tester
            </h1>
            <button
              type="button"
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              <BookOpen size={14} />
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main panel */}
          <div className="min-w-0 flex-1">
            {/* Regex input */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Regular Expression
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`flex flex-1 items-center rounded-lg border bg-white dark:bg-gray-950 ${
                    error
                      ? "border-red-400 ring-1 ring-red-400/30"
                      : "border-gray-200 focus-within:border-purple-400 dark:border-gray-800 dark:focus-within:border-purple-500"
                  } transition-colors`}
                >
                  <span className="pl-3 font-mono text-sm text-gray-400">/</span>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="enter regex pattern..."
                    className="flex-1 bg-transparent px-1 py-2.5 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-300 dark:text-gray-100 dark:placeholder:text-gray-600"
                    spellCheck={false}
                  />
                  <span className="pr-3 font-mono text-sm text-gray-400">/{flagString}</span>
                </div>
                <div className="flex gap-1">
                  <FlagButton flag="g" active={flags.g} onToggle={() => toggleFlag("g")} />
                  <FlagButton flag="i" active={flags.i} onToggle={() => toggleFlag("i")} />
                  <FlagButton flag="m" active={flags.m} onToggle={() => toggleFlag("m")} />
                  <FlagButton flag="s" active={flags.s} onToggle={() => toggleFlag("s")} />
                </div>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="mt-1.5 text-xs text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Test string */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Test String
                </label>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {testString.length} chars
                </span>
              </div>
              <div className="relative">
                <textarea
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  rows={6}
                  placeholder="Enter test string..."
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-sm text-transparent caret-gray-900 transition-colors outline-none focus:border-purple-400 dark:border-gray-800 dark:bg-gray-950 dark:caret-gray-100 dark:focus:border-purple-500"
                  spellCheck={false}
                  style={{
                    lineHeight: "1.6",
                    resize: "vertical",
                  }}
                />
                {/* Highlight overlay */}
                <div
                  className="pointer-events-none absolute inset-0 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-words whitespace-pre-wrap text-gray-900 dark:text-gray-100"
                  style={{ lineHeight: "1.6" }}
                  dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {/* Match count */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Matches
                </span>
                <motion.span
                  key={matches.length}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    matches.length > 0
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {matches.length}
                </motion.span>
              </div>

              {/* Match details */}
              {matches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Match indices */}
                  <div>
                    <h3 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                      Match Indices
                    </h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                            <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                              #
                            </th>
                            <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                              Match
                            </th>
                            <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                              Position
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {matches.map((m, i) => (
                            <tr
                              key={`${m.index}-${i}`}
                              className="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
                            >
                              <td className="px-3 py-1.5 font-mono text-gray-400">{i}</td>
                              <td className="px-3 py-1.5">
                                <code className="rounded bg-green-500/10 px-1.5 py-0.5 font-mono text-green-700 dark:text-green-400">
                                  {m.fullMatch}
                                </code>
                              </td>
                              <td className="px-3 py-1.5 font-mono text-gray-500 dark:text-gray-400">
                                {m.index}–{m.endIndex}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Capture groups */}
                  {matches.some((m) => m.groups.length > 0) && (
                    <div>
                      <h3 className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                        Capture Groups
                      </h3>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                              <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                                Match
                              </th>
                              <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                                Group
                              </th>
                              <th className="px-3 py-2 font-medium text-gray-500 dark:text-gray-400">
                                Value
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {matches.map((m, mi) =>
                              m.groups.map((g) => (
                                <tr
                                  key={`${mi}-${g.index}`}
                                  className="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
                                >
                                  <td className="px-3 py-1.5 font-mono text-gray-400">{mi}</td>
                                  <td className="px-3 py-1.5">
                                    <span className="rounded bg-purple-500/10 px-1.5 py-0.5 font-mono text-purple-600 dark:text-purple-400">
                                      ${g.index}
                                    </span>
                                  </td>
                                  <td className="px-3 py-1.5 font-mono text-gray-700 dark:text-gray-300">
                                    {g.value}
                                  </td>
                                </tr>
                              )),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Empty state */}
              {pattern && !error && matches.length === 0 && testString && (
                <p className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
                  No matches found
                </p>
              )}
            </div>
          </div>

          {/* Cheat sheet sidebar */}
          <AnimatePresence>
            {showCheatSheet && (
              <motion.aside
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 280 }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden shrink-0 overflow-hidden lg:block"
              >
                <div className="h-fit rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Cheat Sheet
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCheatSheet(false)}
                      className="rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  {cheatSheet.map((cat, i) => (
                    <CheatCategory
                      key={cat.title}
                      title={cat.title}
                      items={cat.items}
                      defaultOpen={i === 0}
                    />
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
