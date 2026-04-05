import { useEffect, useState } from "react";

export default function EpochPreview() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const digits = String(now).split("");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
      {/* Ticking timestamp */}
      <div className="flex gap-0.5">
        {digits.map((d, i) => (
          <span
            key={i}
            className="rounded bg-gray-800 px-1.5 py-1 font-mono text-sm font-semibold text-emerald-400 transition-all duration-300"
          >
            {d}
          </span>
        ))}
      </div>
      {/* Label */}
      <span className="text-[9px] font-medium tracking-wider text-gray-500 uppercase">
        Unix Epoch
      </span>
      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((j) => (
          <div
            key={j}
            className="h-1 w-1 rounded-full bg-emerald-400/60"
            style={{
              animation: `epochPulse 1.2s ease-in-out ${j * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes epochPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
