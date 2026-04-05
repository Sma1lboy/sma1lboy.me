import { useEffect, useState } from "react";

export default function TimerPreview() {
  const [ms, setMs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMs((prev) => (prev + 37) % 6000);
    }, 37);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.floor(ms / 100);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = ms % 100;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1">
      <span className="font-mono text-lg text-gray-300 tabular-nums">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}.
        {String(centiseconds).padStart(2, "0")}
      </span>
      <div className="flex gap-2">
        <div className="h-1.5 w-6 rounded-full bg-blue-400/60" />
        <div className="h-1.5 w-6 rounded-full bg-gray-700" />
      </div>
    </div>
  );
}
