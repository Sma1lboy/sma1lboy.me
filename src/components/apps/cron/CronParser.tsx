import { useState, useMemo } from "react";
import { Clock, AlertCircle, Zap, Copy, Check } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

// ─── Constants ────────────────────────────────────────────────────────

const MONTH_MAP: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

const DOW_MAP: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

const FIELD_DEFS = [
  { name: "Minute", min: 0, max: 59 },
  { name: "Hour", min: 0, max: 23 },
  { name: "Day of Month", min: 1, max: 31 },
  { name: "Month", min: 1, max: 12 },
  { name: "Day of Week", min: 0, max: 7 },
] as const;

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 min", value: "*/5 * * * *" },
  { label: "Every 15 min", value: "*/15 * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily midnight", value: "0 0 * * *" },
  { label: "Daily 9 AM", value: "0 9 * * *" },
  { label: "Weekdays 9 AM", value: "0 9 * * 1-5" },
  { label: "Monday midnight", value: "0 0 * * 1" },
  { label: "Monthly 1st", value: "0 0 1 * *" },
  { label: "Yearly Jan 1", value: "0 0 1 1 *" },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ─── Parsing ──────────────────────────────────────────────────────────

interface ParsedField {
  values: number[];
  isWild: boolean;
  raw: string;
}

interface ParseResult {
  fields: ParsedField[];
  errors: string[];
}

function replaceNames(token: string, map: Record<string, number>): string {
  let t = token.toUpperCase();
  for (const [name, val] of Object.entries(map)) {
    t = t.split(name).join(String(val));
  }
  return t;
}

function expandField(
  raw: string,
  min: number,
  max: number,
  nameMap?: Record<string, number>,
): { values: number[]; isWild: boolean; error: string | null } {
  const isWild = raw === "*";
  let token = raw;
  if (nameMap) token = replaceNames(token, nameMap);

  const values = new Set<number>();
  const parts = token.split(",");

  for (const part of parts) {
    // Step: */n or n-m/s
    const stepMatch = part.match(/^(\*|(\d+)-(\d+))\/(\d+)$/);
    if (stepMatch) {
      const step = parseInt(stepMatch[4]);
      if (step === 0) return { values: [], isWild, error: "Step cannot be 0" };
      let start = min;
      let end = max;
      if (stepMatch[2] !== undefined) {
        start = parseInt(stepMatch[2]);
        end = parseInt(stepMatch[3]);
      }
      for (let i = start; i <= end; i += step) values.add(i);
      continue;
    }

    // Wildcard
    if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
      continue;
    }

    // Range: n-m
    const rangeMatch = part.match(/^(\d+)-(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1]);
      const end = parseInt(rangeMatch[2]);
      if (start > end) return { values: [], isWild, error: `Invalid range: ${start}-${end}` };
      for (let i = start; i <= end; i++) values.add(i);
      continue;
    }

    // Single value
    if (/^\d+$/.test(part)) {
      values.add(parseInt(part));
      continue;
    }

    return { values: [], isWild, error: `Invalid token: "${part}"` };
  }

  // Validate range
  for (const v of values) {
    if (v < min || v > max) {
      return {
        values: [],
        isWild,
        error: `Value ${v} out of range (${min}-${max})`,
      };
    }
  }

  return { values: Array.from(values).sort((a, b) => a - b), isWild, error: null };
}

function parseCron(expr: string): ParseResult {
  const trimmed = expr.trim();
  if (!trimmed) return { fields: [], errors: ["Expression is empty"] };

  const parts = trimmed.split(/\s+/);
  if (parts.length !== 5) {
    return {
      fields: [],
      errors: [`Expected 5 fields, got ${parts.length}`],
    };
  }

  const nameMaps = [undefined, undefined, undefined, MONTH_MAP, DOW_MAP];
  const fields: ParsedField[] = [];
  const errors: string[] = [];

  for (let i = 0; i < 5; i++) {
    const { values, isWild, error } = expandField(
      parts[i],
      FIELD_DEFS[i].min,
      FIELD_DEFS[i].max,
      nameMaps[i],
    );
    if (error) {
      errors.push(`${FIELD_DEFS[i].name}: ${error}`);
      fields.push({ values: [], isWild, raw: parts[i] });
    } else {
      fields.push({ values, isWild, raw: parts[i] });
    }
  }

  return { fields, errors };
}

// ─── Next Execution Calculator ────────────────────────────────────────

