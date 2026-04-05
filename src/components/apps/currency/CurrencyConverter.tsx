import { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowDownUp,
  Loader2,
  TrendingUp,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

interface Currencies {
  [code: string]: string;
}

interface ConversionResult {
  amount: number;
  base: string;
  date: string;
  rates: { [code: string]: number };
}

interface HistoricalRates {
  [date: string]: { [code: string]: number };
}

export default function CurrencyConverter() {
  useSEO({
    title: "Currency Converter",
    description:
      "Convert currencies in real-time with exchange rates and 30-day historical chart.",
    path: "/apps/currency",
  });

  const [currencies, setCurrencies] = useState<Currencies>({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoricalRates | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Fetch currency list on mount
  useEffect(() => {
    fetch("https://api.frankfurter.app/currencies")
      .then((r) => r.json())
      .then((data: Currencies) => setCurrencies(data))
      .catch(() => setError("Failed to load currencies."));
  }, []);

  // Convert currency
  const convert = useCallback(
    async (amt: string, fromCur: string, toCur: string) => {
      if (fromCur === toCur) {
        setResult({
          amount: parseFloat(amt) || 0,
          base: fromCur,
          date: new Date().toISOString().slice(0, 10),
          rates: { [toCur]: parseFloat(amt) || 0 },
        });
        return;
      }
      const parsedAmt = parseFloat(amt);
      if (!parsedAmt || parsedAmt <= 0) {
        setResult(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${parsedAmt}&from=${fromCur}&to=${toCur}`,
        );
        if (!res.ok) throw new Error("Conversion failed");
        const data: ConversionResult = await res.json();
        setResult(data);
      } catch {
        setError("Failed to convert. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch 30-day history
  const fetchHistory = useCallback(
    async (fromCur: string, toCur: string) => {
      if (fromCur === toCur) {
        setHistory(null);
        return;
      }
      setHistoryLoading(true);
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const res = await fetch(
          `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=${fromCur}&to=${toCur}`,
        );
        if (!res.ok) throw new Error("History fetch failed");
        const data = await res.json();
        setHistory(data.rates as HistoricalRates);
      } catch {
        setHistory(null);
      } finally {
        setHistoryLoading(false);
      }
    },
    [],
  );

  // Debounced conversion
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      convert(amount, from, to);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [amount, from, to, convert]);

  // Fetch history when currencies change
  useEffect(() => {
    fetchHistory(from, to);
  }, [from, to, fetchHistory]);

  // Draw chart
  useEffect(() => {
    if (!history || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 16, bottom: 32, left: 56 };

    const dates = Object.keys(history).sort();
    const rates = dates.map((d) => Object.values(history[d])[0]);

    if (rates.length < 2) return;

    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min || 1;
    const yMin = min - range * 0.1;
    const yMax = max + range * 0.1;

    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const toX = (i: number) => pad.left + (i / (dates.length - 1)) * plotW;
    const toY = (v: number) =>
      pad.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const gridLines = 4;
    ctx.strokeStyle = "rgba(107, 114, 128, 0.15)";
    ctx.lineWidth = 1;
    const isDark =
      document.documentElement.classList.contains("dark");
    ctx.fillStyle = isDark
      ? "rgba(156, 163, 175, 0.6)"
      : "rgba(107, 114, 128, 0.6)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= gridLines; i++) {
      const val = yMin + ((yMax - yMin) * i) / gridLines;
      const y = toY(val);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillText(val.toFixed(4), pad.left - 6, y + 3);
    }

    // X-axis date labels
    ctx.textAlign = "center";
    const labelCount = Math.min(6, dates.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.round((i / (labelCount - 1)) * (dates.length - 1));
      const d = dates[idx];
      const x = toX(idx);
      ctx.fillText(
        d.slice(5), // MM-DD
        x,
        h - pad.bottom + 16,
      );
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
    grad.addColorStop(0, isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.12)");
    grad.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(rates[0]));
    for (let i = 1; i < rates.length; i++) {
      ctx.lineTo(toX(i), toY(rates[i]));
    }
    ctx.lineTo(toX(rates.length - 1), h - pad.bottom);
    ctx.lineTo(toX(0), h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(rates[0]));
    for (let i = 1; i < rates.length; i++) {
      ctx.lineTo(toX(i), toY(rates[i]));
    }
    ctx.strokeStyle = isDark ? "#60a5fa" : "#3b82f6";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Endpoint dot
    const lastX = toX(rates.length - 1);
    const lastY = toY(rates[rates.length - 1]);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#60a5fa" : "#3b82f6";
    ctx.fill();
  }, [history]);

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  const sortedCodes = Object.keys(currencies).sort();
  const convertedValue = result?.rates?.[to];
  const rate =
    result && from !== to && convertedValue !== undefined
      ? convertedValue / (result.amount || 1)
      : null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-2xl px-6 py-10 sm:px-8 sm:py-14">
        <Breadcrumbs />
        <div className="mb-8 flex items-center gap-3">
          <DollarSign
            size={28}
            className="text-gray-700 dark:text-gray-300"
          />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Currency Converter
          </h1>
        </div>

        {/* Converter card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        >
          {/* Amount */}
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Amount
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mb-5 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-lg font-medium text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600"
          />

          {/* From / Swap / To */}
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-600"
              >
                {sortedCodes.map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencies[code]}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
              title="Swap currencies"
            >
              <ArrowDownUp size={18} />
            </button>

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-gray-600"
              >
                {sortedCodes.map((code) => (
                  <option key={code} value={code}>
                    {code} - {currencies[code]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="mt-6 min-h-[60px]">
            {loading && (
              <div className="flex items-center justify-center py-3">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            )}
            {error && !loading && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}
            {result && convertedValue !== undefined && !loading && !error && (
              <motion.div
                key={`${from}-${to}-${amount}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {convertedValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{" "}
                  <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    {to}
                  </span>
                </div>
                {rate !== null && (
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <RefreshCw size={12} />
                    <span>
                      1 {from} = {rate.toFixed(4)} {to}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">
                      &middot;
                    </span>
                    <span>{result.date}</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Historical chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-gray-400" />
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
              30-Day History &middot; {from}/{to}
            </span>
          </div>

          {historyLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-gray-400" />
            </div>
          )}

          {from === to && !historyLoading && (
            <p className="py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              Select different currencies to see historical rates.
            </p>
          )}

          {!historyLoading && history && from !== to && (
            <canvas
              ref={canvasRef}
              className="h-48 w-full sm:h-56"
            />
          )}
        </motion.div>

        {/* Attribution */}
        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
          Exchange rates by{" "}
          <a
            href="https://www.frankfurter.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600 dark:hover:text-gray-400"
          >
            Frankfurter
          </a>
        </p>
      </div>
    </div>
  );
}
