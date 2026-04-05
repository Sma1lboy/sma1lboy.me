import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const GRID_SIZE = 4;
const CELL = 24;
const GAP = 3;
const BOARD_SIZE = GRID_SIZE * CELL + (GRID_SIZE + 1) * GAP;

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "#eee4da", text: "#776e65" },
  4: { bg: "#ede0c8", text: "#776e65" },
  8: { bg: "#f2b179", text: "#f9f6f2" },
  16: { bg: "#f59563", text: "#f9f6f2" },
  32: { bg: "#f67c5f", text: "#f9f6f2" },
  64: { bg: "#f65e3b", text: "#f9f6f2" },
  128: { bg: "#edcf72", text: "#f9f6f2" },
  256: { bg: "#edcc61", text: "#f9f6f2" },
  512: { bg: "#edc850", text: "#f9f6f2" },
  1024: { bg: "#edc53f", text: "#f9f6f2" },
  2048: { bg: "#edc22e", text: "#f9f6f2" },
};

const PREVIEW_GRID = [
  [0, 2, 4, 0],
  [8, 16, 0, 2],
  [32, 0, 128, 4],
  [0, 64, 8, 256],
];

export default function Game2048Preview() {
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
      ctx.fillText("2048", 12, 12);

      const offsetX = (W - BOARD_SIZE) / 2;
      const offsetY = (H - BOARD_SIZE) / 2;

      // Board background
      ctx.fillStyle = "rgba(187, 173, 160, 0.3)";
      const r = 4;
      ctx.beginPath();
      ctx.roundRect(offsetX, offsetY, BOARD_SIZE, BOARD_SIZE, r);
      ctx.fill();

      const revealCount = Math.min(Math.floor(frame / 4), GRID_SIZE * GRID_SIZE);

      for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
          const x = offsetX + GAP + col * (CELL + GAP);
          const y = offsetY + GAP + row * (CELL + GAP);
          const idx = row * GRID_SIZE + col;
          const val = PREVIEW_GRID[row][col];

          if (idx < revealCount && val > 0) {
            const colors = TILE_COLORS[val] || TILE_COLORS[2048];
            ctx.fillStyle = colors.bg;
            ctx.beginPath();
            ctx.roundRect(x, y, CELL, CELL, 2);
            ctx.fill();

            ctx.font = `bold ${val >= 100 ? 6 : 9}px sans-serif`;
            ctx.fillStyle = colors.text;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(String(val), x + CELL / 2, y + CELL / 2 + 0.5);
            ctx.textAlign = "start";
            ctx.textBaseline = "alphabetic";
          } else {
            const pulse = 0.06 + Math.sin(frame * 0.03 + row * 0.5 + col * 0.5) * 0.03;
            ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
            ctx.beginPath();
            ctx.roundRect(x, y, CELL, CELL, 2);
            ctx.fill();
          }
        }
      }

      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(237, 197, 63, 0.5)";
      ctx.fillText("Score: 1280", 12, H - 8);

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
