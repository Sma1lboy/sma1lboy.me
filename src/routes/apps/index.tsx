import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { RouteErrorBoundary } from "@/components/ErrorBoundary";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  FlaskConical,
  Search,
  X,
  Code2,
  Clock,
  Sparkles,
  Palette,
} from "lucide-react";
import TypewriterPreview from "../../components/apps/typewriter/TypewriterPreview";
import ReceiptPreview from "../../components/apps/receipt/ReceiptPreview";
import TerminalPreview from "../../components/apps/terminal/TerminalPreview";
import TypingTestPreview from "../../components/apps/typing/TypingTestPreview";
import PomodoroPreview from "../../components/apps/pomodoro/PomodoroPreview";
import ChatPreview from "../../components/apps/chat/ChatPreview";
import LifePreview from "../../components/apps/life/LifePreview";
import DiffPreview from "../../components/apps/diff/DiffPreview";
import JsonPreview from "../../components/apps/json/JsonPreview";
import EncodePreview from "../../components/apps/encode/EncodePreview";
import ColorsPreview from "../../components/apps/colors/ColorsPreview";
import RegexPreview from "../../components/apps/regex/RegexPreview";
import MarkdownPreview from "../../components/apps/markdown/MarkdownPreview";
import GradientPreview from "../../components/apps/gradient/GradientPreview";
import KanbanPreview from "../../components/apps/kanban/KanbanPreview";
import WidgetPreview from "../../components/apps/widget/WidgetPreview";
import AsciiPreview from "../../components/apps/ascii/AsciiPreview";
import HashPreview from "../../components/apps/hash/HashPreview";
import QrPreview from "../../components/apps/qr/QrPreview";
import PixelPreview from "../../components/apps/pixel/PixelPreview";
import DrawPreview from "../../components/apps/draw/DrawPreview";
import MinesweeperPreview from "../../components/apps/minesweeper/MinesweeperPreview";
import Game2048Preview from "../../components/apps/2048/Game2048Preview";
import WeatherPreview from "../../components/apps/weather/WeatherPreview";
import TetrisPreview from "../../components/apps/tetris/TetrisPreview";
import CurrencyPreview from "../../components/apps/currency/CurrencyPreview";
import PasswordPreview from "../../components/apps/password/PasswordPreview";

export const Route = createFileRoute("/apps/")({
  component: AppsIndex,
  errorComponent: RouteErrorBoundary,
});

interface AppEntry {
  to: string;
  title: string;
  description: string;
  preview: React.ReactNode;
  isNew?: boolean;
}

const newAppPaths = new Set([
  "/apps/gradient",
  "/apps/markdown",
  "/apps/regex",
  "/apps/colors",
  "/apps/encode",
  "/apps/kanban",
  "/apps/widget",
  "/apps/ascii",
  "/apps/hash",
  "/apps/qr",
  "/apps/pixel",
  "/apps/draw",
  "/apps/minesweeper",
  "/apps/2048",
  "/apps/weather",
  "/apps/tetris",
  "/apps/currency",
  "/apps/password",
]);

