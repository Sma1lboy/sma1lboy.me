import { useEffect, useState } from "react";

const UNITS = [
  { from: "1 km", to: "0.621 mi" },
  { from: "1 kg", to: "2.205 lb" },
  { from: "100 °C", to: "212 °F" },
  { from: "1 GB", to: "1024 MB" },
  { from: "1 L", to: "0.264 gal" },
  { from: "1 m", to: "3.281 ft" },
];

export default function UnitsPreview() {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % UNITS.length);
        setShow(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const pair = UNITS[index];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div
        className="transition-all duration-300"
        style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(4px)" }}
      >
        <div className="text-center font-mono text-lg font-bold text-blue-400">{pair.from}</div>
        <div className="my-1 text-center text-xs text-gray-500">=</div>
        <div className="text-center font-mono text-lg font-bold text-emerald-400">{pair.to}</div>
      </div>
      <div className="flex gap-1">
        {UNITS.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-1.5 rounded-full transition-colors duration-300 ${
              i === index ? "bg-blue-400" : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
