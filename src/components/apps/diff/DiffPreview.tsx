import { useEffect, useRef } from "react";

const W = 200;
const H = 120;
const LINE_H = 6;
const GAP = 2;
const STEP = LINE_H + GAP;
const LINES = Math.floor(H / STEP);

interface FakeLine {
  type: "add" | "del" | "same";
  width: number;
}

function generateLines(): FakeLine[] {
  const lines: FakeLine[] = [];
  for (let i = 0; i < LINES * 2; i++) {
    const r = Math.random();
    const type: FakeLine["type"] = r < 0.25 ? "add" : r < 0.45 ? "del" : "same";
    const width = 30 + Math.random() * 140;
    lines.push({ type, width });
  }
  return lines;
}

export default function DiffPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let lines = generateLines();
    let offset = 0;
    

    const colors = {
      add: "rgba(34, 197, 94, 0.4)",
      del: "rgba(239, 68, 68, 0.35)",
      same: "rgba(156, 163, 175, 0.18)",
    };

    const textColors = {
      add: "rgba(34, 197, 94, 0.7)",
      del: "rgba(239, 68, 68, 0.6)",
      same: "rgba(156, 163, 175, 0.3)",
    };

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Gutter
      ctx.fillStyle = "rgba(75, 85, 99, 0.15)";
      ctx.fillRect(0, 0, 20, H);

      for (let i = 0; i < LINES + 2; i++) {
        const lineIdx = Math.floor(offset / STEP) + i;
        if (lineIdx < 0 || lineIdx >= lines.length) continue;
        const line = lines[lineIdx];
        const y = i * STEP - (offset % STEP);
        if (y < -STEP || y > H) continue;

        // Background highlight
        if (line.type !== "same") {
          ctx.fillStyle = colors[line.type];
          ctx.fillRect(20, y, W - 20, LINE_H);
        }

        // Line number
        ctx.fillStyle = "rgba(107, 114, 128, 0.4)";
        ctx.fillRect(4, y + 1, 12, LINE_H - 2);

        // Prefix symbol
        ctx.fillStyle = textColors[line.type];
        ctx.fillRect(22, y + 1, 4, LINE_H - 2);

        // Fake code content
        ctx.fillStyle = textColors[line.type];
        const codeX = 30;
        const segments = 1 + Math.floor(Math.random() * 0.5 + line.width / 60);
        let sx = codeX;
        for (let s = 0; s < segments; s++) {
          const sw = Math.min(
            10 + ((line.width * (s + 1)) / segments) * 0.3,
            line.width - (sx - codeX),
          );
          if (sw <= 0) break;
          ctx.fillRect(sx, y + 1, sw, LINE_H - 2);
          sx += sw + 4;
        }
      }
    };

    const tick = () => {
      offset += 0.5;
      if (offset > lines.length * STEP - H) {
        lines = generateLines();
        offset = 0;
        
      }
      draw();
    };

    draw();
    const interval = setInterval(tick, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="rounded" style={{ width: W, height: H }} />
    </div>
  );
}
