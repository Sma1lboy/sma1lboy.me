import { useEffect, useRef } from "react";

const W = 200;
const H = 120;
const CELL = 8;
const COLS = 10;
const ROWS = 12;

const COLORS: Record<string, string> = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

const PREVIEW_BOARD: (string | null)[][] = [
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, "T", null, null, null, null, null],
  [null, null, null, "T", "T", "T", null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null, null],
  ["J", null, null, null, null, null, null, null, "L", "L"],
  ["J", "J", null, null, "S", "S", null, null, null, "L"],
  ["Z", "J", "O", "O", "I", "S", "S", null, null, "L"],
  ["Z", "Z", "O", "O", "I", "I", "I", null, "T", "T"],
];

export default function TetrisPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("TETRIS", 12, 12);

      const boardW = COLS * CELL;
      const boardH = ROWS * CELL;
      const offsetX = (W - boardW) / 2;
      const offsetY = (H - boardH) / 2;

      // Board background
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(offsetX, offsetY, boardW, boardH);

      const revealCount = Math.min(Math.floor(frame / 3), COLS * ROWS);

      for (let r = ROWS - 1; r >= 0; r--) {
        for (let c = 0; c < COLS; c++) {
          const idx = (ROWS - 1 - r) * COLS + c;
          const type = PREVIEW_BOARD[r][c];
          const x = offsetX + c * CELL;
          const y = offsetY + r * CELL;

          if (idx < revealCount && type) {
            ctx.fillStyle = COLORS[type];
            ctx.globalAlpha = 0.9;
            ctx.fillRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(x + 0.5, y + 0.5, CELL - 1, 2);
            ctx.globalAlpha = 1;
          } else if (!type) {
            const pulse =
              0.03 +
              Math.sin(frame * 0.02 + r * 0.4 + c * 0.3) * 0.02;
            ctx.fillStyle = `rgba(255,255,255,${pulse})`;
            ctx.fillRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
          }
        }
      }

      // Score text
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(0, 240, 240, 0.5)";
      ctx.fillText("Score: 2400", 12, H - 8);

      frame = (frame + 1) % 300;
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
