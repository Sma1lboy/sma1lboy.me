import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Flag, Timer as TimerIcon, Hourglass } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

type TabMode = "stopwatch" | "countdown";

// ─── Audio ───────────────────────────────────────────────────────────
function playAlarm() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Three-tone ascending alarm
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.2;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {
    // Audio not available
  }
}

// ─── Formatting ──────────────────────────────────────────────────────
function formatStopwatch(elapsedMs: number): string {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const cs = Math.floor((elapsedMs % 1000) / 10);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Stopwatch ───────────────────────────────────────────────────────
interface Lap {
  number: number;
  time: number; // total elapsed at lap
  delta: number; // time since last lap
}

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const startRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  const tick = useCallback(() => {
    setElapsed(accumulatedRef.current + (performance.now() - startRef.current));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      startRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      stop();
    }
    return stop;
  }, [isRunning, tick, stop]);

  const handleStartStop = () => {
    if (isRunning) {
      accumulatedRef.current = elapsed;
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };

  const handleLap = () => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    setLaps((prev) => [
      { number: prev.length + 1, time: elapsed, delta: elapsed - lastLapTime },
      ...prev,
    ]);
  };

  const handleReset = () => {
    stop();
    setIsRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    setLaps([]);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Time display */}
      <div className="mt-4 mb-10">
        <span className="font-mono text-6xl font-light tracking-tight text-gray-900 tabular-nums sm:text-7xl dark:text-gray-100">
          {formatStopwatch(elapsed)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleReset}
          disabled={elapsed === 0}
          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-300"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={handleStartStop}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 dark:bg-blue-400 dark:text-gray-900 dark:shadow-blue-400/20 dark:hover:bg-blue-300"
          aria-label={isRunning ? "Stop" : "Start"}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-300"
          aria-label="Lap"
        >
          <Flag size={20} />
        </button>
      </div>

      {/* Laps */}
      {laps.length > 0 && (
        <div className="mt-8 w-full max-w-sm">
          <div className="max-h-52 overflow-y-auto">
            {laps.map((lap) => (
              <motion.div
                key={lap.number}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between border-b border-gray-100 px-2 py-2 dark:border-gray-800"
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">Lap {lap.number}</span>
                <span className="font-mono text-sm text-gray-400 tabular-nums dark:text-gray-500">
                  +{formatStopwatch(lap.delta)}
                </span>
                <span className="font-mono text-sm text-gray-700 tabular-nums dark:text-gray-300">
                  {formatStopwatch(lap.time)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Countdown ───────────────────────────────────────────────────────
type CountdownState = "setting" | "running" | "paused" | "done";

function Countdown() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [state, setState] = useState<CountdownState>("setting");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSetSeconds = hours * 3600 + minutes * 60 + seconds;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state !== "running") {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [state, clearTimer]);

  useEffect(() => {
    if (remaining === 0 && state === "running") {
      clearTimer();
      setState("done");
      playAlarm();
    }
  }, [remaining, state, clearTimer]);

  const handleStart = () => {
    if (totalSetSeconds === 0) return;
    setRemaining(totalSetSeconds);
    setState("running");
  };

  const handleResume = () => setState("running");
  const handlePause = () => setState("paused");

  const handleReset = () => {
    clearTimer();
    setState("setting");
    setRemaining(0);
  };

  const clamp = (v: number, max: number) => Math.max(0, Math.min(max, v));

  // Setting mode
  if (state === "setting") {
    return (
      <div className="flex flex-col items-center">
        <div className="mt-4 mb-10 flex items-baseline gap-2">
          {[
            {
              label: "h",
              value: hours,
              set: setHours,
              max: 99,
            },
            {
              label: "m",
              value: minutes,
              set: setMinutes,
              max: 59,
            },
            {
              label: "s",
              value: seconds,
              set: setSeconds,
              max: 59,
            },
          ].map(({ label, value, set, max }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <button
                onClick={() => set((v) => clamp(v + 1, max))}
                className="flex h-8 w-16 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
                aria-label={`Increase ${label}`}
              >
                ▲
              </button>
              <input
                type="number"
                min={0}
                max={max}
                value={value}
                onChange={(e) => set(clamp(parseInt(e.target.value) || 0, max))}
                className="w-16 rounded-lg bg-gray-50 px-1 py-2 text-center font-mono text-4xl font-light text-gray-900 tabular-nums outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-900 dark:text-gray-100"
              />
              <button
                onClick={() => set((v) => clamp(v - 1, max))}
                className="flex h-8 w-16 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
                aria-label={`Decrease ${label}`}
              >
                ▼
              </button>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleStart}
          disabled={totalSetSeconds === 0}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 disabled:opacity-30 dark:bg-orange-400 dark:text-gray-900 dark:shadow-orange-400/20 dark:hover:bg-orange-300"
          aria-label="Start"
        >
          <Play size={24} className="ml-1" />
        </button>
      </div>
    );
  }

  // Running / Paused / Done
  const progress = totalSetSeconds > 0 ? remaining / totalSetSeconds : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Time display */}
      <div className="mt-4 mb-10">
        <span
          className={`font-mono text-6xl font-light tracking-tight tabular-nums sm:text-7xl ${
            state === "done"
              ? "animate-pulse text-orange-500 dark:text-orange-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {formatCountdown(remaining)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-8 h-1 w-64 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <motion.div
          className="h-full rounded-full bg-orange-400 dark:bg-orange-300"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleReset}
          className="flex h-12 w-12 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-300"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>

        {state !== "done" && (
          <button
            onClick={state === "running" ? handlePause : handleResume}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 dark:bg-orange-400 dark:text-gray-900 dark:shadow-orange-400/20 dark:hover:bg-orange-300"
            aria-label={state === "running" ? "Pause" : "Resume"}
          >
            {state === "running" ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        )}

        {state === "done" && (
          <button
            onClick={handleReset}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 dark:bg-orange-400 dark:text-gray-900 dark:shadow-orange-400/20 dark:hover:bg-orange-300"
            aria-label="Done"
          >
            <RotateCcw size={24} />
          </button>
        )}

        <div className="h-12 w-12" />
      </div>

      {state === "done" && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-sm font-medium text-orange-500 dark:text-orange-400"
        >
          Time's up!
        </motion.p>
      )}
    </div>
  );
}

// ─── Main Timer ──────────────────────────────────────────────────────
export default function Timer() {
  useSEO({
    title: "Stopwatch & Timer",
    description: "Stopwatch with lap tracking and countdown timer with alarm.",
    path: "/apps/timer",
  });

  const [tab, setTab] = useState<TabMode>("stopwatch");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 dark:bg-black">
      {/* Back link */}
      <div className="fixed top-6 left-6">
        <Breadcrumbs />
      </div>

      {/* Tab switcher */}
      <div className="mb-10 flex items-center rounded-full bg-gray-100 p-1 dark:bg-gray-900">
        {(
          [
            { key: "stopwatch", label: "Stopwatch", icon: TimerIcon },
            { key: "countdown", label: "Countdown", icon: Hourglass },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
              tab === key
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            }`}
          >
            {tab === key && (
              <motion.div
                layoutId="timer-tab-bg"
                className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-gray-800"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "stopwatch" ? <Stopwatch /> : <Countdown />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
