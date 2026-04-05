import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock,
  AlertCircle,
  Copy,
  Check,
  ArrowRightLeft,
  Calendar,
  Timer,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// ─── Types ───────────────────────────────────────────────────────────

type ConvertResult =
  | { ok: true; date: Date; sec: number; wasMs?: boolean }
  | { ok: false; error: string };

// ─── Helpers ─────────────────────────────────────────────────────────

function isMilliseconds(value: number): boolean {
  // Timestamps above 1e12 are likely milliseconds (year ~2001+ in ms)
  return Math.abs(value) > 1e12;
}

function toSeconds(value: number): number {
  return isMilliseconds(value) ? Math.floor(value / 1000) : value;
}

function formatRelative(timestampSec: number): string {
  const nowSec = Math.floor(Date.now() / 1000);
  const diff = nowSec - timestampSec;
  const absDiff = Math.abs(diff);
  const suffix = diff > 0 ? "ago" : "from now";

  if (absDiff < 5) return "just now";
  if (absDiff < 60) return `${absDiff} second${absDiff !== 1 ? "s" : ""} ${suffix}`;
  const mins = Math.floor(absDiff / 60);
  if (mins < 60) return `${mins} minute${mins !== 1 ? "s" : ""} ${suffix}`;
  const hrs = Math.floor(absDiff / 3600);
  if (hrs < 24) return `${hrs} hour${hrs !== 1 ? "s" : ""} ${suffix}`;
  const days = Math.floor(absDiff / 86400);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ${suffix}`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ${suffix}`;
  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ${suffix}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function dateToLocalInput(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

// ─── Common Epochs ───────────────────────────────────────────────────

const COMMON_EPOCHS = [
  { label: "Unix Epoch", timestamp: 0, desc: "Jan 1, 1970 00:00:00 UTC" },
  { label: "Y2K Bug", timestamp: 946684800, desc: "Jan 1, 2000 00:00:00 UTC" },
  { label: "First iPhone", timestamp: 1183264800, desc: "Jun 29, 2007 18:00:00 UTC" },
  { label: "Bitcoin Genesis", timestamp: 1231006505, desc: "Jan 3, 2009 18:15:05 UTC" },
  { label: "Unix 1 Billion", timestamp: 1000000000, desc: "Sep 9, 2001 01:46:40 UTC" },
  { label: "32-bit Overflow", timestamp: 2147483647, desc: "Jan 19, 2038 03:14:07 UTC" },
];

// ─── Copy Button Component ──────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 shrink-0 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
    </button>
  );
}

// ─── Component ───────────────────────────────────────────────────────

export default function EpochConverter() {
  useSEO({
    title: "Epoch Converter",
    description:
      "Convert Unix timestamps to dates and back. ISO 8601, UTC, local time, relative time, live clock, and common epochs reference.",
    path: "/apps/epoch",
  });

  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [liveClock, setLiveClock] = useState(Math.floor(Date.now() / 1000));

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveClock(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Timestamp → Date ──
  const timestampResult = useMemo((): ConvertResult | null => {
    const trimmed = timestampInput.trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    if (!Number.isFinite(num)) return { ok: false, error: "Invalid number" };
    const sec = toSeconds(num);
    const date = new Date(sec * 1000);
    if (isNaN(date.getTime())) return { ok: false, error: "Invalid timestamp" };
    const wasMs = isMilliseconds(num);
    return { ok: true, date, sec, wasMs };
  }, [timestampInput]);

  // ── Date → Timestamp ──
  const dateResult = useMemo((): ConvertResult | null => {
    const trimmed = dateInput.trim();
    if (!trimmed) return null;
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return { ok: false, error: "Invalid date" };
    const sec = Math.floor(date.getTime() / 1000);
    return { ok: true, date, sec };
  }, [dateInput]);

  const handleUseNow = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    setTimestampInput(String(now));
  }, []);

  const handleUseNowDate = useCallback(() => {
    setDateInput(dateToLocalInput(new Date()));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Clock size={28} className="text-gray-700 dark:text-gray-300" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Epoch Converter
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Convert between Unix timestamps and human-readable dates
              </p>
            </div>
          </div>

          {/* Live Clock */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={14} className="text-emerald-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Current Unix Time
                </span>
              </div>
              <CopyButton text={String(liveClock)} />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {liveClock}
            </p>
          </div>

          {/* Timestamp → Date */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <ArrowRightLeft size={12} className="mr-1 inline" />
              Timestamp → Date
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                placeholder="e.g. 1700000000"
                spellCheck={false}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-lg text-gray-900 placeholder-gray-300 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-gray-600"
              />
              <button
                onClick={handleUseNow}
                className="rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                Now
              </button>
            </div>

            {/* Error */}
            {timestampResult && !timestampResult.ok && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {timestampResult.error}
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {timestampResult && timestampResult.ok && (
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800">
                {timestampResult.wasMs && (
                  <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800/50">
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      Detected as milliseconds — converted to seconds ({timestampResult.sec})
                    </span>
                  </div>
                )}
                {[
                  { label: "ISO 8601", value: timestampResult.date.toISOString() },
                  { label: "UTC", value: timestampResult.date.toUTCString() },
                  {
                    label: "Local",
                    value: timestampResult.date.toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    }),
                  },
                  { label: "Relative", value: formatRelative(timestampResult.sec) },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i !== 0 || timestampResult.wasMs
                        ? "border-t border-gray-100 dark:border-gray-800/50"
                        : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mr-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {row.label}
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {row.value}
                      </span>
                    </div>
                    <CopyButton text={row.value} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date → Timestamp */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Calendar size={12} className="mr-1 inline" />
              Date → Timestamp
            </label>
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                step="1"
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-gray-600 [color-scheme:light] dark:[color-scheme:dark]"
              />
              <button
                onClick={handleUseNowDate}
                className="rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                Now
              </button>
            </div>

            {/* Error */}
            {dateResult && !dateResult.ok && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-500" />
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {dateResult.error}
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {dateResult && dateResult.ok && (
              <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800">
                {[
                  { label: "Seconds", value: String(dateResult.sec) },
                  { label: "Milliseconds", value: String(dateResult.sec * 1000) },
                  { label: "ISO 8601", value: dateResult.date.toISOString() },
                  { label: "Relative", value: formatRelative(dateResult.sec) },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-4 py-2.5 ${
                      i !== 0
                        ? "border-t border-gray-100 dark:border-gray-800/50"
                        : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="mr-3 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                        {row.label}
                      </span>
                      <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                        {row.value}
                      </span>
                    </div>
                    <CopyButton text={row.value} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Common Epochs Reference */}
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              Common Epochs
            </h2>
            <div className="rounded-lg border border-gray-200 dark:border-gray-800">
              {COMMON_EPOCHS.map((epoch, i) => (
                <div
                  key={epoch.label}
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    i !== 0
                      ? "border-t border-gray-100 dark:border-gray-800/50"
                      : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {epoch.label}
                    </span>
                    <span className="ml-2 font-mono text-xs text-gray-400 dark:text-gray-500">
                      {epoch.timestamp}
                    </span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {epoch.desc}
                    </span>
                  </div>
                  <button
                    onClick={() => setTimestampInput(String(epoch.timestamp))}
                    className="ml-2 shrink-0 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    Use
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
