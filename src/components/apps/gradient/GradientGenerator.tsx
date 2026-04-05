import { useState, useCallback, useMemo } from "react";
import {
  Copy,
  Check,
  Plus,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

type GradientType = "linear" | "radial";

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const PRESETS: {
  name: string;
  type: GradientType;
  angle: number;
  stops: Omit<ColorStop, "id">[];
}[] = [
  {
    name: "Sunset",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#f97316", position: 0 },
      { color: "#ec4899", position: 50 },
      { color: "#8b5cf6", position: 100 },
    ],
  },
  {
    name: "Ocean",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#0ea5e9", position: 0 },
      { color: "#06b6d4", position: 50 },
      { color: "#14b8a6", position: 100 },
    ],
  },
  {
    name: "Aurora",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#22d3ee", position: 0 },
      { color: "#a78bfa", position: 50 },
      { color: "#f472b6", position: 100 },
    ],
  },
  {
    name: "Forest",
    type: "linear",
    angle: 160,
    stops: [
      { color: "#059669", position: 0 },
      { color: "#34d399", position: 50 },
      { color: "#fbbf24", position: 100 },
    ],
  },
  {
    name: "Midnight",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#1e1b4b", position: 0 },
      { color: "#312e81", position: 50 },
      { color: "#4f46e5", position: 100 },
    ],
  },
  {
    name: "Flamingo",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#fb7185", position: 0 },
      { color: "#f9a8d4", position: 50 },
      { color: "#fdba74", position: 100 },
    ],
  },
  {
    name: "Neon",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#00ff87", position: 0 },
      { color: "#60efff", position: 100 },
    ],
  },
  {
    name: "Lavender Haze",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#c084fc", position: 0 },
      { color: "#818cf8", position: 50 },
      { color: "#2dd4bf", position: 100 },
    ],
  },
  {
    name: "Solar Flare",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#fde047", position: 0 },
      { color: "#f97316", position: 50 },
      { color: "#dc2626", position: 100 },
    ],
  },
  {
    name: "Deep Space",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#6366f1", position: 0 },
      { color: "#0f172a", position: 100 },
    ],
  },
];

