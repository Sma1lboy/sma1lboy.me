import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// ─── Character sets ─────────────────────────────────────────────────
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const AMBIGUOUS = new Set(["0", "O", "o", "l", "1", "I", "|"]);

function buildCharset(options: {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}): string {
  let chars = "";
  if (options.upper) chars += UPPER;
  if (options.lower) chars += LOWER;
  if (options.numbers) chars += NUMBERS;
  if (options.symbols) chars += SYMBOLS;
  if (options.excludeAmbiguous) {
    chars = chars
      .split("")
      .filter((c) => !AMBIGUOUS.has(c))
      .join("");
  }
  return chars;
}

function generatePassword(length: number, charset: string): string {
  if (!charset) return "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => charset[n % charset.length]).join("");
}

// ─── Strength calculation ───────────────────────────────────────────
type Strength = "weak" | "fair" | "strong" | "very strong";

function calcStrength(password: string): { level: Strength; score: number } {
  if (!password) return { level: "weak", score: 0 };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = password.length * Math.log2(poolSize || 1);

  if (entropy < 36) return { level: "weak", score: 0.2 };
  if (entropy < 60) return { level: "fair", score: 0.45 };
  if (entropy < 80) return { level: "strong", score: 0.7 };
  return { level: "very strong", score: 1 };
}

const STRENGTH_COLORS: Record<Strength, string> = {
  weak: "bg-red-500",
  fair: "bg-yellow-500",
  strong: "bg-blue-500",
  "very strong": "bg-emerald-500",
};

const STRENGTH_TEXT_COLORS: Record<Strength, string> = {
  weak: "text-red-500",
  fair: "text-yellow-500",
  strong: "text-blue-500",
  "very strong": "text-emerald-500",
};

// ─── Component ──────────────────────────────────────────────────────
interface HistoryEntry {
  password: string;
  timestamp: number;
  strength: Strength;
}

