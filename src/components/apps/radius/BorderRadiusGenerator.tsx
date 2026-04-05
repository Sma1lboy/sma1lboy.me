import { useState, useCallback, useMemo } from "react";
import { Copy, Check, Link, Unlink, ToggleLeft, ToggleRight } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";
import { useToastStore } from "@/store/toastStore";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Unit = "px" | "%";

interface Corners {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

interface AdvancedCorners {
  tlH: number;
  tlV: number;
  trH: number;
  trV: number;
  brH: number;
  brV: number;
  blH: number;
  blV: number;
}

interface Preset {
  name: string;
  advanced: boolean;
  unit: Unit;
  corners?: Corners;
  advancedCorners?: AdvancedCorners;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const PRESETS: Preset[] = [
  {
    name: "Circle",
    advanced: false,
    unit: "%",
    corners: { tl: 50, tr: 50, br: 50, bl: 50 },
  },
  {
    name: "Pill",
    advanced: false,
    unit: "px",
    corners: { tl: 999, tr: 999, br: 999, bl: 999 },
  },
  {
    name: "Squircle",
    advanced: false,
    unit: "%",
    corners: { tl: 20, tr: 20, br: 20, bl: 20 },
  },
  {
    name: "Leaf",
    advanced: false,
    unit: "%",
    corners: { tl: 50, tr: 0, br: 50, bl: 0 },
  },
  {
    name: "Tab",
    advanced: false,
    unit: "px",
    corners: { tl: 16, tr: 16, br: 0, bl: 0 },
  },
  {
    name: "Blob",
    advanced: true,
    unit: "%",
    advancedCorners: {
      tlH: 70,
      tlV: 30,
      trH: 30,
      trV: 70,
      brH: 70,
      brV: 30,
      blH: 30,
      blV: 70,
    },
  },
  {
    name: "Organic",
    advanced: true,
    unit: "%",
    advancedCorners: {
      tlH: 40,
      tlV: 60,
      trH: 60,
      trV: 40,
      brH: 40,
      brV: 60,
      blH: 60,
      blV: 40,
    },
  },
  {
    name: "Drop",
    advanced: true,
    unit: "%",
    advancedCorners: {
      tlH: 0,
      tlV: 50,
      trH: 50,
      trV: 50,
      brH: 50,
      brV: 50,
      blH: 50,
      blV: 0,
    },
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getMax(unit: Unit): number {
  return unit === "%" ? 100 : 300;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BorderRadiusGenerator() {
  useSEO({
    title: "Border Radius Generator | sma1lboy",
    description:
      "Create CSS border-radius with 4 corner sliders, link/unlink, live preview, px/% toggle, advanced 8-value mode, and presets.",
  });

  const [unit, setUnit] = useState<Unit>("px");
  const [linked, setLinked] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [corners, setCorners] = useState<Corners>({
    tl: 16,
    tr: 16,
    br: 16,
    bl: 16,
  });
  const [advCorners, setAdvCorners] = useState<AdvancedCorners>({
    tlH: 16,
    tlV: 16,
    trH: 16,
    trV: 16,
    brH: 16,
    brV: 16,
    blH: 16,
    blV: 16,
  });
  const [copied, setCopied] = useState(false);

  const max = getMax(unit);

  // Simple corner update (with link support)
  const updateCorner = useCallback(
    (key: keyof Corners, value: number) => {
      if (linked) {
        setCorners({ tl: value, tr: value, br: value, bl: value });
      } else {
        setCorners((prev) => ({ ...prev, [key]: value }));
      }
    },
    [linked],
  );

  // Advanced corner update
  const updateAdvCorner = useCallback(
    (key: keyof AdvancedCorners, value: number) => {
      if (linked) {
        setAdvCorners({
          tlH: value,
          tlV: value,
          trH: value,
          trV: value,
          brH: value,
          brV: value,
          blH: value,
          blV: value,
        });
      } else {
        setAdvCorners((prev) => ({ ...prev, [key]: value }));
      }
    },
    [linked],
  );

  // CSS generation
  const borderRadiusCss = useMemo(() => {
    const u = unit;
    if (advanced) {
      const { tlH, tlV, trH, trV, brH, brV, blH, blV } = advCorners;
      const h = `${tlH}${u} ${trH}${u} ${brH}${u} ${blH}${u}`;
      const v = `${tlV}${u} ${trV}${u} ${brV}${u} ${blV}${u}`;
      return `${h} / ${v}`;
    }
    const { tl, tr, br, bl } = corners;
    if (tl === tr && tr === br && br === bl) {
      return `${tl}${u}`;
    }
    return `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`;
  }, [unit, advanced, corners, advCorners]);

  const fullCss = useMemo(() => `border-radius: ${borderRadiusCss};`, [borderRadiusCss]);

  // Inline style for preview
  const previewStyle = useMemo(() => {
    const u = unit;
    if (advanced) {
      const { tlH, tlV, trH, trV, brH, brV, blH, blV } = advCorners;
      return `${tlH}${u} ${trH}${u} ${brH}${u} ${blH}${u} / ${tlV}${u} ${trV}${u} ${brV}${u} ${blV}${u}`;
    }
    const { tl, tr, br, bl } = corners;
    return `${tl}${u} ${tr}${u} ${br}${u} ${bl}${u}`;
  }, [unit, advanced, corners, advCorners]);

  const loadPreset = useCallback((preset: Preset) => {
    setUnit(preset.unit);
    setAdvanced(preset.advanced);
    if (preset.advanced && preset.advancedCorners) {
      setAdvCorners(preset.advancedCorners);
    } else if (preset.corners) {
      setCorners(preset.corners);
    }
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      useToastStore.getState().addToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullCss]);

  // Clamp values when switching units
  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "px" ? "%" : "px";
      const newMax = getMax(next);
      setCorners((c) => ({
        tl: Math.min(c.tl, newMax),
        tr: Math.min(c.tr, newMax),
        br: Math.min(c.br, newMax),
        bl: Math.min(c.bl, newMax),
      }));
      setAdvCorners((c) => ({
        tlH: Math.min(c.tlH, newMax),
        tlV: Math.min(c.tlV, newMax),
        trH: Math.min(c.trH, newMax),
        trV: Math.min(c.trV, newMax),
        brH: Math.min(c.brH, newMax),
        brV: Math.min(c.brV, newMax),
        blH: Math.min(c.blH, newMax),
        blV: Math.min(c.blV, newMax),
      }));
      return next;
    });
  }, []);

