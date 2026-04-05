import { useEffect, useState } from "react";

const sampleText = "const speed = wpm;";

export default function TypingTestPreview() {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTyped((prev) => {
        if (prev >= sampleText.length) {
          setTimeout(() => setTyped(0), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="w-full max-w-[220px] overflow-hidden rounded-md border border-gray-700 bg-[#0a0a0a] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500">
            Typing Test
          </span>
          <span className="font-mono text-[9px] text-yellow-400">
            {Math.round((typed / 5) * 12)} WPM
          </span>
        </div>
        <div className="font-mono text-[10px] leading-relaxed">
          {sampleText.split("").map((char, i) => (
            <span
              key={i}
              className={
                i < typed
                  ? "text-green-400"
                  : i === typed
                    ? "bg-green-400/20 text-green-300"
                    : "text-gray-600"
              }
            >
              {char}
            </span>
          ))}
        </div>
        {typed < sampleText.length && (
          <span className="mt-1 inline-block h-2.5 w-0.5 animate-pulse bg-green-400" />
        )}
      </div>
    </div>
  );
}