const categories: {
  name: string;
  icon: React.ReactNode;
  apps: AppEntry[];
}[] = [
  {
    name: "Developer Tools",
    icon: <Code2 size={20} />,
    apps: [
      {
        to: "/apps/terminal",
        title: "Terminal",
        description:
          "Interactive terminal emulator. Type commands to explore.",
        preview: <TerminalPreview />,
      },
      {
        to: "/apps/diff",
        title: "Code Diff",
        description:
          "Compare code side-by-side with visual diffs. GitHub-style additions and deletions.",
        preview: <DiffPreview />,
      },
      {
        to: "/apps/json",
        title: "JSON Formatter",
        description:
          "Format, validate, and explore JSON with syntax highlighting, tree view, and byte size comparison.",
        preview: <JsonPreview />,
      },
      {
        to: "/apps/encode",
        title: "Encoder / Decoder",
        description:
          "Multi-tool encoder/decoder with Base64, URL encoding, HTML entities, and JWT decode.",
        preview: <EncodePreview />,
      },
      {
        to: "/apps/regex",
        title: "Regex Tester",
        description:
          "Test regular expressions in real-time with live match highlighting, capture groups, and a handy cheat sheet.",
        preview: <RegexPreview />,
      },
      {
        to: "/apps/widget",
        title: "Widget Generator",
        description:
          "Create embeddable HTML widgets — GitHub badges, profile cards, and custom counters with live preview.",
        preview: <WidgetPreview />,
      },
      {
        to: "/apps/hash",
        title: "Hash Generator",
        description:
          "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files. Compare and verify hashes.",
        preview: <HashPreview />,
      },
      {
        to: "/apps/qr",
        title: "QR Code Generator",
        description:
          "Generate QR codes from text or URLs with custom colors. Download as PNG.",
        preview: <QrPreview />,
      },
      {
        to: "/apps/password",
        title: "Password Generator",
        description:
          "Generate secure passwords with customizable length, character sets, strength meter, and batch generation.",
        preview: <PasswordPreview />,
      },
    ],
  },
  {
    name: "Productivity",
    icon: <Clock size={20} />,
    apps: [
      {
        to: "/apps/pomodoro",
        title: "Pomodoro Timer",
        description:
          "Focus timer with 25-min work sessions and breaks. Track your productivity.",
        preview: <PomodoroPreview />,
      },
      {
        to: "/apps/markdown",
        title: "Markdown Editor",
        description:
          "Write markdown with live preview, formatting toolbar, auto-save, and HTML export.",
        preview: <MarkdownPreview />,
      },
      {
        to: "/apps/typing",
        title: "Typing Speed Test",
        description:
          "Test your typing speed with programming passages. Track WPM, accuracy, and beat your best score.",
        preview: <TypingTestPreview />,
      },
      {
        to: "/apps/kanban",
        title: "Kanban Board",
        description:
          "Drag-and-drop sticky note Kanban board. Organize tasks across columns with pastel cards.",
        preview: <KanbanPreview />,
      },
      {
        to: "/apps/weather",
        title: "Weather",
        description:
          "Check current weather and 5-day forecast for any city. Auto-detects your location with unit toggle.",
        preview: <WeatherPreview />,
      },
      {
        to: "/apps/currency",
        title: "Currency Converter",
        description:
          "Convert currencies in real-time with live exchange rates and a 30-day historical rate chart.",
        preview: <CurrencyPreview />,
      },
    ],
  },
  {
    name: "Fun & Interactive",
    icon: <Sparkles size={20} />,
    apps: [
      {
        to: "/apps/chat",
        title: "AI Chat",
        description:
          "Chat with a simulated AI assistant. Ask about Jackson, his projects, tech stack, and more.",
        preview: <ChatPreview />,
      },
      {
        to: "/apps/life",
        title: "Game of Life",
        description:
          "Conway's cellular automaton with presets, canvas rendering, and click-to-draw interaction.",
        preview: <LifePreview />,
      },
      {
        to: "/apps/receipt",
        title: "3D Receipt",
        description:
          "Interactive receipt with Verlet cloth physics. Grab, drag, and fold thermal paper.",
        preview: <ReceiptPreview />,
      },
      {
        to: "/apps/minesweeper",
        title: "Minesweeper",
        description:
          "Classic Minesweeper with Easy, Medium, and Hard modes. Flag mines, beat the clock, and track high scores.",
        preview: <MinesweeperPreview />,
      },
      {
        to: "/apps/2048",
        title: "2048",
        description:
          "Slide and merge tiles to reach 2048. Arrow keys or swipe to play, with score tracking and high score persistence.",
        preview: <Game2048Preview />,
      },
      {
        to: "/apps/tetris",
        title: "Tetris",
        description:
          "Classic Tetris with 7 tetrominoes, arrow key controls, hard drop, level progression, and high score tracking.",
        preview: <TetrisPreview />,
      },
    ],
  },
  {
    name: "Creative",
    icon: <Palette size={20} />,
    apps: [
      {
        to: "/apps/typewriter",
        title: "Motorola Fix Beeper",
        description:
          "A retro typewriter experience. Compose, polish, and print on vintage paper cards.",
        preview: <TypewriterPreview />,
      },
      {
        to: "/apps/colors",
        title: "Color Picker",
        description:
          "Pick colors, generate harmonious palettes, check WCAG contrast ratios, and save your favorites.",
        preview: <ColorsPreview />,
      },
      {
        to: "/apps/gradient",
        title: "Gradient Generator",
        description:
          "Create beautiful CSS gradients with color stops, direction control, presets, and live CSS output.",
        preview: <GradientPreview />,
      },
      {
        to: "/apps/ascii",
        title: "ASCII Art",
        description:
          "Type text and see it rendered as large ASCII art with multiple font styles.",
        preview: <AsciiPreview />,
      },
      {
        to: "/apps/pixel",
        title: "Pixel Art Editor",
        description:
          "Draw pixel art on a canvas grid with brushes, fill tool, and color picker. Export as PNG.",
        preview: <PixelPreview />,
      },
      {
        to: "/apps/draw",
        title: "Drawing Canvas",
        description:
          "Freehand whiteboard with pen, eraser, shapes, color picker, and PNG export.",
        preview: <DrawPreview />,
      },
    ],
  },
];

const totalApps = categories.reduce((sum, cat) => sum + cat.apps.length, 0);

function AppsIndex() {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;

    return categories
      .map((cat) => ({
        ...cat,
        apps: cat.apps.filter(
          (app) =>
            app.title.toLowerCase().includes(q) ||
            app.description.toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.apps.length > 0);
  }, [search]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto px-6 py-10 sm:px-8 sm:py-14">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="flex items-center gap-3">
            <FlaskConical
              size={28}
              className="text-gray-700 dark:text-gray-300"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  sma1lboy&apos;s Lab
                </h1>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {totalApps} apps
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Experiments, toys, and interactive demos.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600 sm:max-w-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories */}
        {filteredCategories.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-400 dark:text-gray-500">
            No apps match &ldquo;{search}&rdquo;
          </p>
        )}

        <div className="space-y-12">
          {filteredCategories.map((cat) => (
            <section key={cat.name}>
              <div className="mb-5 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                {cat.icon}
                <h2 className="text-lg font-semibold">{cat.name}</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  ({cat.apps.length})
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {cat.apps.map((app) => (
                  <Link
                    key={app.to}
                    to={app.to}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700"
                  >
                    {newAppPaths.has(app.to) && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        New
                      </span>
                    )}
                    <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-gray-100 bg-gray-950 dark:border-gray-800">
                      {app.preview}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-1.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {app.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {app.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
