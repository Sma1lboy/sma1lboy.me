import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const SPRITE = [
  "..0000..",
  ".000000.",
  "0.0000.0",
  "00000000",
  ".0.00.0.",
  "0.0000.0",
  "0.0..0.0",
  "..00..00",
];

const PALETTE = [
  "rgba(167, 139, 250, 0.9)", // purple
  "rgba(52, 211, 153, 0.9)", // green
  "rgba(251, 191, 36, 0.9)", // amber
  "rgba(248, 113, 113, 0.9)", // red
];

export default function PixelPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const rows = SPRITE.length;
    const cols = SPRITE[0].length;
    const cellSize = 8;
    const offsetX = (W - cols * cellSize) / 2;
    const offsetY = (H - rows * cellSize) / 2;

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("PIXEL ART", 12, 12);

      const colorIdx = Math.floor(frame / 60) % PALETTE.length;
      const color = PALETTE[colorIdx];

      // Draw grid background
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = offsetX + c * cellSize;
          const y = offsetY + r * cellSize;
          ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        }
      }

      // Animate drawing the sprite pixel by pixel
      const totalPixels = rows * cols;
      const revealCount = Math.min(
        Math.floor((frame % 80) * 1.5),
        totalPixels,
      );

      for (let i = 0; i < revealCount; i++) {
        const r = Math.floor(i / cols);
        const c = i % cols;
        if (SPRITE[r][c] === "0") {
          const x = offsetX + c * cellSize;
          const y = offsetY + r * cellSize;
          const pulse =
            0.7 + Math.sin(frame * 0.05 + r * 0.3 + c * 0.3) * 0.3;
          ctx.globalAlpha = pulse;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        }
      }
      ctx.globalAlpha = 1;

      // Cursor animation
      const cursorPixel = revealCount % totalPixels;
      const cursorR = Math.floor(cursorPixel / cols);
      const cursorC = cursorPixel % cols;
      const cx = offsetX + cursorC * cellSize;
      const cy = offsetY + cursorR * cellSize;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(cx, cy, cellSize - 1, cellSize - 1);

      // Bottom text
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(167, 139, 250, 0.5)";
      ctx.fillText("16x16 canvas", 12, H - 8);

      frame++;
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded"
        style={{ width: W, height: H }}
      />
    </div>
  );
}
