import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Timer, Trophy, Zap } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// --- Passages ---

const PASSAGES = [
  `function fibonacci(n: number): number {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}`,
  `const server = express();\nserver.get("/api/health", (req, res) => {\n  res.json({ status: "ok", uptime: process.uptime() });\n});`,
  `"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler`,
  `async function fetchData(url: string) {\n  const response = await fetch(url);\n  if (!response.ok) throw new Error("Network error");\n  return response.json();\n}`,
  `"First, solve the problem. Then, write the code." — John Johnson. Debugging is twice as hard as writing the code in the first place.`,
  `interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}\n\nconst users: Map<string, User> = new Map();`,
  `git commit -m "fix: resolve race condition in websocket handler"\ngit push origin main\ngh pr create --title "Fix race condition" --body "Closes #42"`,
  `const debounce = <T extends (...args: unknown[]) => void>(fn: T, ms: number) => {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n};`,
];

// --- Rating ---

function getRating(wpm: number): { label: string; emoji: string } {
  if (wpm < 20) return { label: "Snail", emoji: "🐌" };
  if (wpm < 40) return { label: "Casual", emoji: "🙂" };
  if (wpm < 60) return { label: "Developer", emoji: "💻" };
  if (wpm < 80) return { label: "Hacker", emoji: "⚡" };
  if (wpm < 100) return { label: "Machine", emoji: "🤖" };
  return { label: "Impossible", emoji: "🔥" };
}

// --- localStorage ---

const BEST_SCORE_KEY = "typing-test-best-wpm";

function getBestScore(): number {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    return stored ? Number(stored) : 0;
  } catch {
    return 0;
  }
}

function saveBestScore(wpm: number) {
  try {
    const current = getBestScore();
    if (wpm > current) {
      localStorage.setItem(BEST_SCORE_KEY, String(wpm));
    }
  } catch {
    // ignore
  }
}

// --- Types ---

type GameState = "ready" | "typing" | "results";

// --- Component ---

