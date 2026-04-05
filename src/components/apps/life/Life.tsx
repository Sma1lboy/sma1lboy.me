import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Pause, Play, SkipForward, Trash2, Shuffle } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const CELL_SIZE = 14;
const GRID_LINE = 1;
const STEP = CELL_SIZE + GRID_LINE;

type Grid = boolean[][];

function createEmptyGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
}

function countNeighbors(grid: Grid, r: number, c: number): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc]) {
        count++;
      }
    }
  }
  return count;
}

function nextGeneration(grid: Grid): Grid {
  const rows = grid.length;
  const cols = grid[0].length;
  const next = createEmptyGrid(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const n = countNeighbors(grid, r, c);
      if (grid[r][c]) {
        next[r][c] = n === 2 || n === 3;
      } else {
        next[r][c] = n === 3;
      }
    }
  }
  return next;
}

function randomFill(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < 0.3),
  );
}

// Preset patterns (relative cell coordinates)
const PRESETS: Record<string, { name: string; cells: [number, number][] }> = {
  glider: {
    name: "Glider",
    cells: [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  pulsar: {
    name: "Pulsar",
    cells: [
      // Top-left quadrant pattern (symmetric across both axes)
      ...((): [number, number][] => {
        const quarter: [number, number][] = [
          [1, 2], [1, 3], [1, 4],
          [2, 1], [3, 1], [4, 1],
          [6, 2], [6, 3], [6, 4],
          [4, 6], [3, 6], [2, 6],
          [1, 8], [1, 9], [1, 10],
          [2, 11], [3, 11], [4, 11],
          [6, 8], [6, 9], [6, 10],
          [4, 6], [3, 6], [2, 6],
          [8, 2], [8, 3], [8, 4],
          [9, 1], [10, 1], [11, 1],
          [8, 8], [8, 9], [8, 10],
          [9, 11], [10, 11], [11, 11],
          [11, 2], [11, 3], [11, 4],
          [9, 6], [10, 6], [11, 6],
          [11, 8], [11, 9], [11, 10],
          [2, 6], [3, 6], [4, 6],
          [9, 6], [10, 6], [11, 6],
        ];
        // Deduplicate
        const set = new Set(quarter.map(([r, c]) => `${r},${c}`));
        return [...set].map((s) => {
          const [r, c] = s.split(",").map(Number);
          return [r, c] as [number, number];
        });
      })(),
    ],
  },
  gliderGun: {
    name: "Gosper Glider Gun",
    cells: [
      [1, 25],
      [2, 23], [2, 25],
      [3, 13], [3, 14], [3, 21], [3, 22], [3, 35], [3, 36],
      [4, 12], [4, 16], [4, 21], [4, 22], [4, 35], [4, 36],
      [5, 1], [5, 2], [5, 11], [5, 17], [5, 21], [5, 22],
      [6, 1], [6, 2], [6, 11], [6, 15], [6, 17], [6, 18], [6, 23], [6, 25],
      [7, 11], [7, 17], [7, 25],
      [8, 12], [8, 16],
      [9, 13], [9, 14],
    ],
  },
};

function placePreset(
  rows: number,
  cols: number,
  cells: [number, number][],
): Grid {
  const grid = createEmptyGrid(rows, cols);
  // Find bounding box of pattern
  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  for (const [r, c] of cells) {
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, c);
    maxC = Math.max(maxC, c);
  }
  const patH = maxR - minR + 1;
  const patW = maxC - minC + 1;
  const offsetR = Math.floor((rows - patH) / 2) - minR;
  const offsetC = Math.floor((cols - patW) / 2) - minC;
  for (const [r, c] of cells) {
    const nr = r + offsetR;
    const nc = c + offsetC;
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
      grid[nr][nc] = true;
    }
  }
  return grid;
}

function useGridDimensions() {
  const [dims, setDims] = useState({ rows: 40, cols: 60 });

  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Leave room for controls at bottom (~140px) and back button at top (~40px)
      const availH = h - 180;
      const availW = w - 32; // 16px padding each side
      const cols = Math.max(10, Math.floor(availW / STEP));
      const rows = Math.max(10, Math.floor(availH / STEP));
      setDims({ rows, cols });
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return dims;
}

