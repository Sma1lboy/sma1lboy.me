import { useState, useCallback, useMemo, useRef } from "react";
import { Copy, Check, RefreshCw, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// ─── Classic Lorem Ipsum corpus ────────────────────────────────────
const CLASSIC_WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "viverra",
  "maecenas",
  "accumsan",
  "lacus",
  "vel",
  "facilisis",
  "volutpat",
  "porta",
  "nibh",
  "venenatis",
  "cras",
  "semper",
  "auctor",
  "neque",
  "vitae",
  "lectus",
  "urna",
  "duis",
  "convallis",
  "tellus",
  "sagittis",
  "eu",
  "volutpat",
  "odio",
  "facilisis",
  "mauris",
  "nunc",
  "pulvinar",
  "sapien",
  "pellentesque",
  "habitant",
  "morbi",
  "tristique",
  "senectus",
  "netus",
  "malesuada",
  "fames",
  "ac",
  "turpis",
  "egestas",
  "pharetra",
  "massa",
  "ultricies",
  "mi",
  "quis",
  "hendrerit",
  "gravida",
  "rutrum",
  "quisque",
  "faucibus",
  "scelerisque",
  "eleifend",
  "donec",
  "pretium",
  "vulputate",
];

const CLASSIC_FIRST = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

// ─── Programmer-themed corpus ──────────────────────────────────────
const PROGRAMMER_WORDS = [
  "refactor",
  "deploy",
  "commit",
  "merge",
  "branch",
  "rebase",
  "sprint",
  "standup",
  "backlog",
  "endpoint",
  "middleware",
  "callback",
  "promise",
  "async",
  "await",
  "runtime",
  "compiler",
  "parser",
  "token",
  "buffer",
  "stack",
  "heap",
  "queue",
  "cache",
  "proxy",
  "daemon",
  "socket",
  "thread",
  "mutex",
  "semaphore",
  "pipeline",
  "container",
  "cluster",
  "instance",
  "schema",
  "migration",
  "query",
  "index",
  "shard",
  "replica",
  "payload",
  "header",
  "request",
  "response",
  "status",
  "timeout",
  "retry",
  "fallback",
  "throttle",
  "debounce",
  "hook",
  "state",
  "props",
  "render",
  "component",
  "module",
  "package",
  "import",
  "export",
  "interface",
  "generic",
  "abstract",
  "virtual",
  "override",
  "static",
  "const",
  "mutable",
  "volatile",
  "nullable",
  "boolean",
  "integer",
  "string",
  "array",
  "object",
  "function",
  "lambda",
  "closure",
  "iterator",
  "generator",
  "decorator",
  "mixin",
  "singleton",
  "factory",
  "observer",
  "adapter",
  "facade",
  "strategy",
  "template",
  "prototype",
  "builder",
  "resolver",
  "handler",
  "service",
  "controller",
  "repository",
  "gateway",
  "config",
  "environment",
  "variable",
  "parameter",
  "argument",
  "return",
  "exception",
  "error",
  "debug",
  "breakpoint",
  "assertion",
  "benchmark",
  "profile",
  "optimize",
  "minify",
  "bundle",
  "transpile",
  "lint",
  "format",
];

const PROGRAMMER_FIRST = "Refactor deploy commit merge branch, rebase sprint async.";

// ─── Text generation ───────────────────────────────────────────────
type Mode = "paragraphs" | "sentences" | "words" | "bytes";
type Theme = "classic" | "programmer";

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function generateSentence(words: string[], minWords = 6, maxWords = 14): string {
  const len = minWords + Math.floor(Math.random() * (maxWords - minWords + 1));
  const parts: string[] = [];
  for (let i = 0; i < len; i++) {
    parts.push(pickRandom(words));
  }
  parts[0] = capitalize(parts[0]);
  // Add occasional comma
  if (len > 6) {
    const commaPos = 2 + Math.floor(Math.random() * (len - 4));
    parts[commaPos] = parts[commaPos] + ",";
  }
  return parts.join(" ") + ".";
}

function generateParagraph(words: string[], sentenceCount = 0): string {
  const count = sentenceCount || 4 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(generateSentence(words));
  }
  return sentences.join(" ");
}

