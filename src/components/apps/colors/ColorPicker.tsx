import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  Trash2,
  Download,
  Plus,
  RotateCcw,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import {
  clamp,
  hsvToRgb,
  rgbToHsv,
  rgbToHsl,
  hslToRgb,
  rgbToHex,
  hexToRgb,
} from "@/lib/color";

// ---------------------------------------------------------------------------
// WCAG contrast helpers
// ---------------------------------------------------------------------------

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
}

function contrastRatio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ---------------------------------------------------------------------------
// Palette generation
// ---------------------------------------------------------------------------

type HarmonyRule = "complementary" | "analogous" | "triadic" | "split-complementary";

interface PaletteColor {
  hex: string;
  rgb: [number, number, number];
  label: string;
}

function generatePalette(
  h: number,
  s: number,
  v: number,
  rule: HarmonyRule,
): PaletteColor[] {
  const makeColor = (hue: number, label: string): PaletteColor => {
    const normalizedH = ((hue % 360) + 360) % 360;
    const rgb = hsvToRgb(normalizedH, s, v);
    return { hex: rgbToHex(...rgb), rgb, label };
  };

  switch (rule) {
    case "complementary":
      return [makeColor(h, "Base"), makeColor(h + 180, "Complement")];
    case "analogous":
      return [
        makeColor(h - 30, "Analogous −30°"),
        makeColor(h, "Base"),
        makeColor(h + 30, "Analogous +30°"),
      ];
    case "triadic":
      return [
        makeColor(h, "Base"),
        makeColor(h + 120, "Triadic +120°"),
        makeColor(h + 240, "Triadic +240°"),
      ];
    case "split-complementary":
      return [
        makeColor(h, "Base"),
        makeColor(h + 150, "Split +150°"),
        makeColor(h + 210, "Split +210°"),
      ];
  }
}

// ---------------------------------------------------------------------------
// Saved palette type
// ---------------------------------------------------------------------------

interface SavedPalette {
  id: string;
  name: string;
  rule: HarmonyRule;
  colors: PaletteColor[];
  baseHex: string;
  createdAt: number;
}

const STORAGE_KEY = "colors-saved-palettes";

