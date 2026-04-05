import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Activity, Clock, Move, Zap, Eye } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

/* ── Types & Config ── */

interface VitalMetric {
  key: string;
  label: string;
  fullLabel: string;
  unit: string;
  good: number;
  poor: number;
  maxGauge: number;
  decimals: number;
  icon: typeof Zap;
}

const VITALS: VitalMetric[] = [
  { key: "lcp", label: "LCP", fullLabel: "Largest Contentful Paint", unit: "s", good: 2.5, poor: 4, maxGauge: 6, decimals: 2, icon: Zap },
  { key: "fcp", label: "FCP", fullLabel: "First Contentful Paint", unit: "s", good: 1.8, poor: 3, maxGauge: 5, decimals: 2, icon: Eye },
  { key: "ttfb", label: "TTFB", fullLabel: "Time to First Byte", unit: "ms", good: 800, poor: 1800, maxGauge: 3000, decimals: 0, icon: Clock },
  { key: "cls", label: "CLS", fullLabel: "Cumulative Layout Shift", unit: "", good: 0.1, poor: 0.25, maxGauge: 0.5, decimals: 3, icon: Move },
  { key: "inp", label: "INP", fullLabel: "Interaction to Next Paint", unit: "ms", good: 200, poor: 500, maxGauge: 800, decimals: 0, icon: Activity },
];

function getVitalColor(value: number | null, metric: VitalMetric) {
  if (value === null) return { color: "#6b7280", rating: "Measuring…" };
  if (value <= metric.good) return { color: "#22c55e", rating: "Good" };
  if (value <= metric.poor) return { color: "#eab308", rating: "Needs Improvement" };
  return { color: "#ef4444", rating: "Poor" };
}

function formatVitalValue(value: number | null, metric: VitalMetric): string {
  if (value === null) return "—";
  const num = value.toFixed(metric.decimals);
  return metric.unit ? `${num} ${metric.unit}` : num;
}

/* ── SVG Gauge ── */

const R = 45;
const CIRC = 2 * Math.PI * R;
const ARC = CIRC * 0.75; // 270-degree arc

