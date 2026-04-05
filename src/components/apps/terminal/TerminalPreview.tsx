import { useEffect, useState } from "react";

const lines = [
  "$ whoami",
  "visitor",
  "$ skills",
  "typescript, rust, react...",
  "$ sudo hire-me",
  "⚡ PERMISSION GRANTED",
];

export default function TerminalPreview() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= lines.length) {
          // Reset after a pause
          setTimeout(() => setVisibleLines(0), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="w-full max-w-[200px] overflow-hidden rounded-md border border-gray-700 bg-[#0a0a0a] p-3">
        <div className="mb-2 flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="space-y-0.5">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`truncate font-mono text-[9px] leading-tight ${
                line.startsWith("$")
                  ? "text-green-400"
                  : line.startsWith("⚡")
                    ? "text-yellow-400"
                    : "text-green-300/70"
              }`}
            >
              {line}
            </div>
          ))}
          {visibleLines < lines.length && (
            <span className="inline-block h-2 w-1 animate-pulse bg-green-400" />
          )}
        </div>
      </div>
    </div>
  );
}