export default function Password() {
  useSEO({
    title: "Password Generator",
    description:
      "Generate secure passwords with customizable length, character sets, strength meter, and batch generation.",
    path: "/apps/password",
  });

  // Settings
  const [length, setLength] = useState(20);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [batchCount, setBatchCount] = useState(1);
  const [showBatch, setShowBatch] = useState(false);

  // State
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const charset = useMemo(
    () => buildCharset({ upper, lower, numbers, symbols, excludeAmbiguous }),
    [upper, lower, numbers, symbols, excludeAmbiguous],
  );

  const activeCount = [upper, lower, numbers, symbols].filter(Boolean).length;

  const generate = useCallback(() => {
    if (!charset) return;
    const count = showBatch ? batchCount : 1;
    const newPasswords = Array.from({ length: count }, () => generatePassword(length, charset));
    setPasswords(newPasswords);

    // Add to history
    const entries: HistoryEntry[] = newPasswords.map((pw) => ({
      password: pw,
      timestamp: Date.now(),
      strength: calcStrength(pw).level,
    }));
    setHistory((prev) => [...entries, ...prev].slice(0, 100));
  }, [charset, length, batchCount, showBatch]);

  // Auto-generate on settings change
  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = useCallback(async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // clipboard API not available
    }
  }, []);

  const copyAll = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(passwords.join("\n"));
      setCopiedIdx(-1);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      // clipboard API not available
    }
  }, [passwords]);

  const handleToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<boolean>>, current: boolean) => {
      if (current && activeCount <= 1) return; // keep at least one
      setter((v) => !v);
    },
    [activeCount],
  );

  const primaryPassword = passwords[0] ?? "";
  const { level: strengthLevel, score: strengthScore } = calcStrength(primaryPassword);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />

        <div className="mb-8 flex items-center gap-3">
          <Shield size={28} className="text-gray-700 dark:text-gray-300" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Password Generator
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Generate secure, random passwords.
            </p>
          </div>
        </div>

        {/* ─── Password Display ─────────────────────────────────── */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
          {passwords.length <= 1 ? (
            <div className="flex items-center gap-3">
              <code className="flex-1 font-mono text-lg break-all text-gray-900 dark:text-gray-100">
                {primaryPassword}
              </code>
              <button
                onClick={() => copyToClipboard(primaryPassword, 0)}
                className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                title="Copy"
              >
                {copiedIdx === 0 ? (
                  <Check size={18} className="text-emerald-500" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {passwords.map((pw, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-6 text-right text-xs text-gray-400">{i + 1}</span>
                  <code className="flex-1 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                    {pw}
                  </code>
                  <button
                    onClick={() => copyToClipboard(pw, i)}
                    className="flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="Copy"
                  >
                    {copiedIdx === i ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
              ))}
              <div className="flex justify-end pt-1">
                <button
                  onClick={copyAll}
                  className="rounded-lg px-3 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  {copiedIdx === -1 ? "Copied all!" : "Copy all"}
                </button>
              </div>
            </div>
          )}

          {/* Strength meter */}
          <div className="mt-3 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <motion.div
                className={`h-full rounded-full ${STRENGTH_COLORS[strengthLevel]}`}
                initial={false}
                animate={{ width: `${strengthScore * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span
              className={`text-xs font-medium capitalize ${STRENGTH_TEXT_COLORS[strengthLevel]}`}
            >
              {strengthLevel}
            </span>
          </div>
        </div>

        {/* ─── Generate Button ──────────────────────────────────── */}
        <button
          onClick={generate}
          disabled={!charset}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <RefreshCw size={16} />
          Generate{showBatch && batchCount > 1 ? ` ${batchCount} Passwords` : ""}
        </button>

        {/* ─── Settings ─────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Length */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Length</label>
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{length}</span>
            </div>
            <input
              type="range"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-gray-900 dark:accent-gray-100"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          {/* Character toggles */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Characters
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["Uppercase", "A-Z", upper, setUpper],
                  ["Lowercase", "a-z", lower, setLower],
                  ["Numbers", "0-9", numbers, setNumbers],
                  ["Symbols", "!@#$%", symbols, setSymbols],
                ] as const
              ).map(([label, hint, active, setter]) => (
                <button
                  key={label}
                  onClick={() =>
                    handleToggle(
                      setter as React.Dispatch<React.SetStateAction<boolean>>,
                      active as boolean,
                    )
                  }
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                      : "border-gray-200 text-gray-500 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500"
                  }`}
                >
                  <span className="font-medium">{label}</span>
                  <span className="font-mono text-xs opacity-60">{hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exclude ambiguous */}
          <button
            onClick={() => setExcludeAmbiguous((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm transition-colors hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500"
          >
            <div className="text-left">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Exclude ambiguous characters
              </span>
              <span className="ml-2 font-mono text-xs text-gray-400">0 O o l 1 I |</span>
            </div>
            <div
              className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                excludeAmbiguous ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <motion.div
                className={`h-4 w-4 rounded-full ${
                  excludeAmbiguous ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-500"
                }`}
                animate={{ x: excludeAmbiguous ? 14 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </div>
          </button>

          {/* Batch generate */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowBatch((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 text-sm"
            >
              <span className="font-medium text-gray-700 dark:text-gray-300">Batch generate</span>
              {showBatch ? (
                <ChevronUp size={16} className="text-gray-400" />
              ) : (
                <ChevronDown size={16} className="text-gray-400" />
              )}
            </button>
            <AnimatePresence>
              {showBatch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-600 dark:text-gray-400">Count</label>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {batchCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={batchCount}
                      onChange={(e) => setBatchCount(Number(e.target.value))}
                      className="mt-2 w-full accent-gray-900 dark:accent-gray-100"
                    />
                    <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── History ──────────────────────────────────────────── */}
        {history.length > 0 && (
          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={() => setShowHistory((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Session History
                <span className="text-xs text-gray-400">({history.length})</span>
                {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showHistory && (
                <button
                  onClick={() => setHistory([])}
                  className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                    {history.map((entry, i) => (
                      <div
                        key={`${entry.timestamp}-${i}`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        <StrengthIcon level={entry.strength} />
                        <code className="flex-1 truncate font-mono text-xs text-gray-700 dark:text-gray-300">
                          {entry.password}
                        </code>
                        <span className="text-[10px] text-gray-400">
                          {formatTime(entry.timestamp)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(entry.password, 1000 + i)}
                          className="rounded p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {copiedIdx === 1000 + i ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────
function StrengthIcon({ level }: { level: Strength }) {
  const size = 12;
  switch (level) {
    case "weak":
      return <ShieldAlert size={size} className="text-red-500" />;
    case "fair":
      return <Shield size={size} className="text-yellow-500" />;
    case "strong":
      return <ShieldCheck size={size} className="text-blue-500" />;
    case "very strong":
      return <ShieldCheck size={size} className="text-emerald-500" />;
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