function VitalGauge({ metric, value }: { metric: VitalMetric; value: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const { color, rating } = getVitalColor(value, metric);
  const Icon = metric.icon;

  const normalized = value !== null ? Math.min(value / metric.maxGauge, 1) : 0;
  const offset = ARC * (1 - (isInView ? normalized : 0));

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <div className="relative h-[120px] w-[120px] sm:h-[130px] sm:w-[130px]">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-[135deg]">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${ARC} ${CIRC}`}
            className="stroke-gray-100 dark:stroke-[#1a1a1a]"
          />
          {/* Colored fill */}
          <motion.circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${ARC} ${CIRC}`}
            initial={{ strokeDashoffset: ARC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
          <Icon size={14} className="mb-1 text-gray-400 dark:text-gray-500" />
          <span className="text-base font-bold tabular-nums text-gray-900 sm:text-lg dark:text-gray-100">
            {formatVitalValue(value, metric)}
          </span>
          <span className="text-[10px] font-medium leading-tight" style={{ color }}>
            {rating}
          </span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{metric.label}</div>
        <div className="text-[11px] leading-tight text-gray-400 dark:text-gray-500">
          {metric.fullLabel}
        </div>
      </div>
    </div>
  );
}

/* ── Resource Waterfall ── */

interface ResourceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: string;
  size: number;
}

const RESOURCE_COLORS: Record<string, string> = {
  script: "#8b5cf6",
  css: "#3b82f6",
  img: "#22c55e",
  font: "#f59e0b",
  fetch: "#06b6d4",
  xmlhttprequest: "#06b6d4",
  link: "#3b82f6",
  other: "#6b7280",
};

function getResourceColor(type: string) {
  return RESOURCE_COLORS[type] || RESOURCE_COLORS.other;
}

function shortenUrl(url: string) {
  try {
    const path = new URL(url).pathname.split("/").pop() || url;
    return path.length > 35 ? path.slice(0, 32) + "…" : path;
  } catch {
    return url.length > 35 ? url.slice(0, 32) + "…" : url;
  }
}

function ResourceWaterfall({ resources }: { resources: ResourceEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (resources.length === 0) return null;

  const maxEnd = Math.max(...resources.map((r) => r.startTime + r.duration));

  return (
    <div ref={ref} className="space-y-0.5">
      {resources.map((resource, i) => {
        const left = (resource.startTime / maxEnd) * 100;
        const width = Math.max((resource.duration / maxEnd) * 100, 0.5);

        return (
          <motion.div
            key={`${resource.name}-${i}`}
            className="flex items-center gap-2 text-xs sm:gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.25, delay: i * 0.02 }}
          >
            <span
              className="w-[120px] shrink-0 truncate text-gray-500 sm:w-[200px] dark:text-gray-400"
              title={resource.name}
            >
              {shortenUrl(resource.name)}
            </span>
            <div className="relative h-4 flex-1 overflow-hidden rounded bg-gray-50 dark:bg-[#111]">
              <div
                className="absolute top-0 h-full rounded"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  backgroundColor: getResourceColor(resource.type),
                  opacity: 0.8,
                }}
              />
            </div>
            <span className="w-[48px] shrink-0 text-right tabular-nums text-gray-400 dark:text-gray-500">
              {Math.round(resource.duration)}ms
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Web Vitals Hook ── */

type VitalsState = Record<string, number | null>;

function useWebVitals() {
  const [vitals, setVitals] = useState<VitalsState>({
    lcp: null,
    fcp: null,
    ttfb: null,
    cls: null,
    inp: null,
  });
  const [resources, setResources] = useState<ResourceEntry[]>([]);

  useEffect(() => {
    // TTFB — from navigation timing
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (nav) {
      setVitals((v) => ({ ...v, ttfb: nav.responseStart }));
    }

    // FCP — from paint timing
    const paints = performance.getEntriesByType("paint");
    const fcpEntry = paints.find((e) => e.name === "first-contentful-paint");
    if (fcpEntry) {
      setVitals((v) => ({ ...v, fcp: fcpEntry.startTime / 1000 }));
    }

    // Resource entries
    const res = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    setResources(
      res
        .filter((r) => r.duration > 0)
        .sort((a, b) => a.startTime - b.startTime)
        .slice(0, 30)
        .map((r) => ({
          name: r.name,
          startTime: r.startTime,
          duration: r.duration,
          type: r.initiatorType,
          size: r.transferSize || 0,
        })),
    );

    // Observer-based metrics
    const observers: PerformanceObserver[] = [];

    try {
      // LCP
      const lcpObs = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) setVitals((v) => ({ ...v, lcp: last.startTime / 1000 }));
      });
      lcpObs.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObs);

      // CLS
      let clsTotal = 0;
      const clsObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const shift = entry as any;
          if (!shift.hadRecentInput) {
            clsTotal += shift.value;
          }
        }
        setVitals((v) => ({ ...v, cls: clsTotal }));
      });
      clsObs.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObs);

      // INP (event timing)
      let longestDuration = 0;
      const inpObs = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > longestDuration) {
            longestDuration = entry.duration;
            setVitals((v) => ({ ...v, inp: longestDuration }));
          }
        }
      });
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        inpObs.observe({ type: "event", buffered: true, durationThreshold: 16 } as any);
        observers.push(inpObs);
      } catch {
        // Event timing not supported in this browser
      }
    } catch {
      // PerformanceObserver not fully supported
    }

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return { vitals, resources };
}

/* ── Page ── */

export default function PerfPage() {
  useSEO({
    title: "Performance",
    description: "Core Web Vitals and performance metrics for this site.",
    path: "/perf",
  });

  const { vitals, resources } = useWebVitals();

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
            Performance
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            Real-time Core Web Vitals measured in your browser via the Performance API.
          </p>
        </motion.header>

        {/* ── Gauges ── */}
        <motion.section
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Core Web Vitals
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {VITALS.map((metric) => (
              <motion.div
                key={metric.key}
                variants={itemVariants}
                className="rounded-xl border border-gray-100 bg-white px-3 py-4 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]"
              >
                <VitalGauge metric={metric} value={vitals[metric.key]} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Thresholds Table ── */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Thresholds
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500 dark:text-gray-400">
                    Metric
                  </th>
                  <th className="px-4 py-2.5 text-center font-medium text-green-600 dark:text-green-400">
                    Good
                  </th>
                  <th className="px-4 py-2.5 text-center font-medium text-yellow-600 dark:text-yellow-400">
                    Needs Work
                  </th>
                  <th className="px-4 py-2.5 text-center font-medium text-red-600 dark:text-red-400">
                    Poor
                  </th>
                </tr>
              </thead>
              <tbody>
                {VITALS.map((m) => (
                  <tr
                    key={m.key}
                    className="border-b border-gray-50 last:border-0 dark:border-[#151515]"
                  >
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-gray-100">
                      {m.label}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">
                      ≤&nbsp;{m.good}
                      {m.unit}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">
                      {m.good}–{m.poor}
                      {m.unit}
                    </td>
                    <td className="px-4 py-2 text-center text-gray-600 dark:text-gray-300">
                      &gt;&nbsp;{m.poor}
                      {m.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* ── Resource Waterfall ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45, ease }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Resource Waterfall
            </h2>
            <div className="flex flex-wrap gap-3 text-[11px] text-gray-400 dark:text-gray-500">
              {Object.entries(RESOURCE_COLORS)
                .filter(([k]) => k !== "other" && k !== "xmlhttprequest" && k !== "link")
                .map(([type, c]) => (
                  <span key={type} className="flex items-center gap-1">
                    <span
                      className="inline-block h-2 w-2 rounded-sm"
                      style={{ backgroundColor: c }}
                    />
                    {type}
                  </span>
                ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
            {resources.length > 0 ? (
              <ResourceWaterfall resources={resources} />
            ) : (
              <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                Loading resource timing data…
              </p>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
