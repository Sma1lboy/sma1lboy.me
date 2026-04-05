import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&*";

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function PasswordPreview() {
  const [chars, setChars] = useState(() =>
    Array.from({ length: 16 }, randomChar),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setChars((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * next.length);
        next[idx] = randomChar();
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <div className="flex gap-[2px]">
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block w-[9px] text-center font-mono text-[13px] tabular-nums"
            style={{
              color:
                /[A-Z]/.test(ch)
                  ? "#60a5fa"
                  : /[a-z]/.test(ch)
                    ? "#a5b4fc"
                    : /[0-9]/.test(ch)
                      ? "#34d399"
                      : "#f472b6",
            }}
          >
            {ch}
          </span>
        ))}
      </div>
      <div className="flex gap-1">
        <div className="h-1 w-5 rounded-full bg-emerald-400/70" />
        <div className="h-1 w-5 rounded-full bg-emerald-400/70" />
        <div className="h-1 w-5 rounded-full bg-emerald-400/70" />
        <div className="h-1 w-5 rounded-full bg-emerald-400/50" />
      </div>
    </div>
  );
}
