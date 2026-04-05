import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const GRID = 10;

interface Cell {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  visited: boolean;
}

function generateMaze(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({
      top: true,
      right: true,
      bottom: true,
      left: true,
      visited: false,
    })),
  );

  const stack: [number, number][] = [];
  const directions: [number, number, keyof Cell, keyof Cell][] = [
    [-1, 0, "top", "bottom"],
    [1, 0, "bottom", "top"],
    [0, -1, "left", "right"],
    [0, 1, "right", "left"],
  ];

  function carve(row: number, col: number) {
    grid[row][col].visited = true;
    stack.push([row, col]);

    while (stack.length > 0) {
      const [r, c] = stack[stack.length - 1];
      const neighbors = directions
        .map(([dr, dc, wall, opposite]) => ({
          nr: r + dr,
          nc: c + dc,
          wall,
          opposite,
        }))
        .filter(
          ({ nr, nc }) =>
            nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && !grid[nr][nc].visited,
        );

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }

      const { nr, nc, wall, opposite } =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      (grid[r][c] as unknown as Record<string, boolean>)[wall] = false;
      (grid[nr][nc] as unknown as Record<string, boolean>)[opposite] = false;
      grid[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
  }

  carve(0, 0);
  return grid;
}

export function MazeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maze, setMaze] = useState<Cell[][]>(() => generateMaze());
  const [player, setPlayer] = useState<[number, number]>([0, 0]);
  const [won, setWon] = useState(false);
  const animRef = useRef<number>(0);
  const navigate = useNavigate();

  const resetGame = useCallback(() => {
    setMaze(generateMaze());
    setPlayer([0, 0]);
    setWon(false);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    if (won) return;

    const handleKey = (e: KeyboardEvent) => {
      let dr = 0;
      let dc = 0;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dr = -1;
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dr = 1;
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dc = -1;
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dc = 1;
      else return;

      e.preventDefault();

      setPlayer(([r, c]) => {
        const cell = maze[r][c];
        // Check wall in desired direction
        if (dr === -1 && cell.top) return [r, c];
        if (dr === 1 && cell.bottom) return [r, c];
        if (dc === -1 && cell.left) return [r, c];
        if (dc === 1 && cell.right) return [r, c];

        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) return [r, c];

        if (nr === GRID - 1 && nc === GRID - 1) {
          setWon(true);
        }
        return [nr, nc];
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [maze, won]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const draw = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const dpr = window.devicePixelRatio || 1;
      const displaySize = canvas.offsetWidth;
      canvas.width = displaySize * dpr;
      canvas.height = displaySize * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const pad = 12;
      const cs = (displaySize - pad * 2) / GRID;

      // Background
      ctx.fillStyle = isDark ? "#0a0a0a" : "#fafafa";
      ctx.fillRect(0, 0, displaySize, displaySize);

      // Border
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, displaySize, displaySize);

      // Draw walls
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";

      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const x = pad + c * cs;
          const y = pad + r * cs;
          const cell = maze[r][c];

          if (cell.top) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cs, y);
            ctx.stroke();
          }
          if (cell.right) {
            ctx.beginPath();
            ctx.moveTo(x + cs, y);
            ctx.lineTo(x + cs, y + cs);
            ctx.stroke();
          }
          if (cell.bottom) {
            ctx.beginPath();
            ctx.moveTo(x, y + cs);
            ctx.lineTo(x + cs, y + cs);
            ctx.stroke();
          }
          if (cell.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cs);
            ctx.stroke();
          }
        }
      }

      // Draw exit (glowing portal at bottom-right)
      const exitX = pad + (GRID - 1) * cs + cs / 2;
      const exitY = pad + (GRID - 1) * cs + cs / 2;
      const exitRadius = cs * 0.28;

      // Outer glow
      const exitGlow = ctx.createRadialGradient(
        exitX,
        exitY,
        0,
        exitX,
        exitY,
        exitRadius * 3,
      );
      exitGlow.addColorStop(0, isDark ? "rgba(74,222,128,0.4)" : "rgba(22,163,74,0.3)");
      exitGlow.addColorStop(1, "transparent");
      ctx.fillStyle = exitGlow;
      ctx.fillRect(exitX - exitRadius * 3, exitY - exitRadius * 3, exitRadius * 6, exitRadius * 6);

      // Exit dot
      ctx.beginPath();
      ctx.arc(exitX, exitY, exitRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#4ade80" : "#16a34a";
      ctx.fill();

      // Home icon (simple house shape)
      ctx.save();
      ctx.translate(exitX, exitY);
      const iconSize = exitRadius * 0.7;
      ctx.fillStyle = isDark ? "#0a0a0a" : "#fafafa";
      ctx.strokeStyle = isDark ? "#0a0a0a" : "#fafafa";
      ctx.lineWidth = 1.2;
      // Roof
      ctx.beginPath();
      ctx.moveTo(0, -iconSize * 0.8);
      ctx.lineTo(-iconSize * 0.8, -iconSize * 0.05);
      ctx.lineTo(iconSize * 0.8, -iconSize * 0.05);
      ctx.closePath();
      ctx.fill();
      // Body
      ctx.fillRect(-iconSize * 0.55, -iconSize * 0.05, iconSize * 1.1, iconSize * 0.75);
      ctx.restore();

      // Draw player (glowing dot)
      const px = pad + player[1] * cs + cs / 2;
      const py = pad + player[0] * cs + cs / 2;
      const playerRadius = cs * 0.25;

      // Player glow
      const playerGlow = ctx.createRadialGradient(px, py, 0, px, py, playerRadius * 4);
      playerGlow.addColorStop(
        0,
        isDark ? "rgba(147,197,253,0.5)" : "rgba(59,130,246,0.4)",
      );
      playerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = playerGlow;
      ctx.fillRect(
        px - playerRadius * 4,
        py - playerRadius * 4,
        playerRadius * 8,
        playerRadius * 8,
      );

      // Player dot
      ctx.beginPath();
      ctx.arc(px, py, playerRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#93c5fd" : "#3b82f6";
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.arc(px - playerRadius * 0.2, py - playerRadius * 0.2, playerRadius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)";
      ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [maze, player]);

  return (
    <div className="flex w-full flex-col items-center gap-6 px-6 pb-16">
      {/* Divider */}
      <div className="h-px w-24 bg-gray-200 dark:bg-gray-800" />

      <h2 className="text-lg font-light text-gray-500 dark:text-gray-400">
        Lost? Find your way home.
      </h2>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="aspect-square w-[min(360px,80vw)] rounded-lg"
          style={{ imageRendering: "auto" }}
        />

        {/* Win overlay */}
        {won && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-white/90 dark:bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              You found your way home!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate({ to: "/" })}
                className="rounded-lg border border-gray-200 bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-700 dark:border-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Go Home
              </button>
              <button
                onClick={resetGame}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={resetGame}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-100"
        >
          New Maze
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-600">
          Arrow keys or WASD to move
        </p>
      </div>
    </div>
  );
}
