import { useEffect, useState } from "react";

const bubbles = [
  { role: "user", text: "Who are you?" },
  { role: "bot", text: "I'm sma1lbot! 👋" },
  { role: "user", text: "Projects?" },
  { role: "bot", text: "Codefox, Pochi..." },
];

export default function ChatPreview() {
  const [visible, setVisible] = useState(0);
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => {
        if (prev >= bubbles.length) {
          setTimeout(() => {
            setVisible(0);
            setShowDots(false);
          }, 1000);
          return prev;
        }

        const next = prev + 1;
        // Show typing dots before bot messages
        if (next < bubbles.length && bubbles[next].role === "bot") {
          setShowDots(true);
          setTimeout(() => setShowDots(false), 400);
        }
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="w-full max-w-[180px] space-y-1.5">
        {bubbles.slice(0, visible).map((b, i) => (
          <div key={i} className={`flex ${b.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-lg px-2.5 py-1 text-[9px] leading-tight ${
                b.role === "user" ? "bg-gray-700 text-gray-200" : "bg-indigo-900/60 text-indigo-200"
              }`}
            >
              {b.text}
            </div>
          </div>
        ))}
        {showDots && (
          <div className="flex justify-start">
            <div className="flex gap-0.5 rounded-lg bg-indigo-900/60 px-2.5 py-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-1 w-1 animate-pulse rounded-full bg-indigo-300"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