function loadSavedPalettes(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePalettes(palettes: SavedPalette[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type TabId = "picker" | "palettes" | "contrast" | "saved";

const tabDefs: { id: TabId; label: string }[] = [
  { id: "picker", label: "Picker" },
  { id: "palettes", label: "Palettes" },
  { id: "contrast", label: "Contrast" },
  { id: "saved", label: "Saved" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [text]);
  return (
    <button
      onClick={copy}
      className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-gray-200 dark:hover:bg-gray-800 ${className ?? ""}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <Check size={12} className="text-green-500" />
      ) : (
        <Copy size={12} />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Swatch({
  color,
  label,
  size = "md",
}: {
  color: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const [copied, setCopied] = useState(false);
  const dims = size === "sm" ? "h-10 w-10" : size === "lg" ? "h-20 w-full" : "h-14 w-14";
  return (
    <div className="flex flex-col items-center gap-1.5">
      <button
        onClick={() => {
          navigator.clipboard.writeText(color).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
        className={`${dims} relative rounded-lg border border-gray-200 transition-transform hover:scale-105 active:scale-95 dark:border-gray-700`}
        style={{ backgroundColor: color }}
        title={`Click to copy ${color}`}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"
            >
              <Check size={16} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      {label && (
        <span className="text-[10px] text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
      <span className="font-mono text-xs text-gray-600 dark:text-gray-300">
        {color.toUpperCase()}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Visual color picker (HSV-based)
// ---------------------------------------------------------------------------

function VisualPicker({
  hue,
  sat,
  val,
  onHueChange,
  onSVChange,
}: {
  hue: number;
  sat: number;
  val: number;
  onHueChange: (h: number) => void;
  onSVChange: (s: number, v: number) => void;
}) {
  const svCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueBarRef = useRef<HTMLCanvasElement>(null);
  const svDragging = useRef(false);
  const hueDragging = useRef(false);

  // Draw SV canvas
  useEffect(() => {
    const canvas = svCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Base hue fill
    const [r, g, b] = hsvToRgb(hue, 100, 100);
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, w, h);

    // White gradient (left to right)
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, "rgba(255,255,255,1)");
    whiteGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, h);

    // Black gradient (top to bottom)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, "rgba(0,0,0,0)");
    blackGrad.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, h);
  }, [hue]);

  // Draw hue bar
  useEffect(() => {
    const canvas = hueBarRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 6; i++) {
      const [r, g, b] = hsvToRgb(i * 60, 100, 100);
      grad.addColorStop(i / 6, `rgb(${r},${g},${b})`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, []);

  const handleSVPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = svCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, rect.width);
      const y = clamp(e.clientY - rect.top, 0, rect.height);
      const s = (x / rect.width) * 100;
      const v = (1 - y / rect.height) * 100;
      onSVChange(s, v);
    },
    [onSVChange],
  );

  const handleHuePointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = hueBarRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = clamp(e.clientX - rect.left, 0, rect.width);
      onHueChange((x / rect.width) * 360);
    },
    [onHueChange],
  );

  return (
    <div className="flex flex-col gap-3">
      {/* SV area */}
      <div className="relative">
        <canvas
          ref={svCanvasRef}
          width={280}
          height={200}
          className="w-full cursor-crosshair rounded-lg border border-gray-200 dark:border-gray-700"
          style={{ aspectRatio: "280/200" }}
          onPointerDown={(e) => {
            svDragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            handleSVPointer(e);
          }}
          onPointerMove={(e) => {
            if (svDragging.current) handleSVPointer(e);
          }}
          onPointerUp={() => {
            svDragging.current = false;
          }}
        />
        {/* Crosshair indicator */}
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{
            left: `${sat}%`,
            top: `${100 - val}%`,
          }}
        />
      </div>

      {/* Hue bar */}
      <div className="relative">
        <canvas
          ref={hueBarRef}
          width={280}
          height={16}
          className="h-4 w-full cursor-pointer rounded-full border border-gray-200 dark:border-gray-700"
          onPointerDown={(e) => {
            hueDragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            handleHuePointer(e);
          }}
          onPointerMove={(e) => {
            if (hueDragging.current) handleHuePointer(e);
          }}
          onPointerUp={() => {
            hueDragging.current = false;
          }}
        />
        {/* Hue indicator */}
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
          style={{ left: `${(hue / 360) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contrast badge
// ---------------------------------------------------------------------------

function ContrastBadge({
  label,
  pass,
}: {
  label: string;
  pass: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        pass
          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
      }`}
    >
      {pass ? <Check size={12} /> : "✕"}
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ColorPicker() {
  useSEO({
    title: "Color Picker & Palette Generator",
    description:
      "Pick colors, generate harmonious palettes, check WCAG contrast, and save your favorites.",
    path: "/apps/colors",
  });

  // Active tab
  const [activeTab, setActiveTab] = useState<TabId>("picker");

  // Color state (HSV is source of truth for the picker)
  const [hue, setHue] = useState(210);
  const [sat, setSat] = useState(80);
  const [val, setVal] = useState(90);

  // Derived colors
  const rgb = useMemo(() => hsvToRgb(hue, sat, val), [hue, sat, val]);
  const hex = useMemo(() => rgbToHex(...rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(...rgb), [rgb]);

  // Input state for manual entry
  const [hexInput, setHexInput] = useState(hex);
  useEffect(() => setHexInput(hex), [hex]);

  const applyHex = useCallback((v: string) => {
    const parsed = hexToRgb(v);
    if (parsed) {
      const [h, s, vv] = rgbToHsv(...parsed);
      setHue(h);
      setSat(s);
      setVal(vv);
    }
  }, []);

  const applyRgb = useCallback((r: number, g: number, b: number) => {
    const [h, s, v] = rgbToHsv(
      clamp(r, 0, 255),
      clamp(g, 0, 255),
      clamp(b, 0, 255),
    );
    setHue(h);
    setSat(s);
    setVal(v);
  }, []);

  const applyHsl = useCallback((h: number, s: number, l: number) => {
    const rgbVal = hslToRgb(
      clamp(h, 0, 360),
      clamp(s, 0, 100),
      clamp(l, 0, 100),
    );
    const [hh, ss, vv] = rgbToHsv(...rgbVal);
    setHue(hh);
    setSat(ss);
    setVal(vv);
  }, []);

  // Palette state
  const [paletteRule, setPaletteRule] = useState<HarmonyRule>("complementary");
  const palette = useMemo(
    () => generatePalette(hue, sat, val, paletteRule),
    [hue, sat, val, paletteRule],
  );

  // Contrast state
  const [contrastFg, setContrastFg] = useState("#1a1a2e");
  const [contrastBg, setContrastBg] = useState("#ffffff");

  const contrastFgRgb = useMemo(
    () => hexToRgb(contrastFg) ?? ([0, 0, 0] as [number, number, number]),
    [contrastFg],
  );
  const contrastBgRgb = useMemo(
    () => hexToRgb(contrastBg) ?? ([255, 255, 255] as [number, number, number]),
    [contrastBg],
  );
  const ratio = useMemo(
    () => contrastRatio(contrastFgRgb, contrastBgRgb),
    [contrastFgRgb, contrastBgRgb],
  );

  // Saved palettes
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(loadSavedPalettes);

  const savePalette = useCallback(() => {
    const entry: SavedPalette = {
      id: Date.now().toString(36),
      name: `${hex.toUpperCase()} ${paletteRule}`,
      rule: paletteRule,
      colors: palette,
      baseHex: hex,
      createdAt: Date.now(),
    };
    setSavedPalettes((prev) => {
      const next = [entry, ...prev];
      savePalettes(next);
      return next;
    });
  }, [hex, paletteRule, palette]);

  const deletePalette = useCallback((id: string) => {
    setSavedPalettes((prev) => {
      const next = prev.filter((p) => p.id !== id);
      savePalettes(next);
      return next;
    });
  }, []);

  const loadPalette = useCallback(
    (p: SavedPalette) => {
      applyHex(p.baseHex);
      setPaletteRule(p.rule);
      setActiveTab("palettes");
    },
    [applyHex],
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/apps"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Color Picker & Palette Generator
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pick colors, generate palettes, check contrast ratios
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900">
          {tabDefs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`relative flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {activeTab === t.id && (
                <motion.div
                  layoutId="colorsActiveTab"
                  className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-800"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "picker" && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PickerTab
                hue={hue}
                sat={sat}
                val={val}
                rgb={rgb}
                hex={hex}
                hsl={hsl}
                hexInput={hexInput}
                setHexInput={setHexInput}
                setHue={setHue}
                onSVChange={(s, v) => { setSat(s); setVal(v); }}
                applyHex={applyHex}
                applyRgb={applyRgb}
                applyHsl={applyHsl}
              />
            </motion.div>
          )}

          {activeTab === "palettes" && (
            <motion.div
              key="palettes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PalettesTab
                hex={hex}
                palette={palette}
                paletteRule={paletteRule}
                setPaletteRule={setPaletteRule}
                onSave={savePalette}
              />
            </motion.div>
          )}

          {activeTab === "contrast" && (
            <motion.div
              key="contrast"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ContrastTab
                fg={contrastFg}
                bg={contrastBg}
                fgRgb={contrastFgRgb}
                bgRgb={contrastBgRgb}
                ratio={ratio}
                setFg={setContrastFg}
                setBg={setContrastBg}
                currentHex={hex}
              />
            </motion.div>
          )}

          {activeTab === "saved" && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <SavedTab
                palettes={savedPalettes}
                onLoad={loadPalette}
                onDelete={deletePalette}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Picker Tab
// ---------------------------------------------------------------------------

function PickerTab({
  hue, sat, val, rgb, hex, hsl, hexInput, setHexInput,
  setHue, onSVChange, applyHex, applyRgb, applyHsl,
}: {
  hue: number;
  sat: number;
  val: number;
  rgb: [number, number, number];
  hex: string;
  hsl: [number, number, number];
  hexInput: string;
  setHexInput: (v: string) => void;
  setHue: (h: number) => void;
  onSVChange: (s: number, v: number) => void;
  applyHex: (v: string) => void;
  applyRgb: (r: number, g: number, b: number) => void;
  applyHsl: (h: number, s: number, l: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1fr]">
        {/* Visual picker */}
        <div className="border-b border-gray-200 p-5 lg:border-b-0 lg:border-r dark:border-gray-800">
          <VisualPicker
            hue={hue}
            sat={sat}
            val={val}
            onHueChange={setHue}
            onSVChange={onSVChange}
          />
          {/* Color preview swatch */}
          <div className="mt-4 flex items-center gap-4">
            <div
              className="h-12 w-12 rounded-lg border border-gray-200 shadow-sm dark:border-gray-700"
              style={{ backgroundColor: hex }}
            />
            <div className="flex flex-col">
              <span className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">
                {hex.toUpperCase()}
              </span>
              <CopyButton
                text={hex}
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Input fields */}
        <div className="p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
            Color Values
          </h3>

          {/* HEX */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              HEX
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={() => applyHex(hexInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyHex(hexInput);
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                maxLength={7}
              />
              <CopyButton
                text={hex}
                className="text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* RGB */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              RGB
            </label>
            <div className="flex gap-2">
              {(["R", "G", "B"] as const).map((ch, i) => (
                <div key={ch} className="flex-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">{ch}</span>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[i]}
                      onChange={(e) => {
                        const newRgb = [...rgb] as [number, number, number];
                        newRgb[i] = clamp(parseInt(e.target.value) || 0, 0, 255);
                        applyRgb(...newRgb);
                      }}
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-2 font-mono text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              ))}
              <CopyButton
                text={`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`}
                className="self-end text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* HSL */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              HSL
            </label>
            <div className="flex gap-2">
              {(["H", "S", "L"] as const).map((ch, i) => {
                const max = i === 0 ? 360 : 100;
                return (
                  <div key={ch} className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-400">
                        {ch}{i === 0 ? "°" : "%"}
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={max}
                        value={hsl[i]}
                        onChange={(e) => {
                          const newHsl = [...hsl] as [number, number, number];
                          newHsl[i] = clamp(parseInt(e.target.value) || 0, 0, max);
                          applyHsl(...newHsl);
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-2 py-2 font-mono text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                );
              })}
              <CopyButton
                text={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`}
                className="self-end text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>

          {/* CSS string preview */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-1 text-[10px] font-medium text-gray-400 dark:text-gray-500">
              CSS
            </div>
            <code className="block font-mono text-xs text-gray-700 dark:text-gray-300">
              color: {hex};
            </code>
            <code className="block font-mono text-xs text-gray-700 dark:text-gray-300">
              color: rgb({rgb[0]}, {rgb[1]}, {rgb[2]});
            </code>
            <code className="block font-mono text-xs text-gray-700 dark:text-gray-300">
              color: hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%);
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Palettes Tab
// ---------------------------------------------------------------------------

const harmonyRules: { id: HarmonyRule; label: string }[] = [
  { id: "complementary", label: "Complementary" },
  { id: "analogous", label: "Analogous" },
  { id: "triadic", label: "Triadic" },
  { id: "split-complementary", label: "Split-Complementary" },
];

function PalettesTab({
  hex,
  palette,
  paletteRule,
  setPaletteRule,
  onSave,
}: {
  hex: string;
  palette: PaletteColor[];
  paletteRule: HarmonyRule;
  setPaletteRule: (r: HarmonyRule) => void;
  onSave: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="p-5">
        {/* Base color indicator */}
        <div className="mb-5 flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-md border border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: hex }}
          />
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Base color
            </span>
            <span className="ml-2 font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
              {hex.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (set in Picker tab)
          </span>
        </div>

        {/* Rule selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {harmonyRules.map((r) => (
            <button
              key={r.id}
              onClick={() => setPaletteRule(r.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                paletteRule === r.id
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Palette swatches */}
        <div className="mb-6">
          {/* Full-width band */}
          <div className="mb-4 flex overflow-hidden rounded-lg">
            {palette.map((c, i) => (
              <motion.div
                key={`${c.hex}-${i}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                className="h-16 flex-1"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Individual swatches */}
          <div className="flex flex-wrap justify-center gap-6">
            {palette.map((c, i) => (
              <motion.div
                key={`${c.hex}-swatch-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Swatch color={c.hex} label={c.label} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          <Plus size={14} />
          Save Palette
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contrast Tab
// ---------------------------------------------------------------------------

function ContrastTab({
  fg,
  bg,
  fgRgb,
  bgRgb,
  ratio,
  setFg,
  setBg,
  currentHex,
}: {
  fg: string;
  bg: string;
  fgRgb: [number, number, number];
  bgRgb: [number, number, number];
  ratio: number;
  setFg: (v: string) => void;
  setBg: (v: string) => void;
  currentHex: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="p-5">
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Foreground */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Foreground (text)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fg}
                onChange={(e) => setFg(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-200 dark:border-gray-700"
              />
              <input
                type="text"
                value={fg}
                onChange={(e) => {
                  if (/^#[0-9a-f]{0,6}$/i.test(e.target.value))
                    setFg(e.target.value);
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                maxLength={7}
              />
              <button
                onClick={() => setFg(currentHex)}
                className="rounded-lg bg-gray-200 px-2 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Use current picker color"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-gray-200 dark:border-gray-700"
              />
              <input
                type="text"
                value={bg}
                onChange={(e) => {
                  if (/^#[0-9a-f]{0,6}$/i.test(e.target.value))
                    setBg(e.target.value);
                }}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-sm text-gray-900 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                maxLength={7}
              />
              <button
                onClick={() => setBg(currentHex)}
                className="rounded-lg bg-gray-200 px-2 py-2 text-xs text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                title="Use current picker color"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Swap button */}
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => {
              const tmp = fg;
              setFg(bg);
              setBg(tmp);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <RotateCcw size={12} />
            Swap Colors
          </button>
        </div>

        {/* Preview */}
        <div
          className="mb-6 rounded-xl p-6"
          style={{ backgroundColor: bg }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: fg }}
          >
            Sample Text
          </p>
          <p
            className="mt-1 text-sm"
            style={{ color: fg }}
          >
            The quick brown fox jumps over the lazy dog. 0123456789
          </p>
          <p
            className="mt-2 text-xs"
            style={{ color: fg, opacity: 0.7 }}
          >
            rgb({fgRgb[0]}, {fgRgb[1]}, {fgRgb[2]}) on rgb({bgRgb[0]}, {bgRgb[1]}, {bgRgb[2]})
          </p>
        </div>

        {/* Ratio display */}
        <div className="mb-4 text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {ratio.toFixed(2)}
            <span className="ml-1 text-lg text-gray-400">: 1</span>
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Contrast Ratio
          </div>
        </div>

        {/* Pass/fail badges */}
        <div className="flex flex-wrap justify-center gap-3">
          <ContrastBadge label="AA Normal (4.5:1)" pass={ratio >= 4.5} />
          <ContrastBadge label="AA Large (3:1)" pass={ratio >= 3} />
          <ContrastBadge label="AAA Normal (7:1)" pass={ratio >= 7} />
          <ContrastBadge label="AAA Large (4.5:1)" pass={ratio >= 4.5} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Saved Tab
// ---------------------------------------------------------------------------

function SavedTab({
  palettes,
  onLoad,
  onDelete,
}: {
  palettes: SavedPalette[];
  onLoad: (p: SavedPalette) => void;
  onDelete: (id: string) => void;
}) {
  if (palettes.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-3 text-4xl">🎨</div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No saved palettes yet. Generate one in the Palettes tab and click Save.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {palettes.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
        >
          {/* Color band */}
          <div className="flex h-10">
            {p.colors.map((c, i) => (
              <div
                key={`${c.hex}-${i}`}
                className="flex-1"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-mono text-sm font-semibold text-gray-900 dark:text-gray-100">
                {p.name}
              </span>
              <div className="mt-0.5 flex gap-2">
                {p.colors.map((c, i) => (
                  <span
                    key={`${c.hex}-label-${i}`}
                    className="font-mono text-[10px] text-gray-500 dark:text-gray-400"
                  >
                    {c.hex.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onLoad(p)}
                className="rounded-lg bg-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Load
              </button>
              <button
                onClick={() => onDelete(p.id)}
                className="rounded-lg bg-red-100 px-2 py-1.5 text-xs text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
