import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// ── Constants ──────────────────────────────────────────────────────

const COLS = 10;
const ROWS = 20;
const CELL = 28;
const PREVIEW_CELLS = 4;
const PREVIEW_CELL = 18;

const COLORS: Record<string, string> = {
  I: "#00f0f0",
  O: "#f0f000",
  T: "#a000f0",
  S: "#00f000",
  Z: "#f00000",
  J: "#0000f0",
  L: "#f0a000",
};

const GHOST_ALPHA = 0.25;

type Shape = number[][];

const TETROMINOES: Record<string, Shape[]> = {
  I: [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
  ],
  O: [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 1],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
};

const PIECE_TYPES = Object.keys(TETROMINOES);

const LINE_SCORES = [0, 100, 300, 500, 800];

// ── Types ──────────────────────────────────────────────────────────

interface Piece {
  type: string;
  rotation: number;
  row: number;
  col: number;
}

type Board = (string | null)[][];

// ── Helpers ────────────────────────────────────────────────────────

function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function getShape(piece: Piece): Shape {
  return TETROMINOES[piece.type][piece.rotation];
}

function collides(board: Board, piece: Piece, rowOff = 0, colOff = 0, rotOff = 0): boolean {
  const rot = (((piece.rotation + rotOff) % 4) + 4) % 4;
  const shape = TETROMINOES[piece.type][rot];
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = piece.row + r + rowOff;
      const nc = piece.col + c + colOff;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return true;
      if (board[nr][nc]) return true;
    }
  }
  return false;
}

function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map((row) => [...row]);
  const shape = getShape(piece);
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nr = piece.row + r;
      const nc = piece.col + c;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        newBoard[nr][nc] = piece.type;
      }
    }
  }
  return newBoard;
}

function clearLines(board: Board): { board: Board; cleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const cleared = ROWS - remaining.length;
  const empty = Array.from({ length: cleared }, () => Array<string | null>(COLS).fill(null));
  return { board: [...empty, ...remaining], cleared };
}

function randomType(): string {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
}

function spawnPiece(type: string): Piece {
  const shape = TETROMINOES[type][0];
  const col = Math.floor((COLS - shape[0].length) / 2);
  return { type, rotation: 0, row: 0, col };
}

function getGhostRow(board: Board, piece: Piece): number {
  let row = piece.row;
  while (!collides(board, { ...piece, row: row + 1 })) {
    row++;
  }
  return row;
}

function getDropSpeed(level: number): number {
  return Math.max(100, 800 - (level - 1) * 70);
}

function getHighScore(): number {
  try {
    const s = localStorage.getItem("tetris-high-score");
    if (s) return parseInt(s, 10);
  } catch { /* ignored */ }
  return 0;
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem("tetris-high-score", String(score));
  } catch { /* ignored */ }
}

// ── Component ──────────────────────────────────────────────────────

