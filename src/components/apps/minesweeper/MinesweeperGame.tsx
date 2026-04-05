import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Trophy, Flag, Bomb, Timer, Smile, Frown, PartyPopper } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Difficulty = "easy" | "medium" | "hard";
type GameStatus = "idle" | "playing" | "won" | "lost";

interface CellData {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

const DIFFICULTIES: Record<
  Difficulty,
  { cols: number; rows: number; mines: number; label: string }
> = {
  easy: { cols: 9, rows: 9, mines: 10, label: "Easy" },
  medium: { cols: 16, rows: 16, mines: 40, label: "Medium" },
  hard: { cols: 30, rows: 16, mines: 99, label: "Hard" },
};

const NUMBER_COLORS: Record<number, string> = {
  1: "#0000FF",
  2: "#008000",
  3: "#FF0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

const NUMBER_COLORS_DARK: Record<number, string> = {
  1: "#6495ED",
  2: "#4CAF50",
  3: "#FF6B6B",
  4: "#7B9EFF",
  5: "#D4726A",
  6: "#4DB6AC",
  7: "#B0B0B0",
  8: "#9E9E9E",
};

function getHighScores(): Record<Difficulty, number | null> {
  try {
    const stored = localStorage.getItem("minesweeper-high-scores");
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignored */
  }
  return { easy: null, medium: null, hard: null };
}

function saveHighScore(difficulty: Difficulty, time: number) {
  try {
    const scores = getHighScores();
    if (scores[difficulty] === null || time < scores[difficulty]!) {
      scores[difficulty] = time;
      localStorage.setItem("minesweeper-high-scores", JSON.stringify(scores));
    }
  } catch {
    /* ignored */
  }
}

function createEmptyGrid(rows: number, cols: number): CellData[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    })),
  );
}

function placeMines(
  grid: CellData[][],
  rows: number,
  cols: number,
  mineCount: number,
  safeRow: number,
  safeCol: number,
): CellData[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const safeZone = new Set<string>();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      safeZone.add(`${safeRow + dr},${safeCol + dc}`);
    }
  }

  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newGrid[r][c].isMine && !safeZone.has(`${r},${c}`)) {
      newGrid[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isMine) {
            count++;
          }
        }
      }
      newGrid[r][c].adjacentMines = count;
    }
  }

  return newGrid;
}

function floodReveal(
  grid: CellData[][],
  rows: number,
  cols: number,
  startRow: number,
  startCol: number,
): CellData[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[startRow, startCol]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
    if (newGrid[r][c].isRevealed || newGrid[r][c].isFlagged || newGrid[r][c].isMine) continue;

    newGrid[r][c].isRevealed = true;

    if (newGrid[r][c].adjacentMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          stack.push([r + dr, c + dc]);
        }
      }
    }
  }

  return newGrid;
}

function checkWin(grid: CellData[][], rows: number, cols: number, mineCount: number): boolean {
  let revealedCount = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isRevealed) revealedCount++;
    }
  }
  return revealedCount === rows * cols - mineCount;
}

function useIsDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export default function MinesweeperGame() {
  useSEO({
    title: "Minesweeper",
    description:
      "Play classic Minesweeper with Easy, Medium, and Hard difficulties. Flag mines, reveal cells, and beat your best time.",
    path: "/apps/minesweeper",
  });

  const isDark = useIsDark();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<CellData[][]>(() => {
    const { rows, cols } = DIFFICULTIES.easy;
    return createEmptyGrid(rows, cols);
  });
  const [gameStatus, setGameStatus] = useState<GameStatus>("idle");
  const [timer, setTimer] = useState(0);
  const [flagCount, setFlagCount] = useState(0);
  const [highScores, setHighScores] = useState(getHighScores);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameStatusRef = useRef<GameStatus>("idle");

  const { cols, rows, mines } = DIFFICULTIES[difficulty];

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const newGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff || difficulty;
      const { rows: r, cols: c } = DIFFICULTIES[d];
      stopTimer();
      setGrid(createEmptyGrid(r, c));
      setGameStatus("idle");
      gameStatusRef.current = "idle";
      setTimer(0);
      setFlagCount(0);
      if (diff) setDifficulty(diff);
    },
    [difficulty, stopTimer],
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameStatusRef.current === "won" || gameStatusRef.current === "lost") return;

      setGrid((prevGrid) => {
        const cell = prevGrid[row][col];
        if (cell.isRevealed || cell.isFlagged) return prevGrid;

        let currentGrid = prevGrid;

        if (gameStatusRef.current === "idle") {
          currentGrid = placeMines(prevGrid, rows, cols, mines, row, col);
          setGameStatus("playing");
          gameStatusRef.current = "playing";
          startTimer();
        }

        if (currentGrid[row][col].isMine) {
          const lostGrid = currentGrid.map((r) =>
            r.map((c) => ({
              ...c,
              isRevealed: c.isMine ? true : c.isRevealed,
            })),
          );
          lostGrid[row][col] = { ...lostGrid[row][col], isRevealed: true };
          setGameStatus("lost");
          gameStatusRef.current = "lost";
          stopTimer();
          return lostGrid;
        }

        const newGrid = floodReveal(currentGrid, rows, cols, row, col);

        if (checkWin(newGrid, rows, cols, mines)) {
          setGameStatus("won");
          gameStatusRef.current = "won";
          stopTimer();
          setTimer((currentTime) => {
            saveHighScore(difficulty, currentTime);
            setHighScores(getHighScores());
            return currentTime;
          });
        }

        return newGrid;
      });
    },
    [rows, cols, mines, difficulty, startTimer, stopTimer],
  );

  const handleCellRightClick = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (
      gameStatusRef.current === "won" ||
      gameStatusRef.current === "lost" ||
      gameStatusRef.current === "idle"
    )
      return;

    setGrid((prevGrid) => {
      const cell = prevGrid[row][col];
      if (cell.isRevealed) return prevGrid;

      const newGrid = prevGrid.map((r) => r.map((c) => ({ ...c })));
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      setFlagCount((f) => (newGrid[row][col].isFlagged ? f + 1 : f - 1));
      return newGrid;
    });
  }, []);

  const cellSize =
    difficulty === "hard"
      ? "w-6 h-6 text-[10px] sm:w-7 sm:h-7 sm:text-xs"
      : "w-7 h-7 text-xs sm:w-8 sm:h-8 sm:text-sm";

  const currentBest = highScores[difficulty];

  const statusIcon =
    gameStatus === "won" ? (
      <PartyPopper className="h-5 w-5 text-yellow-500" />
    ) : gameStatus === "lost" ? (
      <Frown className="h-5 w-5 text-red-400" />
    ) : (
      <Smile className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
    );

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumbs />
          <h1 className="text-2xl font-bold">Minesweeper</h1>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => newGame(d)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                difficulty === d
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              }`}
            >
              {DIFFICULTIES[d].label}
            </button>
          ))}
          <button
            onClick={() => newGame()}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            <RotateCcw className="h-4 w-4" />
            New Game
          </button>
        </motion.div>

        {/* Status bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center justify-between rounded-xl bg-neutral-100 px-5 py-3 dark:bg-neutral-900"
        >
          <div className="flex items-center gap-3">
            <Bomb className="h-4 w-4 text-red-500" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Mines</span>
            <span className="text-lg font-bold text-red-500 tabular-nums">{mines - flagCount}</span>
          </div>
          <div className="flex items-center gap-2">{statusIcon}</div>
          <div className="flex items-center gap-3">
            <Timer className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Time</span>
            <span className="text-lg font-bold text-blue-500 tabular-nums dark:text-blue-400">
              {timer}s
            </span>
          </div>
        </motion.div>

        {/* High score */}
        {currentBest !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mb-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"
          >
            <Trophy className="h-4 w-4 text-yellow-500" />
            Best time ({DIFFICULTIES[difficulty].label}):{" "}
            <span className="font-semibold text-yellow-600 dark:text-yellow-500">
              {currentBest}s
            </span>
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:p-4 dark:border-neutral-800 dark:bg-neutral-900"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            className="mx-auto w-fit select-none"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gap: "1px",
            }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const isExplodedMine = gameStatus === "lost" && cell.isMine && cell.isRevealed;
                const isWrongFlag = gameStatus === "lost" && cell.isFlagged && !cell.isMine;

                let content: React.ReactNode = null;
                let bgClass =
                  "bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600";

                if (cell.isRevealed) {
                  bgClass =
                    "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700";
                  if (cell.isMine) {
                    bgClass = isExplodedMine
                      ? "bg-red-200 dark:bg-red-900/50 border border-red-300 dark:border-red-700"
                      : "bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700";
                    content = (
                      <Bomb className="h-3 w-3 text-neutral-800 sm:h-3.5 sm:w-3.5 dark:text-neutral-200" />
                    );
                  } else if (cell.adjacentMines > 0) {
                    const color = isDark
                      ? NUMBER_COLORS_DARK[cell.adjacentMines]
                      : NUMBER_COLORS[cell.adjacentMines];
                    content = (
                      <span className="font-bold" style={{ color }}>
                        {cell.adjacentMines}
                      </span>
                    );
                  }
                } else if (cell.isFlagged) {
                  if (isWrongFlag) {
                    bgClass =
                      "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 line-through";
                    content = <Flag className="h-3 w-3 text-red-500 sm:h-3.5 sm:w-3.5" />;
                  } else {
                    content = <Flag className="h-3 w-3 text-red-500 sm:h-3.5 sm:w-3.5" />;
                  }
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    className={`${cellSize} flex items-center justify-center rounded-sm transition-colors ${bgClass}`}
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={(e) => handleCellRightClick(e, r, c)}
                    aria-label={`Cell ${r},${c}`}
                  >
                    {content}
                  </button>
                );
              }),
            )}
          </div>
        </motion.div>

        {/* Game over / win overlay messages */}
        {gameStatus === "won" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-green-50 p-4 text-center dark:bg-green-900/20"
          >
            <p className="text-lg font-bold text-green-700 dark:text-green-400">You won!</p>
            <p className="text-sm text-green-600 dark:text-green-500">
              Completed in {timer}s
              {currentBest !== null && timer <= currentBest && " — New best time!"}
            </p>
          </motion.div>
        )}

        {gameStatus === "lost" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-red-50 p-4 text-center dark:bg-red-900/20"
          >
            <p className="text-lg font-bold text-red-700 dark:text-red-400">Game Over</p>
            <p className="text-sm text-red-600 dark:text-red-500">You hit a mine! Try again.</p>
          </motion.div>
        )}

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-neutral-500"
        >
          <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
            Left Click: Reveal
          </span>
          <span className="rounded bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
            Right Click: Flag
          </span>
        </motion.div>
      </div>
    </div>
  );
}
