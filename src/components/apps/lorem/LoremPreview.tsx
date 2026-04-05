import { useEffect, useState } from "react";

const WORDS = [
  "Lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "const",
  "async",
  "return",
  "function",
  "import",
  "export",
  "class",
  "interface",
  "Promise",
];

export default function LoremPreview() {
  const [lines, setLines] = useState(() => Array.from({ length: 3 }, () => buildLine()));

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const next = [...prev];
        const row = Math.floor(Math.random() * next.length);
        next[row] = buildLine();
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6">
      {lines.map((line, i) => (
        <div key={i} className="flex gap-[3px]">
          {line.map((w, j) => (
            <span
              key={j}
              className="font-mono text-[11px]"
              style={{
                color: /^[A-Z]/.test(w) ? "#a78bfa" : "#94a3b8",
                opacity: 0.9,
              }}
            >
              {w}
            </span>
          ))}
        </div>
      ))}
      <div className="mt-1 h-[3px] w-16 rounded-full bg-violet-400/40" />
    </div>
  );
}

function buildLine(): string[] {
  const len = 3 + Math.floor(Math.random() * 3);
  return Array.from({ length: len }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
}
