import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Direction = "up" | "down" | "left" | "right";
type Grid = number[][];

interface TileInfo {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

const SIZE = 4;

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "bg-[#eee4da]", text: "text-[#776e65]" },
  4: { bg: "bg-[#ede0c8]", text: "text-[#776e65]" },
  8: { bg: "bg-[#f2b179]", text: "text-white" },
  16: { bg: "bg-[#f59563]", text: "text-white" },
  32: { bg: "bg-[#f67c5f]", text: "text-white" },
  64: { bg: "bg-[#f65e3b]", text: "text-white" },
  128: { bg: "bg-[#edcf72]", text: "text-white" },
  256: { bg: "bg-[#edcc61]", text: "text-white" },
  512: { bg: "bg-[#edc850]", text: "text-white" },
  1024: { bg: "bg-[#edc53f]", text: "text-white" },
  2048: { bg: "bg-[#edc22e]", text: "text-white" },
};

const DEFAULT_TILE = { bg: "bg-[#3c3a32]", text: "text-white" };

function getHighScore(): number {
  try {
    const stored = localStorage.getItem("2048-high-score");
    if (stored) return parseInt(stored, 10);
  } catch {}
  return 0;
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem("2048-high-score", String(score));
  } catch {}
}

function createEmptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => [...row]);
}

function addRandomTile(grid: Grid): Grid {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newGrid = cloneGrid(grid);
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function rotateGrid(grid: Grid, times: number): Grid {
  let g = cloneGrid(grid);
  for (let t = 0; t < times; t++) {
    const rotated = createEmptyGrid();
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        rotated[c][SIZE - 1 - r] = g[r][c];
      }
    }
    g = rotated;
  }
  return g;
}

function slideLeft(grid: Grid): { grid: Grid; score: number; moved: boolean; mergedCells: Set<string> } {
  let score = 0;
  let moved = false;
  const mergedCells = new Set<string>();
  const newGrid = createEmptyGrid();

  for (let r = 0; r < SIZE; r++) {
    const row = grid[r].filter((v) => v !== 0);
    const merged: number[] = [];
    let i = 0;
    while (i < row.length) {
      if (i + 1 < row.length && row[i] === row[i + 1]) {
        const val = row[i] * 2;
        merged.push(val);
        score += val;
        mergedCells.add(`${r},${merged.length - 1}`);
        i += 2;
      } else {
        merged.push(row[i]);
        i++;
      }
    }
    for (let c = 0; c < SIZE; c++) {
      newGrid[r][c] = merged[c] || 0;
      if (newGrid[r][c] !== grid[r][c]) moved = true;
    }
  }

  return { grid: newGrid, score, moved, mergedCells };
}

function move(grid: Grid, direction: Direction): { grid: Grid; score: number; moved: boolean; mergedCells: Set<string> } {
  const rotations: Record<Direction, number> = { left: 0, up: 1, right: 2, down: 3 };
  const inverseRotations: Record<Direction, number> = { left: 0, down: 1, right: 2, up: 3 };
  const rot = rotations[direction];
  const inv = inverseRotations[direction];

  const rotated = rotateGrid(grid, rot);
  const result = slideLeft(rotated);
  const finalGrid = rotateGrid(result.grid, inv);

  // Transform merged cell coordinates back
  const transformedMerged = new Set<string>();
  result.mergedCells.forEach((key) => {
    const [r, c] = key.split(",").map(Number);
    let tr = r,
      tc = c;
    for (let t = 0; t < inv; t++) {
      const nr = tc;
      const nc = SIZE - 1 - tr;
      tr = nr;
      tc = nc;
    }
    transformedMerged.add(`${tr},${tc}`);
  });

  return { grid: finalGrid, score: result.score, moved: result.moved, mergedCells: transformedMerged };
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
      if (r + 1 < SIZE && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 2048) return true;
    }
  }
  return false;
}

let tileIdCounter = 0;

function gridToTiles(grid: Grid, newCells: Set<string>, mergedCells: Set<string>): TileInfo[] {
  const tiles: TileInfo[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] !== 0) {
        tiles.push({
          id: tileIdCounter++,
          value: grid[r][c],
          row: r,
          col: c,
          isNew: newCells.has(`${r},${c}`),
          isMerged: mergedCells.has(`${r},${c}`),
        });
      }
    }
  }
  return tiles;
}

function initGame(): { grid: Grid; tiles: TileInfo[] } {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  const firstNew = new Set<string>();
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] !== 0) firstNew.add(`${r},${c}`);
  grid = addRandomTile(grid);
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (grid[r][c] !== 0 && !firstNew.has(`${r},${c}`)) firstNew.add(`${r},${c}`);
  return { grid, tiles: gridToTiles(grid, firstNew, new Set()) };
}

