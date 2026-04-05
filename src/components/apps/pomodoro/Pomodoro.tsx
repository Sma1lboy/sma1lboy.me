import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

type Mode = "idle" | "working" | "shortBreak" | "longBreak";

const DURATIONS: Record<Exclude<Mode, "idle">, number> = {
  working: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<Mode, string> = {
  idle: "Ready to Focus",
  working: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const RING_RADIUS = 140;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const STORAGE_KEY = "pomodoro-sessions";

function getStoredSessions(): number {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.value = 523;
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.value = 659;
    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch {
    // Audio not available
  }
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function Pomodoro() {
  useSEO({
    title: "Pomodoro Timer",
    description:
      "Focus timer with 25-min work sessions and breaks. Track your productivity.",
    path: "/apps/pomodoro",
  });

  const [mode, setMode] = useState<Mode>("idle");
  const [timeLeft, setTimeLeft] = useState(DURATIONS.working);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsInCycle, setSessionsInCycle] = useState(0);
  const [totalSessions, setTotalSessions] = useState(getStoredSessions);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentDuration =
    mode === "idle" ? DURATIONS.working : DURATIONS[mode];
  const progress = timeLeft / currentDuration;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progress);

  const ringColor =
    mode === "shortBreak" || mode === "longBreak"
      ? "stroke-teal-400 dark:stroke-teal-300"
      : "stroke-amber-400 dark:stroke-amber-300";

  const ringTrackColor = "stroke-gray-200 dark:stroke-gray-800";

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const transitionToNext = useCallback(() => {
    playChime();
    clearTimer();
    setIsRunning(false);

    if (mode === "working") {
      const newCount = sessionsInCycle + 1;
      const newTotal = totalSessions + 1;
      setTotalSessions(newTotal);
      try {
        localStorage.setItem(STORAGE_KEY, String(newTotal));
      } catch {
        // Storage not available
      }

      if (newCount >= 4) {
        setSessionsInCycle(0);
        setMode("longBreak");
        setTimeLeft(DURATIONS.longBreak);
      } else {
        setSessionsInCycle(newCount);
        setMode("shortBreak");
        setTimeLeft(DURATIONS.shortBreak);
      }
    } else {
      setMode("working");
      setTimeLeft(DURATIONS.working);
    }
  }, [mode, sessionsInCycle, totalSessions, clearTimer]);

  useEffect(() => {
    if (!isRunning) {
      clearTimer();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [isRunning, clearTimer]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      transitionToNext();
    }
  }, [timeLeft, isRunning, transitionToNext]);

  const handleStart = () => {
    if (mode === "idle") {
      setMode("working");
      setTimeLeft(DURATIONS.working);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    clearTimer();
    setIsRunning(false);
    setMode("idle");
    setTimeLeft(DURATIONS.working);
    setSessionsInCycle(0);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-black">
      {/* Back link */}
      <div className="fixed left-6 top-6">
        <Breadcrumbs />
      </div>

      {/* Mode indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
          className="mb-8 text-center"
        >
          <span
            className={`text-lg font-medium tracking-wide ${
              mode === "shortBreak" || mode === "longBreak"
                ? "text-teal-600 dark:text-teal-300"
                : "text-amber-600 dark:text-amber-300"
            }`}
          >
            {MODE_LABELS[mode]}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Progress ring */}
      <div className="relative flex items-center justify-center">
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx="160"
            cy="160"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="6"
            className={ringTrackColor}
          />
          {/* Progress */}
          <motion.circle
            cx="160"
            cy="160"
            r={RING_RADIUS}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={ringColor}
            strokeDasharray={RING_CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-light tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            {formatTime(timeLeft)}
          </span>
          <span className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {totalSessions} session{totalSessions !== 1 ? "s" : ""} completed
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center gap-6">
        <button
          onClick={handleReset}
          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-300"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={isRunning ? handlePause : handleStart}
          className={`flex h-16 w-16 items-center justify-center rounded-full transition-all ${
            mode === "shortBreak" || mode === "longBreak"
              ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20 hover:bg-teal-600 dark:bg-teal-400 dark:text-gray-900 dark:shadow-teal-400/20 dark:hover:bg-teal-300"
              : "bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 dark:bg-amber-400 dark:text-gray-900 dark:shadow-amber-400/20 dark:hover:bg-amber-300"
          }`}
          aria-label={isRunning ? "Pause" : "Start"}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        {/* Spacer to balance layout */}
        <div className="h-12 w-12" />
      </div>

      {/* Session dots */}
      <div className="mt-8 flex items-center gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i < sessionsInCycle
                ? "scale-110 bg-amber-400 dark:bg-amber-300"
                : "bg-gray-200 dark:bg-gray-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
