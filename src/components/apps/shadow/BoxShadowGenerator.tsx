import { useState, useCallback, useMemo } from "react";
import { Copy, Check, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";
import { useToastStore } from "@/store/toastStore";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ShadowLayer {
  id: number;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
  visible: boolean;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const PRESETS: { name: string; layers: Omit<ShadowLayer, "id">[] }[] = [
  {
    name: "Subtle",
    layers: [
      {
        offsetX: 0,
        offsetY: 2,
        blur: 8,
        spread: 0,
        color: "#000000",
        opacity: 0.08,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Medium",
    layers: [
      {
        offsetX: 0,
        offsetY: 4,
        blur: 16,
        spread: -2,
        color: "#000000",
        opacity: 0.15,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Heavy",
    layers: [
      {
        offsetX: 0,
        offsetY: 12,
        blur: 40,
        spread: -4,
        color: "#000000",
        opacity: 0.3,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Neon Glow",
    layers: [
      {
        offsetX: 0,
        offsetY: 0,
        blur: 20,
        spread: 2,
        color: "#8b5cf6",
        opacity: 0.6,
        inset: false,
        visible: true,
      },
      {
        offsetX: 0,
        offsetY: 0,
        blur: 60,
        spread: 10,
        color: "#8b5cf6",
        opacity: 0.3,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Layered",
    layers: [
      {
        offsetX: 0,
        offsetY: 1,
        blur: 2,
        spread: 0,
        color: "#000000",
        opacity: 0.05,
        inset: false,
        visible: true,
      },
      {
        offsetX: 0,
        offsetY: 4,
        blur: 8,
        spread: 0,
        color: "#000000",
        opacity: 0.06,
        inset: false,
        visible: true,
      },
      {
        offsetX: 0,
        offsetY: 16,
        blur: 32,
        spread: -4,
        color: "#000000",
        opacity: 0.08,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Inset",
    layers: [
      {
        offsetX: 0,
        offsetY: 4,
        blur: 12,
        spread: 0,
        color: "#000000",
        opacity: 0.2,
        inset: true,
        visible: true,
      },
    ],
  },
  {
    name: "Sharp",
    layers: [
      {
        offsetX: 4,
        offsetY: 4,
        blur: 0,
        spread: 0,
        color: "#000000",
        opacity: 0.25,
        inset: false,
        visible: true,
      },
    ],
  },
  {
    name: "Neumorphism",
    layers: [
      {
        offsetX: 6,
        offsetY: 6,
        blur: 16,
        spread: 0,
        color: "#000000",
        opacity: 0.12,
        inset: false,
        visible: true,
      },
      {
        offsetX: -6,
        offsetY: -6,
        blur: 16,
        spread: 0,
        color: "#ffffff",
        opacity: 0.8,
        inset: false,
        visible: true,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let nextId = Date.now();

function createLayer(overrides?: Partial<ShadowLayer>): ShadowLayer {
  return {
    id: nextId++,
    offsetX: 0,
    offsetY: 4,
    blur: 12,
    spread: 0,
    color: "#000000",
    opacity: 0.15,
    inset: false,
    visible: true,
    ...overrides,
  };
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function layerToCss(layer: ShadowLayer): string {
  const color = hexToRgba(layer.color, layer.opacity);
  const inset = layer.inset ? "inset " : "";
  return `${inset}${layer.offsetX}px ${layer.offsetY}px ${layer.blur}px ${layer.spread}px ${color}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BoxShadowGenerator() {
  useSEO({
    title: "Box Shadow Generator | sma1lboy",
    description:
      "Create CSS box shadows with sliders for offset, blur, spread, color, and opacity. Multiple layers, presets, and copy-ready CSS output.",
  });

  const [layers, setLayers] = useState<ShadowLayer[]>(() => [createLayer()]);
  const [activeLayerId, setActiveLayerId] = useState(() => layers[0]?.id ?? 0);
  const [copied, setCopied] = useState(false);

  // Preview box customization
  const [previewSize, setPreviewSize] = useState(200);
  const [previewColor, setPreviewColor] = useState("#ffffff");
  const [previewRadius, setPreviewRadius] = useState(16);
  const [previewBg, setPreviewBg] = useState("#e5e7eb");

  const activeLayer = layers.find((l) => l.id === activeLayerId) ?? layers[0];

  const shadowCss = useMemo(() => {
    const visible = layers.filter((l) => l.visible);
    if (visible.length === 0) return "none";
    return visible.map(layerToCss).join(",\n    ");
  }, [layers]);

  const fullCss = useMemo(() => `box-shadow: ${shadowCss};`, [shadowCss]);

  // Layer operations
  const updateLayer = useCallback((id: number, updates: Partial<ShadowLayer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const addLayer = useCallback(() => {
    const newLayer = createLayer();
    setLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, []);

  const removeLayer = useCallback(
    (id: number) => {
      setLayers((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((l) => l.id !== id);
        if (activeLayerId === id) {
          setActiveLayerId(next[0].id);
        }
        return next;
      });
    },
    [activeLayerId],
  );

  const moveLayer = useCallback((id: number, dir: -1 | 1) => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  }, []);

  const loadPreset = useCallback((preset: (typeof PRESETS)[number]) => {
    const newLayers = preset.layers.map((l) => createLayer(l));
    setLayers(newLayers);
    setActiveLayerId(newLayers[0].id);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(fullCss).then(() => {
      setCopied(true);
      useToastStore.getState().addToast("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [fullCss]);

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
            Box Shadow Generator
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create CSS box shadows with multiple layers, presets, and live preview.
          </p>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center justify-center rounded-2xl border border-gray-200 p-8 sm:p-12 dark:border-gray-800"
          style={{ backgroundColor: previewBg }}
        >
          <div
            style={{
              width: previewSize,
              height: previewSize,
              backgroundColor: previewColor,
              borderRadius: previewRadius,
              boxShadow: shadowCss === "none" ? undefined : shadowCss,
              transition: "box-shadow 0.15s ease",
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
            {/* Layer list */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Shadow Layers
                </h2>
                <button
                  onClick={addLayer}
                  className="flex items-center gap-1 rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-600"
                >
                  <Plus size={14} /> Add Layer
                </button>
              </div>
              <div className="space-y-1">
                {layers.map((layer, idx) => (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                      layer.id === activeLayerId
                        ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/30"
                        : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-900"
                    } ${!layer.visible ? "opacity-40" : ""}`}
                  >
                    <div
                      className="h-4 w-4 shrink-0 rounded"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="flex-1 text-gray-700 dark:text-gray-300">
                      Layer {idx + 1}
                      {layer.inset ? " (inset)" : ""}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLayer(layer.id, { visible: !layer.visible });
                      }}
                      className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      aria-label={layer.visible ? "Hide layer" : "Show layer"}
                    >
                      {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer.id, -1);
                      }}
                      disabled={idx === 0}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-200"
                      aria-label="Move layer up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayer(layer.id, 1);
                      }}
                      disabled={idx === layers.length - 1}
                      className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 dark:hover:text-gray-200"
                      aria-label="Move layer down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLayer(layer.id);
                      }}
                      disabled={layers.length <= 1}
                      className="p-0.5 text-gray-400 hover:text-red-500 disabled:opacity-30"
                      aria-label="Remove layer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active layer controls */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Layer Controls
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Offset X */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Horizontal Offset</span>
                    <span>{activeLayer.offsetX}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={activeLayer.offsetX}
                    onChange={(e) =>
                      updateLayer(activeLayerId, {
                        offsetX: Number(e.target.value),
                      })
                    }
                    className="w-full accent-violet-500"
                    aria-label="Horizontal offset"
                  />
                </div>

                {/* Offset Y */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Vertical Offset</span>
                    <span>{activeLayer.offsetY}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={activeLayer.offsetY}
                    onChange={(e) =>
                      updateLayer(activeLayerId, {
                        offsetY: Number(e.target.value),
                      })
                    }
                    className="w-full accent-violet-500"
                    aria-label="Vertical offset"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Blur Radius</span>
                    <span>{activeLayer.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={activeLayer.blur}
                    onChange={(e) =>
                      updateLayer(activeLayerId, {
                        blur: Number(e.target.value),
                      })
                    }
                    className="w-full accent-violet-500"
                    aria-label="Blur radius"
                  />
                </div>

                {/* Spread */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Spread Radius</span>
                    <span>{activeLayer.spread}px</span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={50}
                    value={activeLayer.spread}
                    onChange={(e) =>
                      updateLayer(activeLayerId, {
                        spread: Number(e.target.value),
                      })
                    }
                    className="w-full accent-violet-500"
                    aria-label="Spread radius"
                  />
                </div>

                {/* Color + Opacity */}
                <div>
                  <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Shadow Color</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={activeLayer.color}
                      onChange={(e) => updateLayer(activeLayerId, { color: e.target.value })}
                      className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                      aria-label="Shadow color"
                    />
                    <input
                      type="text"
                      value={activeLayer.color}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                          updateLayer(activeLayerId, { color: val });
                        }
                      }}
                      className="w-20 rounded border border-gray-300 bg-transparent px-2 py-1 text-xs text-gray-700 dark:border-gray-600 dark:text-gray-300"
                      aria-label="Shadow color hex"
                    />
                  </div>
                </div>

                {/* Opacity */}
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Opacity</span>
                    <span>{Math.round(activeLayer.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(activeLayer.opacity * 100)}
                    onChange={(e) =>
                      updateLayer(activeLayerId, {
                        opacity: Number(e.target.value) / 100,
                      })
                    }
                    className="w-full accent-violet-500"
                    aria-label="Shadow opacity"
                  />
                </div>

                {/* Inset toggle */}
                <div className="flex items-center gap-3 sm:col-span-2">
                  <button
                    onClick={() =>
                      updateLayer(activeLayerId, {
                        inset: !activeLayer.inset,
                      })
                    }
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      activeLayer.inset ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    aria-label="Toggle inset shadow"
                    role="switch"
                    aria-checked={activeLayer.inset}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                        activeLayer.inset ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Inset Shadow</span>
                </div>
              </div>
            </div>

            {/* Preview customization */}
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Preview Settings
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Box Size</span>
                    <span>{previewSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={80}
                    max={400}
                    value={previewSize}
                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                    className="w-full accent-violet-500"
                    aria-label="Preview box size"
                  />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Border Radius</span>
                    <span>{previewRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={previewRadius}
                    onChange={(e) => setPreviewRadius(Number(e.target.value))}
                    className="w-full accent-violet-500"
                    aria-label="Preview border radius"
                  />
                </div>
                <div>
                  <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Box Color</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewColor}
                      onChange={(e) => setPreviewColor(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                      aria-label="Preview box color"
                    />
                    <span className="text-xs text-gray-500">{previewColor}</span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                    Background Color
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={previewBg}
                      onChange={(e) => setPreviewBg(e.target.value)}
                      className="h-8 w-10 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                      aria-label="Preview background color"
                    />
                    <span className="text-xs text-gray-500">{previewBg}</span>
                  </div>
                </div>
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
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => loadPreset(preset)}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 text-left transition-colors hover:border-violet-400 hover:bg-violet-50 dark:border-gray-700 dark:hover:border-violet-500 dark:hover:bg-violet-950/20"
                  >
                    <div
                      className="h-10 w-10 rounded-lg bg-white dark:bg-gray-200"
                      style={{
                        boxShadow: preset.layers
                          .filter((l) => l.visible)
                          .map((l) => {
                            const color = hexToRgba(l.color, l.opacity);
                            const inset = l.inset ? "inset " : "";
                            return `${inset}${l.offsetX}px ${l.offsetY}px ${l.blur}px ${l.spread}px ${color}`;
                          })
                          .join(", "),
                      }}
                    />
                    <span className="text-xs font-medium text-gray-600 group-hover:text-violet-600 dark:text-gray-400 dark:group-hover:text-violet-400">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