export default function Life() {
  useSEO({
    title: "Game of Life",
    description:
      "Conway's Game of Life — cellular automaton with presets, canvas rendering, and interactive controls.",
    path: "/apps/life",
  });

  const { rows, cols } = useGridDimensions();
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid(rows, cols));
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(10); // generations per second
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef(grid);
  const runningRef = useRef(running);
  const speedRef = useRef(speed);
  const paintingRef = useRef(false);
  const paintValueRef = useRef(true);

  // Sync refs
  gridRef.current = grid;
  runningRef.current = running;
  speedRef.current = speed;

  // Resize grid when dimensions change
  useEffect(() => {
    setGrid((prev) => {
      const newGrid = createEmptyGrid(rows, cols);
      // Copy over existing cells
      for (let r = 0; r < Math.min(prev.length, rows); r++) {
        for (let c = 0; c < Math.min(prev[0]?.length ?? 0, cols); c++) {
          newGrid[r][c] = prev[r][c];
        }
      }
      return newGrid;
    });
  }, [rows, cols]);

  // Draw grid on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = gridRef.current;
    const r = g.length;
    const c = g[0]?.length ?? 0;

    canvas.width = c * STEP + GRID_LINE;
    canvas.height = r * STEP + GRID_LINE;

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.fillStyle = "#1a1a1a";
    for (let i = 0; i <= c; i++) {
      ctx.fillRect(i * STEP, 0, GRID_LINE, canvas.height);
    }
    for (let i = 0; i <= r; i++) {
      ctx.fillRect(0, i * STEP, canvas.width, GRID_LINE);
    }

    // Cells
    ctx.fillStyle = "#f0c040";
    for (let row = 0; row < r; row++) {
      for (let col = 0; col < c; col++) {
        if (g[row][col]) {
          ctx.fillRect(
            col * STEP + GRID_LINE,
            row * STEP + GRID_LINE,
            CELL_SIZE,
            CELL_SIZE,
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    draw();
  }, [grid, draw]);

  // Simulation loop
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      setGrid((prev) => nextGeneration(prev));
      setGeneration((g) => g + 1);
    };
    const interval = setInterval(tick, 1000 / speedRef.current);
    return () => clearInterval(interval);
  }, [running, speed]);

  // Mouse interactions
  const getCellFromEvent = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      const col = Math.floor(x / STEP);
      const row = Math.floor(y / STEP);
      if (row >= 0 && row < gridRef.current.length && col >= 0 && col < (gridRef.current[0]?.length ?? 0)) {
        return { row, col };
      }
      return null;
    },
    [],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cell = getCellFromEvent(e);
      if (!cell) return;
      paintingRef.current = true;
      paintValueRef.current = !gridRef.current[cell.row][cell.col];
      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        next[cell.row][cell.col] = paintValueRef.current;
        return next;
      });
    },
    [getCellFromEvent],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!paintingRef.current) return;
      const cell = getCellFromEvent(e);
      if (!cell) return;
      setGrid((prev) => {
        if (prev[cell.row][cell.col] === paintValueRef.current) return prev;
        const next = prev.map((r) => [...r]);
        next[cell.row][cell.col] = paintValueRef.current;
        return next;
      });
    },
    [getCellFromEvent],
  );

  const handleMouseUp = useCallback(() => {
    paintingRef.current = false;
  }, []);

  const handleClear = () => {
    setRunning(false);
    setGrid(createEmptyGrid(rows, cols));
    setGeneration(0);
  };

  const handleRandom = () => {
    setGrid(randomFill(rows, cols));
    setGeneration(0);
  };

  const handleStep = () => {
    setGrid((prev) => nextGeneration(prev));
    setGeneration((g) => g + 1);
  };

  const handlePreset = (key: string) => {
    const preset = PRESETS[key];
    if (!preset) return;
    setRunning(false);
    setGrid(placePreset(rows, cols, preset.cells));
    setGeneration(0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white dark:bg-black">
      {/* Back link */}
      <div className="fixed left-6 top-6 z-10">
        <Link
          to="/apps"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* Canvas */}
      <div className="mt-12 flex flex-1 items-center justify-center px-4">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair rounded-lg"
          style={{ maxWidth: "100%", maxHeight: "calc(100vh - 180px)" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Controls */}
      <div className="w-full border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-black">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={() => setRunning(!running)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white transition-colors hover:bg-amber-600 dark:bg-amber-400 dark:text-gray-900 dark:hover:bg-amber-300"
            aria-label={running ? "Pause" : "Play"}
          >
            {running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          {/* Step */}
          <button
            onClick={handleStep}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
            aria-label="Step"
            title="Step"
          >
            <SkipForward size={18} />
          </button>

          {/* Clear */}
          <button
            onClick={handleClear}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
            aria-label="Clear"
            title="Clear"
          >
            <Trash2 size={18} />
          </button>

          {/* Random */}
          <button
            onClick={handleRandom}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
            aria-label="Random"
            title="Random"
          >
            <Shuffle size={18} />
          </button>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-800" />

          {/* Presets */}
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900"
            >
              {preset.name}
            </button>
          ))}

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-800" />

          {/* Speed slider */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Speed</span>
            <input
              type="range"
              min={1}
              max={30}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-gray-200 accent-amber-500 dark:bg-gray-700 dark:accent-amber-400"
            />
          </div>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-gray-800" />

          {/* Generation counter */}
          <span className="font-mono text-xs tabular-nums text-gray-500 dark:text-gray-400">
            Gen {generation}
          </span>
        </div>
      </div>
    </div>
  );
}
