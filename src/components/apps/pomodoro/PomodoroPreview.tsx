import { useEffect, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 36;

export default function PomodoroPreview() {
  const [progress, setProgress] = useState(0.75);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0.05) return 1;
        return prev - 0.008;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const offset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative flex items-center justify-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          className="-rotate-90"
        >
          <circle
            cx="50"
            cy="50"
            r={36}
            fill="none"
            strokeWidth="3"
            className="stroke-gray-800"
          />
          <circle
            cx="50"
            cy="50"
            r={36}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-amber-400"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 50ms linear" }}
          />
        </svg>
        <span className="absolute font-mono text-xs tabular-nums text-gray-300">
          25:00
        </span>
      </div>
    </div>
  );
}
