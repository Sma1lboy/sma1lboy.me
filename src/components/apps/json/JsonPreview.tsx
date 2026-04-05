import { useEffect, useRef } from "react";

const W = 200;
const H = 120;
const LINE_H = 6;
const GAP = 2;
const STEP = LINE_H + GAP;
const TOTAL_LINES = Math.floor(H / STEP) * 2;

interface FakeJsonLine {
  indent: number;
  type:
    | "key-string"
    | "key-number"
    | "key-bool"
    | "bracket-open"
    | "bracket-close"
    | "array-open"
    | "array-close";
  keyWidth: number;
  valueWidth: number;
}

function generateLines(): FakeJsonLine[] {
  const lines: FakeJsonLine[] = [];
  let indent = 0;
  for (let i = 0; i < TOTAL_LINES; i++) {
    const r = Math.random();
    if (r < 0.12 && indent < 3) {
      lines.push({
        indent,
        type: "bracket-open",
        keyWidth: 30 + Math.random() * 40,
        valueWidth: 0,
      });
      indent++;
    } else if (r < 0.2 && indent < 3) {
      lines.push({ indent, type: "array-open", keyWidth: 25 + Math.random() * 35, valueWidth: 0 });
      indent++;
    } else if (r < 0.3 && indent > 0) {
      indent--;
      lines.push({
        indent,
        type: Math.random() > 0.5 ? "bracket-close" : "array-close",
        keyWidth: 0,
        valueWidth: 0,
      });
    } else if (r < 0.55) {
      lines.push({
        indent,
        type: "key-string",
        keyWidth: 20 + Math.random() * 30,
        valueWidth: 25 + Math.random() * 50,
      });
    } else if (r < 0.8) {
      lines.push({
        indent,
        type: "key-number",
        keyWidth: 20 + Math.random() * 30,
        valueWidth: 15 + Math.random() * 25,
      });
    } else {
      lines.push({
        indent,
        type: "key-bool",
        keyWidth: 20 + Math.random() * 30,
        valueWidth: 18 + Math.random() * 15,
      });
    }
  }
  return lines;
}

export default function JsonPreview() {
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
    const visibleLines = Math.floor(H / STEP) + 2;

    const colors = {
      key: "rgba(168, 130, 220, 0.7)",
      string: "rgba(34, 197, 94, 0.7)",
      number: "rgba(96, 165, 250, 0.7)",
      bool: "rgba(251, 146, 60, 0.7)",
      bracket: "rgba(250, 204, 21, 0.6)",
      gutter: "rgba(75, 85, 99, 0.15)",
      lineNum: "rgba(107, 114, 128, 0.35)",
    };

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Gutter
      ctx.fillStyle = colors.gutter;
      ctx.fillRect(0, 0, 18, H);

      for (let i = 0; i < visibleLines; i++) {
        const lineIdx = Math.floor(offset / STEP) + i;
        if (lineIdx < 0 || lineIdx >= lines.length) continue;
        const line = lines[lineIdx];
        const y = i * STEP - (offset % STEP);
        if (y < -STEP || y > H) continue;

        const indentPx = line.indent * 10;
        const x0 = 22 + indentPx;

        // Line number
        ctx.fillStyle = colors.lineNum;
        ctx.fillRect(3, y + 1, 11, LINE_H - 2);

        if (line.type === "bracket-open" || line.type === "array-open") {
          // Key before bracket
          if (line.keyWidth > 0) {
            ctx.fillStyle = colors.key;
            ctx.fillRect(x0, y + 1, line.keyWidth, LINE_H - 2);
          }
          // Bracket
          ctx.fillStyle = colors.bracket;
          const bx = x0 + (line.keyWidth > 0 ? line.keyWidth + 4 : 0);
          ctx.fillRect(bx, y + 1, 5, LINE_H - 2);
        } else if (line.type === "bracket-close" || line.type === "array-close") {
          ctx.fillStyle = colors.bracket;
          ctx.fillRect(x0, y + 1, 5, LINE_H - 2);
        } else {
          // Key
          ctx.fillStyle = colors.key;
          ctx.fillRect(x0, y + 1, line.keyWidth, LINE_H - 2);

          // Colon
          ctx.fillStyle = "rgba(156, 163, 175, 0.4)";
          ctx.fillRect(x0 + line.keyWidth + 2, y + 1, 2, LINE_H - 2);

          // Value
          const valueColor =
            line.type === "key-string"
              ? colors.string
              : line.type === "key-number"
                ? colors.number
                : colors.bool;
          ctx.fillStyle = valueColor;
          ctx.fillRect(x0 + line.keyWidth + 8, y + 1, line.valueWidth, LINE_H - 2);
        }
      }
    };

    const tick = () => {
      offset += 0.4;
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
