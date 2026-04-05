import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Paintbrush,
  Eraser,
  PaintBucket,
  Pipette,
  Undo2,
  Redo2,
  Grid3X3,
  Trash2,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

type Tool = "brush" | "eraser" | "fill" | "eyedropper";
type GridSize = 16 | 32;

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff8800",
  "#8800ff",
  "#00ff88",
  "#ff0088",
  "#888888",
  "#444444",
  "#cc4444",
  "#4488cc",
];

const TRANSPARENT = "transparent";

function floodFill(
  grid: string[][],
  row: number,
  col: number,
  newColor: string,
  rows: number,
  cols: number,
): string[][] {
  const target = grid[row][col];
  if (target === newColor) return grid;

  const result = grid.map((r) => [...r]);
  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (result[r][c] !== target) continue;

    result[r][c] = newColor;
    stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
  }

  return result;
}

export default function PixelEditor() {
  useSEO({
    title: "Pixel Art Editor",
    description:
      "Draw pixel art on a canvas grid with brushes, fill tool, and color picker. Export as PNG.",
    path: "/apps/pixel",
  });

  const [gridSize, setGridSize] = useState<GridSize>(16);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState<Tool>("brush");
  const [grid, setGrid] = useState<string[][]>(() =>
    Array.from({ length: 16 }, () => Array(16).fill(TRANSPARENT)),
  );
  const [history, setHistory] = useState<string[][][]>([]);
  const [redoStack, setRedoStack] = useState<string[][][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastCellRef = useRef<{ r: number; c: number } | null>(null);

  // Reset grid when size changes
  useEffect(() => {
    const newGrid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(TRANSPARENT),
    );
    setGrid(newGrid);
    setHistory([]);
    setRedoStack([]);
  }, [gridSize]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const cellSize = size / gridSize;

    // Checkerboard background for transparency
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const x = c * cellSize;
        const y = r * cellSize;

        // Checkerboard
        const isLight = (r + c) % 2 === 0;
        ctx.fillStyle = isLight ? "#e5e7eb" : "#d1d5db";
        ctx.fillRect(x, y, cellSize, cellSize);

        // Pixel color
        if (grid[r] && grid[r][c] && grid[r][c] !== TRANSPARENT) {
          ctx.fillStyle = grid[r][c];
          ctx.fillRect(x, y, cellSize, cellSize);
        }

        // Grid lines
        if (showGrid) {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
    }
  }, [grid, gridSize, showGrid]);

  const pushHistory = useCallback(
    (current: string[][]) => {
      setHistory((prev) => [...prev.slice(-50), current]);
      setRedoStack([]);
    },
    [],
  );

  const getCellFromEvent = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cellSize = rect.width / gridSize;
      const c = Math.floor(x / cellSize);
      const r = Math.floor(y / cellSize);

      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return null;
      return { r, c };
    },
    [gridSize],
  );

  const applyTool = useCallback(
    (r: number, c: number, currentGrid: string[][]) => {
      if (tool === "eyedropper") {
        const pixelColor = currentGrid[r][c];
        if (pixelColor !== TRANSPARENT) {
          setColor(pixelColor);
        }
        setTool("brush");
        return currentGrid;
      }

      if (tool === "fill") {
        return floodFill(currentGrid, r, c, color, gridSize, gridSize);
      }

      const newGrid = currentGrid.map((row) => [...row]);
      newGrid[r][c] = tool === "eraser" ? TRANSPARENT : color;
      return newGrid;
    },
    [tool, color, gridSize],
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const cell = getCellFromEvent(e);
      if (!cell) return;

      setIsDrawing(true);
      lastCellRef.current = cell;
      pushHistory(grid);

      const newGrid = applyTool(cell.r, cell.c, grid);
      setGrid(newGrid);
    },
    [getCellFromEvent, grid, applyTool, pushHistory],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      if (tool === "fill" || tool === "eyedropper") return;
      e.preventDefault();

      const cell = getCellFromEvent(e);
      if (!cell) return;
      if (
        lastCellRef.current &&
        lastCellRef.current.r === cell.r &&
        lastCellRef.current.c === cell.c
      )
        return;

      lastCellRef.current = cell;
      setGrid((prev) => {
        const newGrid = prev.map((row) => [...row]);
        newGrid[cell.r][cell.c] = tool === "eraser" ? TRANSPARENT : color;
        return newGrid;
      });
    },
    [isDrawing, tool, color, getCellFromEvent],
  );

  const handlePointerUp = useCallback(() => {
    setIsDrawing(false);
    lastCellRef.current = null;
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [...r, grid]);
    setGrid(prev);
  }, [history, grid]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setHistory((h) => [...h, grid]);
    setGrid(next);
  }, [redoStack, grid]);

  const clearCanvas = useCallback(() => {
    pushHistory(grid);
    setGrid(
      Array.from({ length: gridSize }, () => Array(gridSize).fill(TRANSPARENT)),
    );
  }, [grid, gridSize, pushHistory]);

  const exportPNG = useCallback(() => {
    const exportCanvas = document.createElement("canvas");
    const scale = 16;
    exportCanvas.width = gridSize * scale;
    exportCanvas.height = gridSize * scale;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] !== TRANSPARENT) {
          ctx.fillStyle = grid[r][c];
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }

    const link = document.createElement("a");
    link.download = `pixel-art-${gridSize}x${gridSize}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  }, [grid, gridSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const tools: { id: Tool; icon: typeof Paintbrush; label: string }[] = [
    { id: "brush", icon: Paintbrush, label: "Brush" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "fill", icon: PaintBucket, label: "Fill" },
    { id: "eyedropper", icon: Pipette, label: "Eyedropper" },
  ];

  const canvasPixelSize = 512;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/apps"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back to Apps
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Pixel Art Editor
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Draw pixel art on a {gridSize}x{gridSize} canvas. Click and drag to
            paint.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-6 lg:flex-row"
        >
          {/* Tools Panel */}
          <div className="flex flex-row gap-4 lg:w-56 lg:flex-col">
            {/* Tool buttons */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Tools
              </p>
              <div className="grid grid-cols-4 gap-1.5 lg:grid-cols-2">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    title={t.label}
                    className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                      tool === t.id
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    <t.icon size={18} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color palette */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Colors
              </p>
              <div className="grid grid-cols-8 gap-1 lg:grid-cols-4">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      if (tool === "eraser" || tool === "eyedropper")
                        setTool("brush");
                    }}
                    className={`h-7 w-7 rounded-md border-2 transition-transform hover:scale-110 ${
                      color === c
                        ? "border-purple-500 ring-1 ring-purple-500"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    if (tool === "eraser" || tool === "eyedropper")
                      setTool("brush");
                  }}
                  className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent"
                />
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                  {color}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-1.5">
                  <button
                    onClick={undo}
                    disabled={history.length === 0}
                    title="Undo (Ctrl+Z)"
                    className="flex flex-1 items-center justify-center rounded-lg bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Undo2 size={16} />
                  </button>
                  <button
                    onClick={redo}
                    disabled={redoStack.length === 0}
                    title="Redo (Ctrl+Shift+Z)"
                    className="flex flex-1 items-center justify-center rounded-lg bg-white p-2 text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-30 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <Redo2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => setShowGrid((g) => !g)}
                  title="Toggle grid"
                  className={`flex items-center justify-center gap-1.5 rounded-lg p-2 text-sm transition-colors ${
                    showGrid
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Grid3X3 size={16} />
                  <span className="text-xs">Grid</span>
                </button>
                <button
                  onClick={clearCanvas}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-white p-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:bg-gray-900 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={16} />
                  <span className="text-xs">Clear</span>
                </button>
              </div>
            </div>

            {/* Grid size */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Canvas
              </p>
              <div className="flex gap-1.5">
                {([16, 32] as GridSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setGridSize(s)}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                      gridSize === s
                        ? "bg-purple-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {s}x{s}
                  </button>
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <button
                onClick={exportPNG}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
              >
                <Download size={16} />
                Export PNG
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex flex-1 items-start justify-center">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-950">
              <canvas
                ref={canvasRef}
                width={canvasPixelSize}
                height={canvasPixelSize}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className="max-w-full cursor-crosshair rounded-lg touch-none"
                style={{
                  width: "min(100%, 512px)",
                  height: "auto",
                  aspectRatio: "1 / 1",
                  imageRendering: "pixelated",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
