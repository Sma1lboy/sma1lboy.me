import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

// --- LCS-based line diff algorithm ---

type DiffLineType = "add" | "del" | "same";

interface DiffLine {
  type: DiffLineType;
  text: string;
  oldNum?: number;
  newNum?: number;
}

function computeLCS(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

function diffLines(original: string, modified: string): DiffLine[] {
  const a = original.split("\n");
  const b = modified.split("\n");
  const dp = computeLCS(a, b);
  const result: DiffLine[] = [];

  let i = a.length;
  let j = b.length;

  // Backtrack through LCS table
  const stack: DiffLine[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: "same", text: a[i - 1], oldNum: i, newNum: j });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: "add", text: b[j - 1], newNum: j });
      j--;
    } else {
      stack.push({ type: "del", text: a[i - 1], oldNum: i });
      i--;
    }
  }

  // Reverse since we built it backwards
  for (let k = stack.length - 1; k >= 0; k--) {
    result.push(stack[k]);
  }

  return result;
}

// --- Sample code for placeholder ---

const SAMPLE_ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return name;
}

greet("World");`;

const SAMPLE_MODIFIED = `function greet(name, greeting = "Hello") {
  const message = \`\${greeting}, \${name}!\`;
  console.log(message);
  return message;
}

greet("World");
greet("Claude", "Hi");`;

// --- Component ---

export default function Diff() {
  useSEO({
    title: "Code Diff Viewer",
    description:
      "Compare code side-by-side with visual diffs. GitHub-style additions and deletions.",
  });

  const [original, setOriginal] = useState(SAMPLE_ORIGINAL);
  const [modified, setModified] = useState(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");

  const diff = useMemo(() => diffLines(original, modified), [original, modified]);

  const originalChars = original.length;
  const modifiedChars = modified.length;
  const additions = diff.filter((d) => d.type === "add").length;
  const deletions = diff.filter((d) => d.type === "del").length;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <div className="container mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/apps"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-100">
            Code Diff Viewer
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Paste code in both panels to see a visual diff.
          </p>
        </div>

        {/* Stats bar */}
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span>
            Original: <span className="text-gray-200">{originalChars}</span> chars
          </span>
          <span>
            Modified: <span className="text-gray-200">{modifiedChars}</span> chars
          </span>
          <span className="text-green-400">+{additions}</span>
          <span className="text-red-400">-{deletions}</span>
          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setViewMode("split")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "split"
                  ? "bg-gray-700 text-gray-100"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === "unified"
                  ? "bg-gray-700 text-gray-100"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Unified
            </button>
          </div>
        </div>

        {/* Input areas */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Original
            </label>
            <textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              className="h-48 w-full rounded-lg border border-gray-800 bg-gray-950 p-3 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 focus:outline-none"
              placeholder="Paste original code here..."
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-400">
              Modified
            </label>
            <textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              className="h-48 w-full rounded-lg border border-gray-800 bg-gray-950 p-3 font-mono text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 focus:outline-none"
              placeholder="Paste modified code here..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Diff output */}
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <div className="border-b border-gray-800 bg-gray-950 px-4 py-2 text-xs font-medium text-gray-400">
            Diff Output
          </div>
          {viewMode === "split" ? (
            <SplitView diff={diff} />
          ) : (
            <UnifiedView diff={diff} />
          )}
        </div>
      </div>
    </div>
  );
}

// --- Split View ---

function SplitView({ diff }: { diff: DiffLine[] }) {
  // Build left (original) and right (modified) columns
  const left: { line: DiffLine | null; idx: number }[] = [];
  const right: { line: DiffLine | null; idx: number }[] = [];

  let li = 0;
  let ri = 0;

  for (const d of diff) {
    if (d.type === "same") {
      // Pad shorter side if needed
      while (li < left.length || ri < right.length) {
        if (li < left.length && ri < right.length) break;
        if (li < left.length) {
          right.push({ line: null, idx: ri++ });
        } else {
          left.push({ line: null, idx: li++ });
        }
      }
      left.push({ line: d, idx: li++ });
      right.push({ line: d, idx: ri++ });
    } else if (d.type === "del") {
      left.push({ line: d, idx: li++ });
    } else {
      right.push({ line: d, idx: ri++ });
    }
  }

  // Pad to equal length
  while (left.length < right.length) left.push({ line: null, idx: li++ });
  while (right.length < left.length) right.push({ line: null, idx: ri++ });

  return (
    <div className="grid grid-cols-2 divide-x divide-gray-800">
      <div className="overflow-x-auto">
        <pre className="text-xs leading-5">
          {left.map((entry, i) => (
            <SplitLine key={i} line={entry.line} side="left" />
          ))}
        </pre>
      </div>
      <div className="overflow-x-auto">
        <pre className="text-xs leading-5">
          {right.map((entry, i) => (
            <SplitLine key={i} line={entry.line} side="right" />
          ))}
        </pre>
      </div>
    </div>
  );
}

function SplitLine({
  line,
  side,
}: {
  line: DiffLine | null;
  side: "left" | "right";
}) {
  if (!line) {
    return <div className="h-5 bg-gray-950 px-2">&nbsp;</div>;
  }

  const num = side === "left" ? line.oldNum : line.newNum;
  const bgClass =
    line.type === "del"
      ? "bg-red-900/30"
      : line.type === "add"
        ? "bg-green-900/30"
        : "";
  const textClass =
    line.type === "del"
      ? "text-red-300"
      : line.type === "add"
        ? "text-green-300"
        : "text-gray-400";

  return (
    <div className={`flex ${bgClass}`}>
      <span className="w-10 shrink-0 select-none px-2 text-right text-gray-600">
        {num ?? ""}
      </span>
      <span className={`flex-1 whitespace-pre px-2 font-mono ${textClass}`}>
        {line.text}
      </span>
    </div>
  );
}

// --- Unified View ---

function UnifiedView({ diff }: { diff: DiffLine[] }) {
  return (
    <div className="overflow-x-auto">
      <pre className="text-xs leading-5">
        {diff.map((line, i) => {
          const bgClass =
            line.type === "del"
              ? "bg-red-900/30"
              : line.type === "add"
                ? "bg-green-900/30"
                : "";
          const textClass =
            line.type === "del"
              ? "text-red-300"
              : line.type === "add"
                ? "text-green-300"
                : "text-gray-400";
          const prefix =
            line.type === "del" ? "-" : line.type === "add" ? "+" : " ";

          return (
            <div key={i} className={`flex ${bgClass}`}>
              <span className="w-10 shrink-0 select-none px-2 text-right text-gray-600">
                {line.oldNum ?? ""}
              </span>
              <span className="w-10 shrink-0 select-none px-2 text-right text-gray-600">
                {line.newNum ?? ""}
              </span>
              <span className="w-4 shrink-0 select-none text-center text-gray-500">
                {prefix}
              </span>
              <span
                className={`flex-1 whitespace-pre px-2 font-mono ${textClass}`}
              >
                {line.text}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