function generateText(mode: Mode, amount: number, theme: Theme, startWithLorem: boolean): string {
  const words = theme === "classic" ? CLASSIC_WORDS : PROGRAMMER_WORDS;
  const firstSentence = theme === "classic" ? CLASSIC_FIRST : PROGRAMMER_FIRST;

  switch (mode) {
    case "paragraphs": {
      const paragraphs: string[] = [];
      for (let i = 0; i < amount; i++) {
        let p = generateParagraph(words);
        if (i === 0 && startWithLorem) {
          p = firstSentence + " " + p;
        }
        paragraphs.push(p);
      }
      return paragraphs.join("\n\n");
    }
    case "sentences": {
      const sentences: string[] = [];
      for (let i = 0; i < amount; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(firstSentence);
        } else {
          sentences.push(generateSentence(words));
        }
      }
      return sentences.join(" ");
    }
    case "words": {
      const result: string[] = [];
      if (startWithLorem) {
        const loremWords = firstSentence.replace(/[.,]/g, "").split(" ");
        for (let i = 0; i < Math.min(amount, loremWords.length); i++) {
          result.push(loremWords[i]);
        }
      }
      while (result.length < amount) {
        result.push(pickRandom(words));
      }
      return result.join(" ");
    }
    case "bytes": {
      let text = "";
      if (startWithLorem) {
        text = firstSentence + " ";
      }
      while (text.length < amount) {
        text += generateSentence(words) + " ";
      }
      return text.slice(0, amount);
    }
  }
}

// ─── Mode config ───────────────────────────────────────────────────
const MODES: { value: Mode; label: string; min: number; max: number; default: number }[] = [
  { value: "paragraphs", label: "Paragraphs", min: 1, max: 20, default: 3 },
  { value: "sentences", label: "Sentences", min: 1, max: 50, default: 5 },
  { value: "words", label: "Words", min: 1, max: 500, default: 50 },
  { value: "bytes", label: "Bytes", min: 10, max: 5000, default: 500 },
];

// ─── Component ─────────────────────────────────────────────────────
export default function LoremGenerator() {
  useSEO({
    title: "Lorem Ipsum Generator",
    description:
      "Generate placeholder text in classic or programmer-themed styles. Control paragraphs, sentences, words, or bytes with live word and character counts.",
    path: "/apps/lorem",
  });

  const [mode, setMode] = useState<Mode>("paragraphs");
  const [theme, setTheme] = useState<Theme>("classic");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [amounts, setAmounts] = useState<Record<Mode, number>>({
    paragraphs: 3,
    sentences: 5,
    words: 50,
    bytes: 500,
  });
  const [seed, setSeed] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const amount = amounts[mode];
  const modeConfig = MODES.find((m) => m.value === mode)!;

  const text = useMemo(
    () => generateText(mode, amount, theme, startWithLorem),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, amount, theme, startWithLorem, seed],
  );

  const wordCount = useMemo(() => {
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }, [text]);

  const charCount = text.length;

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API not available
    }
  }, [text]);

  const regenerate = useCallback(() => {
    setSeed((s) => s + 1);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />

        <div className="mb-8 flex items-center gap-3">
          <FileText size={28} className="text-gray-700 dark:text-gray-300" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Lorem Ipsum Generator
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Generate placeholder text for your designs and layouts.
            </p>
          </div>
        </div>

        {/* ─── Generated Text ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
        >
          <motion.div
            key={seed + mode + theme + amount + String(startWithLorem)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-h-80 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap text-gray-900 dark:text-gray-100"
          >
            {text}
          </motion.div>

          {/* Stats bar */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-800">
            <div className="flex gap-4 text-xs text-gray-400 dark:text-gray-500">
              <span>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {wordCount.toLocaleString()}
                </span>{" "}
                words
              </span>
              <span>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                  {charCount.toLocaleString()}
                </span>{" "}
                chars
              </span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* ─── Regenerate Button ───────────────────────────────── */}
        <button
          onClick={regenerate}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <RefreshCw size={16} />
          Regenerate
        </button>

        {/* ─── Settings ────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Mode selector */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mode
            </label>
            <div className="flex gap-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    mode === m.value
                      ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount slider */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                {amount} {modeConfig.label.toLowerCase()}
              </span>
            </div>
            <input
              type="range"
              min={modeConfig.min}
              max={modeConfig.max}
              value={amount}
              onChange={(e) =>
                setAmounts((prev) => ({
                  ...prev,
                  [mode]: Number(e.target.value),
                }))
              }
              className="w-full accent-gray-900 dark:accent-gray-100"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>{modeConfig.min}</span>
              <span>{modeConfig.max}</span>
            </div>
          </div>

          {/* Theme selector */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme("classic")}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  theme === "classic"
                    ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <span className="font-medium">Classic</span>
                <span className="text-xs opacity-60">Lorem ipsum</span>
              </button>
              <button
                onClick={() => setTheme("programmer")}
                className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  theme === "programmer"
                    ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <span className="font-medium">Programmer</span>
                <span className="text-xs opacity-60">async await</span>
              </button>
            </div>
          </div>

          {/* Start with Lorem toggle */}
          <button
            onClick={() => setStartWithLorem((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
          >
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Start with &ldquo;Lorem ipsum...&rdquo;
            </span>
            <div
              className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                startWithLorem ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <motion.div
                className={`h-4 w-4 rounded-full ${
                  startWithLorem ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-500"
                }`}
                animate={{ x: startWithLorem ? 14 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
