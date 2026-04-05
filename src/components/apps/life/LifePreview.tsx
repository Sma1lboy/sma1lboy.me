import { useEffect, useRef } from "react";

const CELL = 4;
const GAP = 1;
const STEP = CELL + GAP;
const COLS = 40;
const ROWS = 24;

type Grid = boolean[][];

function createGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false));
}

function nextGen(grid: Grid): Grid {
  const next = createGrid();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc]) n++;
        }
      }
      if (grid[r][c]) {
        next[r][c] = n === 2 || n === 3;
      } else {
        next[r][c] = n === 3;
      }
    }
  }
  return next;
}

// Place a glider + a few cells to keep things interesting
function seedGrid(): Grid {
  const grid = createGrid();
  // Glider at top-left area
  const glider = [
    [2, 3], [3, 4], [4, 2], [4, 3], [4, 4],
  ];
  // R-pentomino in the center (produces long-lived chaotic behavior)
  const rpent = [
    [10, 20], [10, 21], [11, 19], [11, 20], [12, 20],
  ];
  for (const [r, c] of [...glider, ...rpent]) {
    if (r < ROWS && c < COLS) grid[r][c] = true;
  }
  return grid;
}

export default function LifePreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>(seedGrid());
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = COLS * STEP + GAP;
    canvas.height = ROWS * STEP + GAP;

    let genCount = 0;

    const draw = () => {
      const g = gridRef.current;
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#f0c040";
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (g[r][c]) {
            ctx.fillRect(c * STEP + GAP, r * STEP + GAP, CELL, CELL);
          }
        }
      }
    };

    const tick = () => {
      gridRef.current = nextGen(gridRef.current);
      genCount++;
      // Reset if everything dies or after a long run
      let alive = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (gridRef.current[r][c]) alive++;
        }
      }
      if (alive === 0 || genCount > 500) {
        gridRef.current = seedGrid();
        genCount = 0;
      }
      draw();
    };

    draw();
    const interval = setInterval(tick, 120);
    return () => {
      clearInterval(interval);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded"
        style={{ width: COLS * STEP + GAP, height: ROWS * STEP + GAP }}
      />
    </div>
  );
}
