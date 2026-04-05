import { useEffect, useState } from "react";

const FIELDS = ["MIN", "HOUR", "DOM", "MON", "DOW"];
const EXPRESSIONS = [
  ["*", "*", "*", "*", "*"],
  ["*/5", "*", "*", "*", "*"],
  ["0", "9", "*", "*", "1-5"],
  ["0", "0", "1", "*", "*"],
  ["30", "*/2", "*", "*", "*"],
  ["0", "0", "*", "*", "0"],
  ["15", "10", "1", "1-6", "*"],
];

export default function CronPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % EXPRESSIONS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const expr = EXPRESSIONS[idx];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
      {/* Cron expression display */}
      <div className="flex gap-1">
        {expr.map((field, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span
              className="rounded bg-gray-800 px-2 py-1 font-mono text-sm font-semibold text-emerald-400 transition-all duration-300"
            >
              {field}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
              {FIELDS[i]}
            </span>
          </div>
        ))}
      </div>
      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="h-1 w-1 rounded-full bg-emerald-400/60"
            style={{
              animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