  const cornerLabels: {
    key: keyof Corners;
    hKey: keyof AdvancedCorners;
    vKey: keyof AdvancedCorners;
    label: string;
  }[] = [
    { key: "tl", hKey: "tlH", vKey: "tlV", label: "Top Left" },
    { key: "tr", hKey: "trH", vKey: "trV", label: "Top Right" },
    { key: "br", hKey: "brH", vKey: "brV", label: "Bottom Right" },
    { key: "bl", hKey: "blH", vKey: "blV", label: "Bottom Left" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Breadcrumbs />
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
            Border Radius Generator
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create CSS border-radius with live preview, advanced 8-value mode, and presets.
          </p>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center justify-center rounded-2xl border border-gray-200 p-8 sm:p-12 dark:border-gray-800"
          style={{
            background:
              "linear-gradient(135deg, #e0f2fe 0%, #cffafe 25%, #f0fdfa 50%, #ecfdf5 75%, #e0f2fe 100%)",
          }}
        >
          <div
            className="dark:hidden"
            style={{
              width: 220,
              height: 220,
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              borderRadius: previewStyle,
              transition: "border-radius 0.15s ease",
            }}
          />
          <div
            className="hidden dark:block"
            style={{
              width: 220,
              height: 220,
              background: "linear-gradient(135deg, #06b6d4, #0e7490)",
              borderRadius: previewStyle,
              transition: "border-radius 0.15s ease",
            }}
          />
        </motion.div>

        {/* Main grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Toggles row */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-4">
                {/* Link/Unlink */}
                <button
                  onClick={() => setLinked((l) => !l)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    linked
                      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {linked ? <Link size={16} /> : <Unlink size={16} />}
                  {linked ? "Linked" : "Unlinked"}
                </button>

                {/* Unit toggle */}
                <button
                  onClick={toggleUnit}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Unit: <span className="font-bold text-gray-900 dark:text-gray-100">{unit}</span>
                </button>

                {/* Advanced mode toggle */}
                <button
                  onClick={() => setAdvanced((a) => !a)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    advanced
                      ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/30 dark:text-cyan-400"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {advanced ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {advanced ? "Advanced (8-value)" : "Simple (4-value)"}
                </button>
              </div>
            </div>

            {/* Corner sliders */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Corner Controls
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {cornerLabels.map(({ key, hKey, vKey, label }) =>
                  advanced ? (
                    <div key={key} className="space-y-3">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                      <div>
                        <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Horizontal</span>
                          <span>
                            {advCorners[hKey]}
                            {unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={max}
                          value={advCorners[hKey]}
                          onChange={(e) => updateAdvCorner(hKey, Number(e.target.value))}
                          className="w-full accent-cyan-500"
                          aria-label={`${label} horizontal radius`}
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Vertical</span>
                          <span>
                            {advCorners[vKey]}
                            {unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={max}
                          value={advCorners[vKey]}
                          onChange={(e) => updateAdvCorner(vKey, Number(e.target.value))}
                          className="w-full accent-cyan-500"
                          aria-label={`${label} vertical radius`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div key={key}>
                      <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{label}</span>
                        <span>
                          {corners[key]}
                          {unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={max}
                        value={corners[key]}
                        onChange={(e) => updateCorner(key, Number(e.target.value))}
                        className="w-full accent-cyan-500"
                        aria-label={`${label} radius`}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* CSS Output */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  CSS Output
                </h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copied ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy CSS
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                <code>{fullCss}</code>
              </pre>
            </div>
          </motion.div>

          {/* Right: Presets */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Presets
              </h2>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                {PRESETS.map((preset) => {
                  const previewRadius = (() => {
                    const u = preset.unit;
                    if (preset.advanced && preset.advancedCorners) {
                      const c = preset.advancedCorners;
                      return `${c.tlH}${u} ${c.trH}${u} ${c.brH}${u} ${c.blH}${u} / ${c.tlV}${u} ${c.trV}${u} ${c.brV}${u} ${c.blV}${u}`;
                    }
                    if (preset.corners) {
                      const c = preset.corners;
                      return `${c.tl}${u} ${c.tr}${u} ${c.br}${u} ${c.bl}${u}`;
                    }
                    return "0";
                  })();

                  return (
                    <button
                      key={preset.name}
                      onClick={() => loadPreset(preset)}
                      className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-cyan-400 hover:bg-cyan-50 dark:border-gray-700 dark:hover:border-cyan-500 dark:hover:bg-cyan-950/20"
                    >
                      <div
                        className="h-10 w-10"
                        style={{
                          background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                          borderRadius: previewRadius,
                        }}
                      />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-cyan-600 dark:text-gray-400 dark:group-hover:text-cyan-400">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