export default function Game2048() {
  useSEO({
    title: "2048 – sma1lboy's Lab",
    description:
      "Play the classic 2048 sliding puzzle game. Merge tiles to reach 2048!",
    path: "/apps/2048",
  });

  const gridRef = useRef<Grid>(initGame().grid);
  const [tiles, setTiles] = useState<TileInfo[]>(() => {
    const init = initGame();
    gridRef.current = init.grid;
    return init.tiles;
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getHighScore);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const movingRef = useRef(false);

  const resetGame = useCallback(() => {
    tileIdCounter = 0;
    const init = initGame();
    gridRef.current = init.grid;
    setTiles(init.tiles);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    movingRef.current = false;
  }, []);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver || (won && !keepPlaying) || movingRef.current) return;
      movingRef.current = true;

      const prevGrid = gridRef.current;
      const result = move(prevGrid, direction);
      if (!result.moved) {
        movingRef.current = false;
        return;
      }

      const newGrid = addRandomTile(result.grid);
      gridRef.current = newGrid;

      const newCells = new Set<string>();
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++)
          if (newGrid[r][c] !== 0 && result.grid[r][c] === 0)
            newCells.add(`${r},${c}`);

      const newTiles = gridToTiles(newGrid, newCells, result.mergedCells);
      setTiles(newTiles);

      setScore((prev) => {
        const newScore = prev + result.score;
        if (newScore > getHighScore()) {
          setHighScore(newScore);
          saveHighScore(newScore);
        }
        return newScore;
      });

      if (!keepPlaying && hasWon(newGrid)) {
        setWon(true);
      } else if (!canMove(newGrid)) {
        setGameOver(true);
      }

      setTimeout(() => {
        movingRef.current = false;
      }, 100);
    },
    [gameOver, won, keepPlaying],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = dirMap[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const minSwipe = 30;

      if (Math.max(absDx, absDy) < minSwipe) return;

      if (absDx > absDy) {
        handleMove(dx > 0 ? "right" : "left");
      } else {
        handleMove(dy > 0 ? "down" : "up");
      }
      touchStartRef.current = null;
    },
    [handleMove],
  );

  const getTileSize = () => {
    if (typeof window !== "undefined" && window.innerWidth < 400) return "w-16 h-16";
    return "w-[72px] h-[72px] sm:w-20 sm:h-20";
  };

  const getTileFontSize = (value: number) => {
    if (value >= 1024) return "text-base sm:text-lg";
    if (value >= 128) return "text-lg sm:text-xl";
    return "text-xl sm:text-2xl";
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-lg px-4 py-6">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold tracking-tight">2048</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Merge tiles to reach 2048. Use arrow keys or swipe.
          </p>
        </motion.div>

        {/* Score bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center gap-3"
        >
          <div className="flex flex-1 gap-2">
            <div className="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-center dark:bg-neutral-800">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Score
              </div>
              <div className="text-lg font-bold tabular-nums">{score}</div>
            </div>
            <div className="flex-1 rounded-lg bg-neutral-100 px-4 py-2 text-center dark:bg-neutral-800">
              <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                <Trophy size={10} />
                Best
              </div>
              <div className="text-lg font-bold tabular-nums">{highScore}</div>
            </div>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <RotateCcw size={14} />
            New
          </button>
        </motion.div>

        {/* Game board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          ref={gameContainerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mx-auto aspect-square w-full max-w-[352px] rounded-xl bg-[#bbada0] p-2 select-none dark:bg-[#5c534a]"
        >
          {/* Empty cell backgrounds */}
          <div className="grid h-full w-full grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md bg-[#cdc1b4]/50 dark:bg-[#3c3a32]/50"
              />
            ))}
          </div>

          {/* Tiles layer */}
          <div className="absolute inset-2">
            <AnimatePresence mode="popLayout">
              {tiles.map((tile) => {
                const colors = TILE_COLORS[tile.value] || DEFAULT_TILE;
                const cellPercent = 100 / SIZE;
                const gapPercent = 0.5;
                return (
                  <motion.div
                    key={tile.id}
                    initial={
                      tile.isNew
                        ? { scale: 0, opacity: 0 }
                        : tile.isMerged
                          ? { scale: 0.8 }
                          : false
                    }
                    animate={{
                      scale: 1,
                      opacity: 1,
                      left: `${tile.col * cellPercent + gapPercent}%`,
                      top: `${tile.row * cellPercent + gapPercent}%`,
                    }}
                    transition={{
                      scale: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        duration: 0.15,
                      },
                      left: { type: "tween", duration: 0.12, ease: "easeOut" },
                      top: { type: "tween", duration: 0.12, ease: "easeOut" },
                      opacity: { duration: 0.1 },
                    }}
                    className={`absolute flex items-center justify-center rounded-md font-bold ${getTileSize()} ${colors.bg} ${colors.text} ${getTileFontSize(tile.value)}`}
                    style={{
                      width: `${cellPercent - gapPercent * 2}%`,
                      height: `${cellPercent - gapPercent * 2}%`,
                    }}
                  >
                    {tile.value}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Game over overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm"
              >
                <p className="mb-4 text-2xl font-bold text-white">Game Over</p>
                <p className="mb-4 text-sm text-neutral-300">Score: {score}</p>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-neutral-200"
                >
                  <RotateCcw size={14} />
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Win overlay */}
          <AnimatePresence>
            {won && !keepPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-[#edc22e]/80 backdrop-blur-sm"
              >
                <p className="mb-2 text-3xl font-bold text-white">You Win!</p>
                <p className="mb-4 text-sm text-white/80">Score: {score}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setKeepPlaying(true)}
                    className="rounded-lg bg-white/90 px-5 py-2 text-sm font-semibold text-[#776e65] transition-colors hover:bg-white"
                  >
                    Keep Going
                  </button>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-1.5 rounded-lg bg-black/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/40"
                  >
                    <RotateCcw size={14} />
                    New Game
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 text-center text-xs text-neutral-400 dark:text-neutral-500"
        >
          Use <kbd className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">&#8592;</kbd>{" "}
          <kbd className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">&#8593;</kbd>{" "}
          <kbd className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">&#8594;</kbd>{" "}
          <kbd className="rounded border border-neutral-300 px-1 py-0.5 text-[10px] dark:border-neutral-700">&#8595;</kbd>{" "}
          arrow keys or swipe to move tiles
        </motion.p>
      </div>
    </div>
  );
}
