import { useState, useCallback } from "react";
import {
  ArrowDownUp,
  Ruler,
  Scale,
  Thermometer,
  Beaker,
  HardDrive,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

type Category = "Length" | "Weight" | "Temperature" | "Volume" | "Data";

interface UnitDef {
  label: string;
  abbr: string;
}

interface CategoryDef {
  icon: React.ReactNode;
  units: UnitDef[];
  toBase: (value: number, unit: string) => number;
  fromBase: (value: number, unit: string) => number;
}

// Length: base = meters
const lengthFactors: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

// Weight: base = grams
const weightFactors: Record<string, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  lb: 453.592,
  oz: 28.3495,
  ton: 1_000_000,
  st: 6350.29,
};

// Volume: base = milliliters
const volumeFactors: Record<string, number> = {
  mL: 1,
  L: 1000,
  gal: 3785.41,
  qt: 946.353,
  pt: 473.176,
  cup: 236.588,
  "fl oz": 29.5735,
  tbsp: 14.7868,
  tsp: 4.92892,
};

// Data: base = bits
const dataFactors: Record<string, number> = {
  bit: 1,
  byte: 8,
  KB: 8 * 1024,
  MB: 8 * 1024 ** 2,
  GB: 8 * 1024 ** 3,
  TB: 8 * 1024 ** 4,
  PB: 8 * 1024 ** 5,
};

function linearToBase(
  factors: Record<string, number>,
): (v: number, u: string) => number {
  return (v, u) => v * (factors[u] ?? 1);
}

function linearFromBase(
  factors: Record<string, number>,
): (v: number, u: string) => number {
  return (v, u) => v / (factors[u] ?? 1);
}

const categories: Record<Category, CategoryDef> = {
  Length: {
    icon: <Ruler size={16} />,
    units: [
      { label: "Millimeter", abbr: "mm" },
      { label: "Centimeter", abbr: "cm" },
      { label: "Meter", abbr: "m" },
      { label: "Kilometer", abbr: "km" },
      { label: "Inch", abbr: "in" },
      { label: "Foot", abbr: "ft" },
      { label: "Yard", abbr: "yd" },
      { label: "Mile", abbr: "mi" },
    ],
    toBase: linearToBase(lengthFactors),
    fromBase: linearFromBase(lengthFactors),
  },
  Weight: {
    icon: <Scale size={16} />,
    units: [
      { label: "Milligram", abbr: "mg" },
      { label: "Gram", abbr: "g" },
      { label: "Kilogram", abbr: "kg" },
      { label: "Pound", abbr: "lb" },
      { label: "Ounce", abbr: "oz" },
      { label: "Metric Ton", abbr: "ton" },
      { label: "Stone", abbr: "st" },
    ],
    toBase: linearToBase(weightFactors),
    fromBase: linearFromBase(weightFactors),
  },
  Temperature: {
    icon: <Thermometer size={16} />,
    units: [
      { label: "Celsius", abbr: "°C" },
      { label: "Fahrenheit", abbr: "°F" },
      { label: "Kelvin", abbr: "K" },
    ],
    toBase: (v, u) => {
      if (u === "°C") return v;
      if (u === "°F") return (v - 32) * (5 / 9);
      return v - 273.15; // K
    },
    fromBase: (v, u) => {
      if (u === "°C") return v;
      if (u === "°F") return v * (9 / 5) + 32;
      return v + 273.15; // K
    },
  },
  Volume: {
    icon: <Beaker size={16} />,
    units: [
      { label: "Milliliter", abbr: "mL" },
      { label: "Liter", abbr: "L" },
      { label: "Gallon (US)", abbr: "gal" },
      { label: "Quart", abbr: "qt" },
      { label: "Pint", abbr: "pt" },
      { label: "Cup", abbr: "cup" },
      { label: "Fluid Ounce", abbr: "fl oz" },
      { label: "Tablespoon", abbr: "tbsp" },
      { label: "Teaspoon", abbr: "tsp" },
    ],
    toBase: linearToBase(volumeFactors),
    fromBase: linearFromBase(volumeFactors),
  },
  Data: {
    icon: <HardDrive size={16} />,
    units: [
      { label: "Bit", abbr: "bit" },
      { label: "Byte", abbr: "byte" },
      { label: "Kilobyte", abbr: "KB" },
      { label: "Megabyte", abbr: "MB" },
      { label: "Gigabyte", abbr: "GB" },
      { label: "Terabyte", abbr: "TB" },
      { label: "Petabyte", abbr: "PB" },
    ],
    toBase: linearToBase(dataFactors),
    fromBase: linearFromBase(dataFactors),
  },
};

const categoryKeys = Object.keys(categories) as Category[];

function formatResult(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value.toExponential(6);
  }
  // Use enough precision to avoid rounding artifacts
  const str = value.toPrecision(10);
  // Strip trailing zeros after decimal
  if (str.includes(".")) {
    return str.replace(/\.?0+$/, "");
  }
  return str;
}