export default function TetrisGame() {
  useSEO({
    title: "Tetris - sma1lboy's Lab",
    description:
      "Classic Tetris with 7 tetrominoes, arrow key controls, hard drop, level progression, and high score tracking.",
    path: "/apps/tetris",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const boardRef = useRef<Board>(createBoard());
  const pieceRef = useRef<Piece>(spawnPiece(randomType()));
  const nextTypeRef = useRef<string>(randomType());
  const scoreRef = useRef(0);
  const linesRef = useRef(0);
  const levelRef = useRef(1);
  const highScoreRef = useRef(getHighScore());
  const gameOverRef = useRef(false);
  const pausedRef = useRef(false);
  const dropTimerRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(highScoreRef.current);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  // ── Drawing ────────────────────────────────────────────────────

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = COLS * CELL;
    const h = ROWS * CELL;
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(w, r * CELL);
      ctx.stroke();
    }
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, h);
      ctx.stroke();
    }

    const board = boardRef.current;
    const piece = pieceRef.current;

    // Locked cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const type = board[r][c];
        if (type) {
          drawCell(ctx, c, r, COLORS[type], 1);
        }
      }
    }

    if (!gameOverRef.current) {
      // Ghost piece
      const ghostRow = getGhostRow(board, piece);
      const shape = getShape(piece);
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue;
          drawCell(ctx, piece.col + c, ghostRow + r, COLORS[piece.type], GHOST_ALPHA);
        }
      }

      // Active piece
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (!shape[r][c]) continue;
          drawCell(ctx, piece.col + c, piece.row + r, COLORS[piece.type], 1);
        }
      }
    }

    // Pause overlay
    if (pausedRef.current && !gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PAUSED", w / 2, h / 2);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }

    // Game over overlay
    if (gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, w, h);
      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#f00";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GAME OVER", w / 2, h / 2);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    }
  }, []);

  const drawPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = PREVIEW_CELLS * PREVIEW_CELL;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, size, size);

    const type = nextTypeRef.current;
    const shape = TETROMINOES[type][0];
    const color = COLORS[type];

    const shapeH = shape.length;
    const shapeW = shape[0].length;
    const offR = Math.floor((PREVIEW_CELLS - shapeH) / 2);
    const offC = Math.floor((PREVIEW_CELLS - shapeW) / 2);

    for (let r = 0; r < shapeH; r++) {
      for (let c = 0; c < shapeW; c++) {
        if (!shape[r][c]) continue;
        const x = (offC + c) * PREVIEW_CELL;
        const y = (offR + r) * PREVIEW_CELL;
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y + 1, PREVIEW_CELL - 2, PREVIEW_CELL - 2);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(x + 1, y + 1, PREVIEW_CELL - 2, 3);
      }
    }
  }, []);

  function drawCell(
    ctx: CanvasRenderingContext2D,
    col: number,
    row: number,
    color: string,
    alpha: number,
  ) {
    const x = col * CELL;
    const y = row * CELL;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    // Highlight
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(x + 1, y + 1, CELL - 2, 4);
    ctx.globalAlpha = 1;
  }

  // ── Game Logic ─────────────────────────────────────────────────

  const syncState = useCallback(() => {
    setScore(scoreRef.current);
    setLines(linesRef.current);
    setLevel(levelRef.current);
    setHighScore(highScoreRef.current);
    setGameOver(gameOverRef.current);
    setPaused(pausedRef.current);
  }, []);

  const placePiece = useCallback(() => {
    const board = lockPiece(boardRef.current, pieceRef.current);
    const { board: cleared, cleared: numLines } = clearLines(board);
    boardRef.current = cleared;

    if (numLines > 0) {
      scoreRef.current += LINE_SCORES[numLines] * levelRef.current;
      linesRef.current += numLines;
      levelRef.current = Math.floor(linesRef.current / 10) + 1;
    }

    if (scoreRef.current > highScoreRef.current) {
      highScoreRef.current = scoreRef.current;
      saveHighScore(scoreRef.current);
    }

    // Spawn next piece
    const nextPiece = spawnPiece(nextTypeRef.current);
    nextTypeRef.current = randomType();

    if (collides(cleared, nextPiece)) {
      gameOverRef.current = true;
      pieceRef.current = nextPiece;
      syncState();
      drawBoard();
      drawPreview();
      return;
    }

    pieceRef.current = nextPiece;
    syncState();
    drawPreview();
  }, [syncState, drawBoard, drawPreview]);

  const moveLeft = useCallback(() => {
    const p = pieceRef.current;
    if (!collides(boardRef.current, p, 0, -1)) {
      pieceRef.current = { ...p, col: p.col - 1 };
    }
  }, []);

  const moveRight = useCallback(() => {
    const p = pieceRef.current;
    if (!collides(boardRef.current, p, 0, 1)) {
      pieceRef.current = { ...p, col: p.col + 1 };
    }
  }, []);

  const moveDown = useCallback((): boolean => {
    const p = pieceRef.current;
    if (!collides(boardRef.current, p, 1, 0)) {
      pieceRef.current = { ...p, row: p.row + 1 };
      return true;
    }
    return false;
  }, []);

  const rotate = useCallback(() => {
    const p = pieceRef.current;
    const newRot = (p.rotation + 1) % 4;
    // Try basic rotation
    if (!collides(boardRef.current, p, 0, 0, 1)) {
      pieceRef.current = { ...p, rotation: newRot };
      return;
    }
    // Wall kick: try left/right offsets
    for (const offset of [-1, 1, -2, 2]) {
      if (!collides(boardRef.current, { ...p, rotation: newRot }, 0, offset)) {
        pieceRef.current = { ...p, rotation: newRot, col: p.col + offset };
        return;
      }
    }
  }, []);

  const hardDrop = useCallback(() => {
    const p = pieceRef.current;
    const ghostRow = getGhostRow(boardRef.current, p);
    scoreRef.current += (ghostRow - p.row) * 2;
    pieceRef.current = { ...p, row: ghostRow };
    placePiece();
  }, [placePiece]);

  const resetGame = useCallback(() => {
    boardRef.current = createBoard();
    pieceRef.current = spawnPiece(randomType());
    nextTypeRef.current = randomType();
    scoreRef.current = 0;
    linesRef.current = 0;
    levelRef.current = 1;
    highScoreRef.current = getHighScore();
    gameOverRef.current = false;
    pausedRef.current = false;
    dropTimerRef.current = 0;
    lastTimeRef.current = 0;
    syncState();
    drawPreview();
  }, [syncState, drawPreview]);

  const togglePause = useCallback(() => {
    if (gameOverRef.current) return;
    pausedRef.current = !pausedRef.current;
    if (!pausedRef.current) {
      lastTimeRef.current = performance.now();
    }
    syncState();
  }, [syncState]);

  // ── Keyboard ───────────────────────────────────────────────────

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
        return;
      }

      if (gameOverRef.current || pausedRef.current) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          if (moveDown()) {
            scoreRef.current += 1;
            syncState();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate();
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
      }
      drawBoard();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause, drawBoard, syncState]);

  // ── Game Loop ──────────────────────────────────────────────────

  useEffect(() => {
    const loop = (time: number) => {
      rafRef.current = requestAnimationFrame(loop);

      if (gameOverRef.current || pausedRef.current) {
        lastTimeRef.current = time;
        drawBoard();
        return;
      }

      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      dropTimerRef.current += delta;
      const speed = getDropSpeed(levelRef.current);

      if (dropTimerRef.current >= speed) {
        dropTimerRef.current -= speed;
        if (!moveDown()) {
          placePiece();
        }
        syncState();
      }

      drawBoard();
    };

    rafRef.current = requestAnimationFrame(loop);
    drawPreview();

    return () => cancelAnimationFrame(rafRef.current);
  }, [moveDown, placePiece, drawBoard, drawPreview, syncState]);

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <Breadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-lg"
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Tetris
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Arrow keys to move & rotate, Space to hard drop, P to pause
            </p>
          </div>

          {/* Score Bar */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <div className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Score
              </div>
              <div className="text-xl font-bold text-gray-900 tabular-nums dark:text-gray-100">
                {score.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Level
              </div>
              <div className="text-xl font-bold text-gray-900 tabular-nums dark:text-gray-100">
                {level}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                Lines
              </div>
              <div className="text-xl font-bold text-gray-900 tabular-nums dark:text-gray-100">
                {lines}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 text-xs font-medium tracking-wider text-amber-500 uppercase">
                <Trophy size={12} />
                Best
              </div>
              <div className="text-xl font-bold text-amber-500 tabular-nums">
                {highScore.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="flex justify-center gap-4">
            {/* Main Board */}
            <div className="overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700">
              <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                className="block"
                style={{ width: COLS * CELL, height: ROWS * CELL }}
              />
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-3">
              {/* Next Piece */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-2 text-center text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Next
                </div>
                <div className="flex justify-center">
                  <canvas
                    ref={previewCanvasRef}
                    width={PREVIEW_CELLS * PREVIEW_CELL}
                    height={PREVIEW_CELLS * PREVIEW_CELL}
                    className="rounded"
                    style={{
                      width: PREVIEW_CELLS * PREVIEW_CELL,
                      height: PREVIEW_CELLS * PREVIEW_CELL,
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <button
                onClick={togglePause}
                disabled={gameOver}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {paused ? <Play size={16} /> : <Pause size={16} />}
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={resetGame}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <RotateCcw size={16} />
                New Game
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 text-center text-xs text-gray-400 sm:grid-cols-4 dark:text-gray-500">
            <span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">
                &larr;&rarr;
              </kbd>{" "}
              Move
            </span>
            <span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">
                &uarr;
              </kbd>{" "}
              Rotate
            </span>
            <span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">
                &darr;
              </kbd>{" "}
              Soft Drop
            </span>
            <span>
              <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-800">
                Space
              </kbd>{" "}
              Hard Drop
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