export default function TypingTest() {
  useSEO({
    title: "Typing Speed Test",
    description:
      "Test your typing speed with programming-related passages. Track WPM, accuracy, and beat your best score.",
    path: "/apps/typing",
  });

  const [gameState, setGameState] = useState<GameState>("ready");
  const [duration, setDuration] = useState(30);
  const [passage, setPassage] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(0);
  const [bestScore, setBestScore] = useState(getBestScore);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pickPassage = useCallback(() => {
    const idx = Math.floor(Math.random() * PASSAGES.length);
    return PASSAGES[idx];
  }, []);

  // --- Start ---

  const startGame = useCallback(() => {
    const p = pickPassage();
    setPassage(p);
    setTyped("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setTimeLeft(duration);
    setStartTime(Date.now());
    setGameState("typing");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [duration, pickPassage]);

  // --- Timer ---

  useEffect(() => {
    if (gameState !== "typing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameState("results");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // --- Input handler ---

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (gameState !== "typing") return;
      const value = e.target.value;

      // Count correct/incorrect for the newly typed character
      if (value.length > typed.length) {
        const newCharIndex = value.length - 1;
        if (newCharIndex < passage.length) {
          if (value[newCharIndex] === passage[newCharIndex]) {
            setCorrectChars((c) => c + 1);
          } else {
            setIncorrectChars((c) => c + 1);
          }
        }
      }

      setTyped(value);

      // If they've typed the entire passage, end immediately
      if (value.length >= passage.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState("results");
      }
    },
    [gameState, passage, typed.length],
  );

  // --- Computed stats ---

  const wpm = useMemo(() => {
    const elapsed =
      gameState === "results" ? duration - timeLeft || duration : (Date.now() - startTime) / 1000;
    if (elapsed <= 0) return 0;
    const words = correctChars / 5;
    return Math.round((words / elapsed) * 60);
  }, [correctChars, gameState, duration, timeLeft, startTime]);

  const accuracy = useMemo(() => {
    const total = correctChars + incorrectChars;
    if (total === 0) return 100;
    return Math.round((correctChars / total) * 100);
  }, [correctChars, incorrectChars]);

  // --- Save best score on results ---

  useEffect(() => {
    if (gameState === "results" && wpm > 0) {
      saveBestScore(wpm);
      setBestScore(getBestScore());
    }
  }, [gameState, wpm]);

  // --- Live stats update (force re-render every second during typing) ---

  const [, setTick] = useState(0);
  useEffect(() => {
    if (gameState !== "typing") return;
    const interval = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(interval);
  }, [gameState]);

  // --- Restart ---

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState("ready");
    setTyped("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setBestScore(getBestScore());
  }, []);

  // --- Render passage characters ---

  const renderPassage = () => {
    return passage.split("").map((char, i) => {
      let className = "text-gray-500 dark:text-gray-600"; // upcoming
      if (i < typed.length) {
        className =
          typed[i] === char
            ? "text-green-500 dark:text-green-400"
            : "bg-red-500/20 text-red-500 dark:text-red-400";
      } else if (i === typed.length) {
        className = "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100";
      }

      return (
        <span key={i} className={className}>
          {char === "\n" ? "↵\n" : char}
        </span>
      );
    });
  };

  // --- Rating ---

  const rating = getRating(wpm);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-8 dark:bg-black">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs />

        <AnimatePresence mode="wait">
          {/* --- READY STATE --- */}
          {gameState === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  Typing Speed Test
                </h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Test your typing speed with programming passages
                </p>

                {bestScore > 0 && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    <Trophy size={14} />
                    Best: {bestScore} WPM
                  </div>
                )}
              </div>

              {/* Duration selector */}
              <div className="mt-10 flex justify-center gap-4">
                {[30, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-all ${
                      duration === d
                        ? "border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Timer size={16} />
                    {d}s
                  </button>
                ))}
              </div>

              {/* Start button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={startGame}
                  className="rounded-lg bg-gray-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  Start Typing
                </button>
              </div>
            </motion.div>
          )}

          {/* --- TYPING STATE --- */}
          {gameState === "typing" && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Top bar: timer + live stats */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-lg font-bold ${
                      timeLeft <= 10
                        ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <Timer size={18} />
                    {timeLeft}s
                  </div>
                </div>
                <div
                  className="flex items-center gap-4 text-sm"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Zap size={14} />
                    <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                      {wpm}
                    </span>{" "}
                    WPM
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
                      {accuracy}%
                    </span>{" "}
                    accuracy
                  </div>
                </div>
              </div>

              {/* Passage display */}
              <div
                className="relative cursor-text rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950"
                onClick={() => inputRef.current?.focus()}
              >
                <pre className="font-mono text-base leading-relaxed break-all whitespace-pre-wrap sm:text-lg">
                  {renderPassage()}
                </pre>

                {/* Hidden textarea for input capture */}
                <textarea
                  ref={inputRef}
                  value={typed}
                  onChange={handleInput}
                  className="absolute inset-0 h-full w-full resize-none opacity-0"
                  aria-label="Type the passage shown above"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                <motion.div
                  className="h-full bg-green-500"
                  animate={{
                    width: `${Math.min((typed.length / passage.length) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}

          {/* --- RESULTS STATE --- */}
          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <div className="text-center" aria-live="assertive">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mb-2 text-4xl"
                  aria-hidden="true"
                >
                  {rating.emoji}
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {rating.label}
                </h2>
              </div>

              {/* Stats grid */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{wpm}</div>
                  <div className="mt-1 text-xs text-gray-500">WPM</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {accuracy}%
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Accuracy</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {correctChars}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Correct</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-800 dark:bg-gray-950">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {incorrectChars}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Mistakes</div>
                </div>
              </div>

              {/* Best score */}
              {bestScore > 0 && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-1.5 text-sm text-yellow-600 dark:text-yellow-400">
                    <Trophy size={14} />
                    Personal Best: {bestScore} WPM
                    {wpm >= bestScore && wpm > 0 && (
                      <span className="ml-1 rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-medium dark:bg-yellow-900/30">
                        NEW!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex justify-center gap-3">
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