const DIRECTION_PRESETS = [
  { label: "\u2192", angle: 90, title: "to right" },
  { label: "\u2193", angle: 180, title: "to bottom" },
  { label: "\u2199", angle: 225, title: "to bottom-left" },
  { label: "\u2198", angle: 135, title: "to bottom-right" },
  { label: "\u2190", angle: 270, title: "to left" },
  { label: "\u2191", angle: 0, title: "to top" },
  { label: "\u2196", angle: 315, title: "to top-left" },
  { label: "\u2197", angle: 45, title: "to top-right" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let nextId = 100;

function buildCss(
  type: GradientType,
  angle: number,
  stops: ColorStop[],
): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopsStr = sorted
    .map((s) => `${s.color} ${s.position}%`)
    .join(", ");
  if (type === "radial") {
    return `radial-gradient(circle, ${stopsStr})`;
  }
  return `linear-gradient(${angle}deg, ${stopsStr})`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GradientGenerator() {
  useSEO({
    title: "CSS Gradient Generator | sma1lboy",
    description:
      "Create beautiful CSS gradients with color stops, direction control, presets, and live CSS output.",
  });

  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 50 },
    { id: 3, color: "#f59e0b", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(
    () => buildCss(gradientType, angle, stops),
    [gradientType, angle, stops],
  );

  const fullCss = `background: ${cssValue};`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [fullCss]);

  const addStop = useCallback(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    let pos = 50;
    if (sorted.length >= 2) {
      const midIdx = Math.floor(sorted.length / 2);
      pos = Math.round(
        (sorted[midIdx - 1].position + sorted[midIdx].position) / 2,
      );
    }
    setStops((prev) => [
      ...prev,
      { id: nextId++, color: "#ffffff", position: pos },
    ]);
  }, [stops]);

  const removeStop = useCallback(
    (id: number) => {
      if (stops.length <= 2) return;
      setStops((prev) => prev.filter((s) => s.id !== id));
    },
    [stops.length],
  );

  const updateStop = useCallback(
    (id: number, patch: Partial<Omit<ColorStop, "id">>) => {
      setStops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const loadPreset = useCallback(
    (preset: (typeof PRESETS)[number]) => {
      setGradientType(preset.type);
      setAngle(preset.angle);
      setStops(
        preset.stops.map((s) => ({ ...s, id: nextId++ })),
      );
    },
    [],
  );

  const reset = useCallback(() => {
    setGradientType("linear");
    setAngle(135);
    setStops([
      { id: nextId++, color: "#6366f1", position: 0 },
      { id: nextId++, color: "#ec4899", position: 50 },
      { id: nextId++, color: "#f59e0b", position: 100 },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              CSS Gradient Generator
            </h1>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        {/* Preview */}
        <div
          className="mb-8 h-64 w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm sm:h-80 dark:border-gray-800"
          style={{ background: cssValue }}
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Type toggle */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Gradient Type
              </label>
              <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                {(["linear", "radial"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setGradientType(t)}
                    className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      gradientType === t
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Direction (linear only) */}
            {gradientType === "linear" && (
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Direction
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="h-2 w-32 cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-500 dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      min={0}
                      max={360}
                      value={angle}
                      onChange={(e) =>
                        setAngle(
                          Math.min(360, Math.max(0, Number(e.target.value))),
                        )
                      }
                      className="w-16 rounded-md border border-gray-200 bg-white px-2 py-1 text-center text-sm text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100"
                    />
                    <span className="text-xs text-gray-400">deg</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {DIRECTION_PRESETS.map((d) => (
                      <button
                        key={d.angle}
                        title={d.title}
                        onClick={() => setAngle(d.angle)}
                        className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors ${
                          angle === d.angle
                            ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Color stops */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Color Stops
                </label>
                <button
                  onClick={addStop}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
                >
                  <Plus size={12} />
                  Add Stop
                </button>
              </div>

              {/* Gradient bar with stop markers */}
              <div className="relative mb-4">
                <div
                  className="h-6 w-full rounded-lg border border-gray-200 dark:border-gray-800"
                  style={{ background: cssValue }}
                />
                {[...stops]
                  .sort((a, b) => a.position - b.position)
                  .map((stop) => (
                    <div
                      key={stop.id}
                      className="absolute top-6 -translate-x-1/2"
                      style={{ left: `${stop.position}%` }}
                    >
                      <div
                        className="mx-auto h-3 w-3 rounded-full border-2 border-white shadow-sm dark:border-gray-300"
                        style={{ backgroundColor: stop.color }}
                      />
                    </div>
                  ))}
              </div>

              <div className="space-y-3">
                {stops.map((stop, i) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-950"
                  >
                    <span className="w-4 text-xs text-gray-400">
                      {i + 1}
                    </span>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) =>
                        updateStop(stop.id, { color: e.target.value })
                      }
                      className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) =>
                        updateStop(stop.id, { color: e.target.value })
                      }
                      className="w-20 rounded-md border border-gray-200 bg-white px-2 py-1 font-mono text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) =>
                        updateStop(stop.id, {
                          position: Number(e.target.value),
                        })
                      }
                      className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-indigo-500 dark:bg-gray-800"
                    />
                    <span className="w-8 text-right font-mono text-xs text-gray-400">
                      {stop.position}%
                    </span>
                    <button
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length <= 2}
                      className="rounded p-1 text-gray-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CSS Output */}
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                CSS Output
              </label>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200">
                  {fullCss}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-2 rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Presets */}
          <div>
            <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Presets
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
              {PRESETS.map((preset) => {
                const bg = buildCss(
                  preset.type,
                  preset.angle,
                  preset.stops.map((s, i) => ({ ...s, id: i })),
                );
                return (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="group overflow-hidden rounded-xl border border-gray-200 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700"
                  >
                    <div
                      className="h-16 w-full"
                      style={{ background: bg }}
                    />
                    <div className="px-2 py-1.5 text-left">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {preset.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