function getNextExecutions(fields: ParsedField[], count: number): Date[] {
  const [minutes, hours, doms, months, dows] = fields;
  const results: Date[] = [];
  const now = new Date();
  const current = new Date(now);
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  // Normalize DOW: 7 → 0 (both represent Sunday)
  const dowValues = dows.values.map((d) => (d === 7 ? 0 : d));
  const dowSet = new Set(dowValues);

  const maxIter = 525600; // ~1 year of minutes

  for (let i = 0; i < maxIter && results.length < count; i++) {
    // Check month (1-indexed)
    if (!months.values.includes(current.getMonth() + 1)) {
      current.setMonth(current.getMonth() + 1, 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    // Check day — standard cron OR logic when both DOM and DOW are restricted
    const domMatch = doms.values.includes(current.getDate());
    const dowMatch = dowSet.has(current.getDay());

    let dayMatch: boolean;
    if (!doms.isWild && !dows.isWild) {
      dayMatch = domMatch || dowMatch; // OR when both specified
    } else {
      dayMatch = domMatch && dowMatch; // AND when one is wild
    }

    if (!dayMatch) {
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    // Check hour
    if (!hours.values.includes(current.getHours())) {
      current.setHours(current.getHours() + 1, 0, 0, 0);
      continue;
    }

    // Check minute
    if (!minutes.values.includes(current.getMinutes())) {
      current.setMinutes(current.getMinutes() + 1, 0, 0);
      continue;
    }

    results.push(new Date(current));
    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}

// ─── Human-Readable Description ───────────────────────────────────────

function ordinal(n: number): string {
  if (n > 3 && n < 21) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function formatTime12(h: number, m: number): string {
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function describeCron(fields: ParsedField[]): string {
  const [mins, hrs, doms, mons, dows] = fields;

  // All wildcard
  if (fields.every((f) => f.isWild)) return "Every minute";

  const parts: string[] = [];

  // Time description
  if (mins.isWild && hrs.isWild) {
    parts.push("Every minute");
  } else if (mins.raw.startsWith("*/")) {
    const step = mins.raw.slice(2);
    parts.push(`Every ${step} minutes`);
  } else if (hrs.raw.startsWith("*/")) {
    const step = hrs.raw.slice(2);
    parts.push(`At minute ${mins.raw} past every ${step} hours`);
  } else if (hrs.isWild) {
    if (mins.values.length === 1) {
      parts.push(`At minute ${mins.values[0]} of every hour`);
    } else {
      parts.push(`At minutes ${mins.values.join(", ")} of every hour`);
    }
  } else {
    // Specific times
    const times = hrs.values.flatMap((h) => mins.values.map((m) => formatTime12(h, m))).join(", ");
    parts.push(`At ${times}`);
  }

  // Day-of-week
  if (!dows.isWild) {
    const dowNorm = dows.values.map((d) => (d === 7 ? 0 : d));
    const sorted = [...new Set(dowNorm)].sort((a, b) => a - b);
    if (sorted.length === 5 && [1, 2, 3, 4, 5].every((d) => sorted.includes(d))) {
      parts.push("on weekdays");
    } else if (sorted.length === 2 && sorted.includes(0) && sorted.includes(6)) {
      parts.push("on weekends");
    } else {
      parts.push(`on ${sorted.map((d) => DAY_NAMES[d]).join(", ")}`);
    }
  }

  // Day-of-month
  if (!doms.isWild) {
    parts.push(`on the ${doms.values.map(ordinal).join(", ")}`);
  }

  // Month
  if (!mons.isWild) {
    parts.push(`in ${mons.values.map((m) => MONTH_NAMES[m - 1]).join(", ")}`);
  }

  return parts.join(" ");
}

// ─── Component ────────────────────────────────────────────────────────

export default function CronParser() {
  useSEO({
    title: "Cron Expression Parser",
    description:
      "Parse cron expressions into human-readable descriptions. Visualize field breakdowns, see next execution times, and use quick presets.",
    path: "/apps/cron",
  });

  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => parseCron(expression), [expression]);
  const description = useMemo(
    () => (parsed.errors.length === 0 ? describeCron(parsed.fields) : ""),
    [parsed],
  );
  const nextTimes = useMemo(
    () => (parsed.errors.length === 0 ? getNextExecutions(parsed.fields, 10) : []),
    [parsed],
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

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
                Cron Expression Parser
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Parse, validate, and visualize cron schedules
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Cron Expression
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="* * * * *"
                spellCheck={false}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 font-mono text-lg tracking-widest text-gray-900 placeholder-gray-300 transition-colors outline-none focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-600 dark:focus:border-gray-600"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          {/* Errors */}
          {parsed.errors.length > 0 && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
                <div className="space-y-1">
                  {parsed.errors.map((err, i) => (
                    <p key={i} className="text-sm text-red-700 dark:text-red-400">
                      {err}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/30">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                {description}
              </p>
            </div>
          )}

          {/* Field Breakdown */}
          {parsed.fields.length === 5 && parsed.errors.length === 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Field Breakdown
              </h2>
              <div className="grid grid-cols-5 gap-2">
                {parsed.fields.map((field, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 p-3 text-center dark:border-gray-800"
                  >
                    <p className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {field.raw}
                    </p>
                    <p className="mt-1 text-[10px] font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                      {FIELD_DEFS[i].name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {field.isWild
                        ? "Any"
                        : field.values.length > 6
                          ? `${field.values.slice(0, 5).join(", ")}…`
                          : field.values.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next 10 Executions */}
          {nextTimes.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                Next 10 Executions
              </h2>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                {nextTimes.map((date, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 ${
                      i !== 0 ? "border-t border-gray-100 dark:border-gray-800/50" : ""
                    }`}
                  >
                    <span className="w-5 text-right font-mono text-xs text-gray-400 dark:text-gray-500">
                      {i + 1}
                    </span>
                    <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                      {date.toLocaleString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              <Zap size={12} />
              Quick Presets
            </h2>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setExpression(preset.value)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                    expression === preset.value
                      ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900"
                  }`}
                >
                  <span className="font-mono">{preset.value}</span>
                  <span className="ml-1.5 text-gray-400 dark:text-gray-500">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
