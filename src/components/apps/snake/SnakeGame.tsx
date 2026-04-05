import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Trophy } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;
const SPEED_DECREASE = 3;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const DIRECTION_MAP: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  s: "DOWN",
  a: "LEFT",
  d: "RIGHT",
  W: "UP",
  S: "DOWN",
  A: "LEFT",
  D: "RIGHT",
};

const OPPOSITES: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

function getHighScore(): number {
  try {
    return parseInt(localStorage.getItem("snake-high-score") || "0", 10);
  } catch {
    return 0;
  }
}

function setHighScore(score: number) {
  try {
    localStorage.setItem("snake-high-score", String(score));
  } catch {}
}

export default function SnakeGame() {
  useSEO({
    title: "Snake Game",
    description:
      "Play the classic Snake game. Use arrow keys or WASD to control the snake, eat food to grow, and try to beat your high score.",
    path: "/apps/snake",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);

  const [gridSize, setGridSize] = useState({ cols: 20, rows: 20 });
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">(
    "idle",
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScoreState] = useState(getHighScore);

  const snakeRef = useRef<Point[]>([]);
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Point>({ x: 10, y: 10 });
  const scoreRef = useRef(0);

  const computeGridSize = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const maxW = Math.min(rect.width - 32, 600);
    const maxH = Math.min(rect.height - 32, 600);
    const cols = Math.floor(maxW / CELL_SIZE);
    const rows = Math.floor(maxH / CELL_SIZE);
    setGridSize({
      cols: Math.max(10, Math.min(cols, 30)),
      rows: Math.max(10, Math.min(rows, 30)),
    });
  }, []);

  useEffect(() => {
    computeGridSize();
    window.addEventListener("resize", computeGridSize);
    return () => window.removeEventListener("resize", computeGridSize);
  }, [computeGridSize]);

  const spawnFood = useCallback(
    (snake: Point[]): Point => {
      const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
      const free: Point[] = [];
      for (let x = 0; x < gridSize.cols; x++) {
        for (let y = 0; y < gridSize.rows; y++) {
          if (!occupied.has(`${x},${y}`)) free.push({ x, y });
        }
      }
      if (free.length === 0) return { x: 0, y: 0 };
      return free[Math.floor(Math.random() * free.length)];
    },
    [gridSize],
  );

  const getSpeed = useCallback((s: number) => {
    return Math.max(MIN_SPEED, INITIAL_SPEED - s * SPEED_DECREASE);
  }, []);

  const drawGame = useCallback(
    (snake: Point[], food: Point) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = gridSize.cols * CELL_SIZE;
      const h = gridSize.rows * CELL_SIZE;
      canvas.width = w;
      canvas.height = h;

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, w, h);

      // Grid lines (subtle)
      ctx.strokeStyle = "rgba(255,255,255,0.03)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= gridSize.cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL_SIZE, 0);
        ctx.lineTo(x * CELL_SIZE, h);
        ctx.stroke();
      }
      for (let y = 0; y <= gridSize.rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL_SIZE);
        ctx.lineTo(w, y * CELL_SIZE);
        ctx.stroke();
      }

      // Food with glow
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ff4444";
      const fx = food.x * CELL_SIZE + CELL_SIZE / 2;
      const fy = food.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.beginPath();
      ctx.arc(fx, fy, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake
      snake.forEach((seg, i) => {
        const t = 1 - i / Math.max(snake.length, 1);
        const green = Math.floor(180 + t * 75);
        ctx.fillStyle = `rgb(0, ${green}, ${Math.floor(t * 40)})`;

        const x = seg.x * CELL_SIZE + 1;
        const y = seg.y * CELL_SIZE + 1;
        const s = CELL_SIZE - 2;
        const r = i === 0 ? 5 : 3;

        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + s - r, y);
        ctx.quadraticCurveTo(x + s, y, x + s, y + r);
        ctx.lineTo(x + s, y + s - r);
        ctx.quadraticCurveTo(x + s, y + s, x + s - r, y + s);
        ctx.lineTo(x + r, y + s);
        ctx.quadraticCurveTo(x, y + s, x, y + s - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();

        // Head eyes
        if (i === 0) {
          ctx.fillStyle = "#ffffff";
          const dir = directionRef.current;
          let ex1: number, ey1: number, ex2: number, ey2: number;
          const cx = seg.x * CELL_SIZE + CELL_SIZE / 2;
          const cy = seg.y * CELL_SIZE + CELL_SIZE / 2;
          if (dir === "RIGHT") {
            ex1 = cx + 3;
            ey1 = cy - 3;
            ex2 = cx + 3;
            ey2 = cy + 3;
          } else if (dir === "LEFT") {
            ex1 = cx - 3;
            ey1 = cy - 3;
            ex2 = cx - 3;
            ey2 = cy + 3;
          } else if (dir === "UP") {
            ex1 = cx - 3;
            ey1 = cy - 3;
            ex2 = cx + 3;
            ey2 = cy - 3;
          } else {
            ex1 = cx - 3;
            ey1 = cy + 3;
            ex2 = cx + 3;
            ey2 = cy + 3;
          }
          ctx.beginPath();
          ctx.arc(ex1, ey1, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ex2, ey2, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    },
    [gridSize],
  );

  const startGame = useCallback(() => {
    const cx = Math.floor(gridSize.cols / 2);
    const cy = Math.floor(gridSize.rows / 2);
    const initialSnake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ];
    snakeRef.current = initialSnake;
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    scoreRef.current = 0;
    foodRef.current = spawnFood(initialSnake);
    setScore(0);
    setGameState("playing");
    lastTickRef.current = 0;
  }, [gridSize, spawnFood]);

  const endGame = useCallback(() => {
    setGameState("gameover");
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    const s = scoreRef.current;
    const hs = getHighScore();
    if (s > hs) {
      setHighScore(s);
      setHighScoreState(s);
    }
  }, []);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    directionRef.current = nextDirectionRef.current;
    const dir = directionRef.current;
    const head = snake[0];

    const delta: Record<Direction, Point> = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };

    const newHead = {
      x: head.x + delta[dir].x,
      y: head.y + delta[dir].y,
    };

    // Wall collision
    if (
      newHead.x < 0 ||
      newHead.x >= gridSize.cols ||
      newHead.y < 0 ||
      newHead.y >= gridSize.rows
    ) {
      endGame();
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
      endGame();
      return;
    }

    const newSnake = [newHead, ...snake];
    const food = foodRef.current;

    if (newHead.x === food.x && newHead.y === food.y) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      foodRef.current = spawnFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    drawGame(newSnake, foodRef.current);
  }, [gridSize, spawnFood, drawGame, endGame]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const loop = (timestamp: number) => {
      const speed = getSpeed(scoreRef.current);
      if (timestamp - lastTickRef.current >= speed) {
        lastTickRef.current = timestamp;
        tick();
      }
      if (gameState === "playing") {
        gameLoopRef.current = requestAnimationFrame(loop);
      }
    };

    // Draw initial frame
    drawGame(snakeRef.current, foodRef.current);
    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, tick, drawGame, getSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newDir = DIRECTION_MAP[e.key];
      if (newDir) {
        e.preventDefault();
        if (gameState === "playing") {
          const current = directionRef.current;
          if (OPPOSITES[newDir] !== current) {
            nextDirectionRef.current = newDir;
          }
        }
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (gameState === "idle" || gameState === "gameover") {
          startGame();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, startGame]);

  // Draw idle state
  useEffect(() => {
    if (gameState === "idle") {
      const cx = Math.floor(gridSize.cols / 2);
      const cy = Math.floor(gridSize.rows / 2);
      const demoSnake = [
        { x: cx, y: cy },
        { x: cx - 1, y: cy },
        { x: cx - 2, y: cy },
      ];
      drawGame(demoSnake, { x: cx + 3, y: cy });
    }
  }, [gameState, gridSize, drawGame]);

  const canvasWidth = gridSize.cols * CELL_SIZE;
  const canvasHeight = gridSize.rows * CELL_SIZE;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Breadcrumbs />
          <h1 className="text-2xl font-bold">Snake</h1>
        </motion.div>

        {/* Score bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center justify-between rounded-xl bg-neutral-900 px-5 py-3"
        >
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-400">Score</div>
            <div className="text-2xl font-bold tabular-nums text-green-400">
              {score}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <div className="text-sm text-neutral-400">Best</div>
            <div className="text-lg font-semibold tabular-nums text-yellow-500">
              {highScore}
            </div>
          </div>
        </motion.div>

        {/* Game canvas area */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 p-4"
          style={{ minHeight: canvasHeight + 32 }}
        >
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className="rounded-lg"
            style={{ imageRendering: "pixelated" }}
          />

          {/* Overlay: Idle state */}
          {gameState === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="text-4xl font-bold text-green-400">
                  Snake
                </div>
                <p className="text-sm text-neutral-400">
                  Use arrow keys or WASD to move
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-500"
                >
                  <Play className="h-5 w-5" />
                  Play
                </button>
                <p className="text-xs text-neutral-500">
                  or press Space to start
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Overlay: Game Over */}
          {gameState === "gameover" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="text-3xl font-bold text-red-400">
                  Game Over
                </div>
                <div className="text-5xl font-bold tabular-nums text-white">
                  {score}
                </div>
                <p className="text-sm text-neutral-400">
                  {score > 0 && score >= highScore
                    ? "New high score!"
                    : `Best: ${highScore}`}
                </p>
                <button
                  onClick={startGame}
                  className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-500"
                >
                  <RotateCcw className="h-5 w-5" />
                  Play Again
                </button>
                <p className="text-xs text-neutral-500">
                  or press Space to restart
                </p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Controls hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-neutral-500"
        >
          <span className="rounded bg-neutral-800 px-2 py-1">
            Arrow Keys / WASD
          </span>
          <span className="rounded bg-neutral-800 px-2 py-1">
            Space to start/restart
          </span>
        </motion.div>
      </div>
    </div>
  );
}
