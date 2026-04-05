import { useEffect, useState } from "react";

const OCTETS = [
  [192, 168, 1, 42],
  [10, 0, 0, 1],
  [172, 16, 0, 100],
  [8, 8, 8, 8],
  [127, 0, 0, 1],
];

export default function NetworkPreview() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % OCTETS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const ip = OCTETS[idx];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4">
      {/* IP octets */}
      <div className="flex items-center gap-0.5">
        {ip.map((octet, i) => (
          <span key={i} className="flex items-center">
            <span className="rounded bg-gray-800 px-1.5 py-1 font-mono text-sm font-semibold text-cyan-400 transition-all duration-500">
              {octet}
            </span>
            {i < 3 && <span className="px-0.5 font-mono text-xs text-gray-600">.</span>}
          </span>
        ))}
      </div>
      {/* Label */}
      <span className="text-[9px] font-medium tracking-wider text-gray-500 uppercase">
        Network Info
      </span>
      {/* Signal bars */}
      <div className="flex items-end gap-0.5">
        {[0, 1, 2, 3].map((j) => (
          <div
            key={j}
            className="w-1 rounded-full bg-cyan-400/60"
            style={{
              height: `${6 + j * 4}px`,
              animation: `netPulse 2s ease-in-out ${j * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes netPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
