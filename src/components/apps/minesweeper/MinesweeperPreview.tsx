import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const CELL = 12;
const COLS = 9;
const ROWS = 9;

const MINE_POSITIONS = [
  [1, 2],
  [3, 0],
  [5, 4],
  [7, 1],
  [0, 6],
  [4, 7],
  [6, 5],
  [2, 8],
  [8, 3],
  [3, 5],
];

const NUMBER_COLORS: Record<number, string> = {
  1: "rgba(96, 165, 250, 0.9)",
  2: "rgba(74, 222, 128, 0.9)",
  3: "rgba(248, 113, 113, 0.9)",
  4: "rgba(129, 140, 248, 0.9)",
  5: "rgba(251, 146, 60, 0.9)",
};

export default function MinesweeperPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const mineSet = new Set(MINE_POSITIONS.map(([r, c]) => `${r},${c}`));

    const getAdjacentCount = (row: number, col: number): number => {
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (mineSet.has(`${row + dr},${col + dc}`)) count++;
        }
      }
      return count;
    };

    const offsetX = (W - COLS * CELL) / 2;
    const offsetY = (H - ROWS * CELL) / 2;

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("MINESWEEPER", 12, 12);

      const revealCount = Math.min(Math.floor(frame / 3), COLS * ROWS);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x = offsetX + c * CELL;
          const y = offsetY + r * CELL;
          const idx = r * COLS + c;

          if (idx < revealCount) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
            ctx.fillRect(x, y, CELL - 1, CELL - 1);

            if (mineSet.has(`${r},${c}`)) {
              ctx.fillStyle = "rgba(248, 113, 113, 0.8)";
              ctx.beginPath();
              ctx.arc(x + CELL / 2, y + CELL / 2, 3, 0, Math.PI * 2);
              ctx.fill();
            } else {
              const n = getAdjacentCount(r, c);
              if (n > 0) {
                ctx.font = "bold 8px monospace";
                ctx.fillStyle = NUMBER_COLORS[n] || "rgba(255,255,255,0.5)";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(String(n), x + CELL / 2, y + CELL / 2 + 1);
                ctx.textAlign = "start";
                ctx.textBaseline = "alphabetic";
              }
            }
          } else {
            const pulse = 0.08 + Math.sin(frame * 0.03 + r * 0.5 + c * 0.5) * 0.04;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
            ctx.fillRect(x, y, CELL - 1, CELL - 1);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x + 0.5, y + 0.5, CELL - 2, CELL - 2);
          }
        }
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(248, 113, 113, 0.5)";
      ctx.fillText("10 mines", 12, H - 8);

      frame = (frame + 1) % 300;
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="rounded" style={{ width: W, height: H }} />
    </div>
  );
}