export default function UnitConverter() {
  useSEO({
    title: "Unit Converter",
    description:
      "Convert between units across Length, Weight, Temperature, Volume, and Data categories with real-time bidirectional conversion.",
    path: "/apps/units",
  });

  const [activeCategory, setActiveCategory] = useState<Category>("Length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  const [activeInput, setActiveInput] = useState<"from" | "to">("from");

  const cat = categories[activeCategory];

  const convert = useCallback(
    (value: string, direction: "from" | "to") => {
      const num = parseFloat(value);
      if (value === "" || isNaN(num)) {
        if (direction === "from") {
          setFromValue(value);
          setToValue("");
        } else {
          setToValue(value);
          setFromValue("");
        }
        return;
      }

      if (direction === "from") {
        setFromValue(value);
        const base = cat.toBase(num, fromUnit);
        const result = cat.fromBase(base, toUnit);
        setToValue(formatResult(result));
      } else {
        setToValue(value);
        const base = cat.toBase(num, toUnit);
        const result = cat.fromBase(base, fromUnit);
        setFromValue(formatResult(result));
      }
    },
    [cat, fromUnit, toUnit],
  );

  // Recalculate when units change
  const recalculate = useCallback(
    (newFromUnit: string, newToUnit: string) => {
      const sourceValue = activeInput === "from" ? fromValue : toValue;
      const num = parseFloat(sourceValue);
      if (sourceValue === "" || isNaN(num)) return;

      if (activeInput === "from") {
        const base = cat.toBase(num, newFromUnit);
        const result = cat.fromBase(base, newToUnit);
        setToValue(formatResult(result));
      } else {
        const base = cat.toBase(num, newToUnit);
        const result = cat.fromBase(base, newFromUnit);
        setFromValue(formatResult(result));
      }
    },
    [cat, fromValue, toValue, activeInput],
  );

  function handleCategoryChange(c: Category) {
    setActiveCategory(c);
    const units = categories[c].units;
    setFromUnit(units[0].abbr);
    setToUnit(units.length > 1 ? units[1].abbr : units[0].abbr);
    setFromValue("1");
    // Calculate initial conversion
    const base = categories[c].toBase(1, units[0].abbr);
    const result = categories[c].fromBase(
      base,
      units.length > 1 ? units[1].abbr : units[0].abbr,
    );
    setToValue(formatResult(result));
    setActiveInput("from");
  }

  function handleSwap() {
    const prevFrom = fromUnit;
    const prevTo = toUnit;
    const prevFromVal = fromValue;
    const prevToVal = toValue;
    setFromUnit(prevTo);
    setToUnit(prevFrom);
    setFromValue(prevToVal);
    setToValue(prevFromVal);
    setActiveInput(activeInput === "from" ? "to" : "from");
  }

  function handleFromUnitChange(unit: string) {
    setFromUnit(unit);
    recalculate(unit, toUnit);
  }

  function handleToUnitChange(unit: string) {
    setToUnit(unit);
    recalculate(fromUnit, unit);
  }

  // Calculate initial toValue on first render
  useState(() => {
    const base = cat.toBase(1, fromUnit);
    const result = cat.fromBase(base, toUnit);
    setToValue(formatResult(result));
  });

  const selectClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-600";

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-lg font-medium text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600";

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />
        <div className="mb-8 flex items-center gap-3">
          <Ruler size={28} className="text-gray-700 dark:text-gray-300" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Unit Converter
          </h1>
        </div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-800 dark:bg-gray-950"
        >
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeCategory === key
                  ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {categories[key].icon}
              {key}
            </button>
          ))}
        </motion.div>

        {/* Converter card */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        >
          {/* From */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              From
            </label>
            <div className="flex gap-3">
              <select
                value={fromUnit}
                onChange={(e) => handleFromUnitChange(e.target.value)}
                className={selectClass + " w-2/5 shrink-0"}
              >
                {cat.units.map((u) => (
                  <option key={u.abbr} value={u.abbr}>
                    {u.abbr} — {u.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="any"
                value={fromValue}
                onChange={(e) => {
                  setActiveInput("from");
                  convert(e.target.value, "from");
                }}
                onFocus={() => setActiveInput("from")}
                placeholder="Enter value"
                className={inputClass}
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="mb-5 flex justify-center">
            <button
              onClick={handleSwap}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
              title="Swap units"
            >
              <ArrowDownUp size={18} />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              To
            </label>
            <div className="flex gap-3">
              <select
                value={toUnit}
                onChange={(e) => handleToUnitChange(e.target.value)}
                className={selectClass + " w-2/5 shrink-0"}
              >
                {cat.units.map((u) => (
                  <option key={u.abbr} value={u.abbr}>
                    {u.abbr} — {u.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="any"
                value={toValue}
                onChange={(e) => {
                  setActiveInput("to");
                  convert(e.target.value, "to");
                }}
                onFocus={() => setActiveInput("to")}
                placeholder="Result"
                className={inputClass}
              />
            </div>
          </div>

          {/* Quick reference */}
          {fromValue && toValue && fromUnit !== toUnit && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              1 {fromUnit} ={" "}
              {formatResult(
                cat.fromBase(cat.toBase(1, fromUnit), toUnit),
              )}{" "}
              {toUnit}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
