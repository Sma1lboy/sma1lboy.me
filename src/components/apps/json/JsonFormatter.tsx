import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Copy,
  Check,
  Braces,
  TreePine,
  Minimize2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Highlight, themes } from "prism-react-renderer";
import { useSEO } from "@/hooks/useSEO";

// --- Helpers ---

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n.toLocaleString()} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

function extractErrorPosition(err: unknown): { line: number; column: number; message: string } | null {
  if (!(err instanceof SyntaxError)) return null;
  const msg = err.message;
  // Chrome: "... at position 42" or "... at line 3 column 5"
  const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { line: parseInt(lineColMatch[1], 10), column: parseInt(lineColMatch[2], 10), message: msg };
  }
  // Firefox: "... at line 3 column 5"
  const posMatch = msg.match(/position (\d+)/);
  if (posMatch) {
    return { line: -1, column: parseInt(posMatch[1], 10), message: msg };
  }
  return { line: -1, column: -1, message: msg };
}

function positionToLineCol(text: string, position: number): { line: number; column: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < position && i < text.length; i++) {
    if (text[i] === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, column: col };
}

// --- Tree View Component ---

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function TreeNode({ label, value, depth, defaultOpen }: {
  label?: string;
  value: JsonValue;
  depth: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (value === null) {
    return (
      <div className="flex items-center" style={{ paddingLeft: depth * 20 }}>
        {label !== undefined && (
          <span className="mr-1 text-purple-400">&quot;{label}&quot;: </span>
        )}
        <span className="text-gray-500 italic">null</span>
      </div>
    );
  }

  if (typeof value === "string") {
    return (
      <div className="flex items-start" style={{ paddingLeft: depth * 20 }}>
        {label !== undefined && (
          <span className="mr-1 shrink-0 text-purple-400">&quot;{label}&quot;: </span>
        )}
        <span className="break-all text-green-400">&quot;{value}&quot;</span>
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div className="flex items-center" style={{ paddingLeft: depth * 20 }}>
        {label !== undefined && (
          <span className="mr-1 text-purple-400">&quot;{label}&quot;: </span>
        )}
        <span className="text-blue-400">{String(value)}</span>
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center" style={{ paddingLeft: depth * 20 }}>
        {label !== undefined && (
          <span className="mr-1 text-purple-400">&quot;{label}&quot;: </span>
        )}
        <span className="text-orange-400">{String(value)}</span>
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as JsonValue[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, JsonValue>);
  const count = entries.length;
  const bracket = isArray ? ["[", "]"] : ["{", "}"];
  const summary = isArray ? `[…] ${count} items` : `{…} ${count} keys`;

  return (
    <div style={{ paddingLeft: depth * 20 }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-0.5 text-left hover:bg-gray-800/50 rounded px-0.5 -ml-0.5"
      >
        {open ? (
          <ChevronDown size={14} className="shrink-0 text-gray-500" />
        ) : (
          <ChevronRight size={14} className="shrink-0 text-gray-500" />
        )}
        {label !== undefined && (
          <span className="mr-1 text-purple-400">&quot;{label}&quot;: </span>
        )}
        {open ? (
          <span className="text-yellow-300">{bracket[0]}</span>
        ) : (
          <span className="text-gray-400">{summary}</span>
        )}
      </button>
      {open && (
        <>
          {entries.map(([key, val]) => (
            <TreeNode
              key={key}
              label={isArray ? undefined : key}
              value={val}
              depth={depth + 1}
              defaultOpen={depth < 1}
            />
          ))}
          <div style={{ paddingLeft: 0 }}>
            <span className="text-yellow-300">{bracket[1]}</span>
          </div>
        </>
      )}
    </div>
  );
}

// --- Line Number Gutter ---

function LineNumbers({ count, errorLine }: { count: number; errorLine: number }) {
  return (
    <div
      className="select-none pr-3 text-right text-xs leading-[1.5rem] text-gray-600"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={i + 1 === errorLine ? "text-red-400 font-bold" : ""}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---

type ViewMode = "editor" | "tree";

const SAMPLE_JSON = `{
  "name": "Jackson Chen",
  "role": "Full Stack Developer",
  "skills": ["TypeScript", "React", "Node.js", "Go", "Rust"],
  "projects": {
    "codefox": {
      "type": "AI Tooling",
      "stars": 1200,
      "active": true
    },
    "pochi": {
      "type": "CLI Tool",
      "stars": 350,
      "active": true
    }
  },
  "education": {
    "degree": "B.S. Computer Science",
    "graduated": 2024
  },
  "links": {
    "github": "https://github.com/sma1lboy",
    "website": "https://sma1lboy.me"
  }
}`;

export default function JsonFormatter() {
  useSEO({
    title: "JSON Formatter",
    description:
      "Format, validate, and explore JSON with syntax highlighting, tree view, and byte size comparison.",
    path: "/apps/json",
  });

  const [input, setInput] = useState(SAMPLE_JSON);
  const [viewMode, setViewMode] = useState<ViewMode>("editor");
  const [copied, setCopied] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<{ before: number; after: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse result
  const parseResult = useMemo(() => {
    if (!input.trim()) return { valid: true, value: null, formatted: "", error: null, errorLine: -1 };
    try {
      const value = JSON.parse(input);
      const formatted = JSON.stringify(value, null, 2);
      return { valid: true, value, formatted, error: null, errorLine: -1 };
    } catch (err) {
      const info = extractErrorPosition(err);
      let errorLine = -1;
      if (info) {
        if (info.line > 0) {
          errorLine = info.line;
        } else if (info.column >= 0) {
          const lc = positionToLineCol(input, info.column);
          errorLine = lc.line;
        }
      }
      return {
        valid: false,
        value: null,
        formatted: input,
        error: info?.message || "Invalid JSON",
        errorLine,
      };
    }
  }, [input]);

  const lineCount = useMemo(() => {
    const text = viewMode === "editor" && parseResult.valid ? parseResult.formatted : input;
    return text.split("\n").length;
  }, [input, parseResult, viewMode]);

  const currentSize = useMemo(() => byteSize(input), [input]);

  const handleFormat = useCallback(() => {
    if (!parseResult.valid || !parseResult.value) return;
    const before = byteSize(input);
    const formatted = JSON.stringify(parseResult.value, null, 2);
    setInput(formatted);
    const after = byteSize(formatted);
    setSizeInfo({ before, after });
  }, [parseResult, input]);

  const handleMinify = useCallback(() => {
    if (!parseResult.valid || !parseResult.value) return;
    const before = byteSize(input);
    const minified = JSON.stringify(parseResult.value);
    setInput(minified);
    const after = byteSize(minified);
    setSizeInfo({ before, after });
  }, [parseResult, input]);

  const handleCopy = useCallback(() => {
    const text = parseResult.valid ? parseResult.formatted : input;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [parseResult, input]);

  // Clear size info when user manually edits
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setSizeInfo(null);
  }, []);

  // Sync textarea scroll with line numbers
  const lineNumRef = useRef<HTMLDivElement>(null);
  const handleTextareaScroll = useCallback(() => {
    if (textareaRef.current && lineNumRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Auto-resize textarea
  const textareaLines = input.split("\n").length;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/apps"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            JSON Formatter
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Format, validate, and explore JSON data
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {/* Action buttons */}
          <button
            onClick={handleFormat}
            disabled={!parseResult.valid}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Braces size={14} />
            Prettify
          </button>
          <button
            onClick={handleMinify}
            disabled={!parseResult.valid}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <Minimize2 size={14} />
            Minify
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status badge */}
          {input.trim() && (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                parseResult.valid
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {parseResult.valid ? (
                <>
                  <CheckCircle size={12} />
                  Valid JSON
                </>
              ) : (
                <>
                  <AlertCircle size={12} />
                  Invalid
                </>
              )}
            </div>
          )}

          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode("editor")}
              className={`inline-flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "editor"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Braces size={12} />
              Editor
            </button>
            <button
              onClick={() => setViewMode("tree")}
              disabled={!parseResult.valid}
              className={`inline-flex items-center gap-1.5 rounded-r-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                viewMode === "tree"
                  ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <TreePine size={12} />
              Tree
            </button>
          </div>
        </div>

        {/* Byte size info */}
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatBytes(currentSize)}</span>
          {sizeInfo && (
            <span className="text-gray-400 dark:text-gray-500">
              {formatBytes(sizeInfo.before)} → {formatBytes(sizeInfo.after)}{" "}
              <span
                className={
                  sizeInfo.after < sizeInfo.before
                    ? "text-green-500"
                    : sizeInfo.after > sizeInfo.before
                      ? "text-red-400"
                      : "text-gray-400"
                }
              >
                ({sizeInfo.after <= sizeInfo.before ? "−" : "+"}
                {Math.abs(
                  Math.round(
                    ((sizeInfo.after - sizeInfo.before) / sizeInfo.before) * 100,
                  ),
                )}
                %)
              </span>
            </span>
          )}
        </div>

        {/* Error message */}
        {!parseResult.valid && parseResult.error && (
          <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400">
            <span className="font-medium">Syntax Error: </span>
            {parseResult.error}
            {parseResult.errorLine > 0 && (
              <span className="ml-2 text-red-400 dark:text-red-500">
                (line {parseResult.errorLine})
              </span>
            )}
          </div>
        )}

        {/* Main editor / output area */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          {viewMode === "editor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200 dark:divide-gray-800">
              {/* Input pane */}
              <div className="relative">
                <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Input
                  </span>
                </div>
                <div className="flex overflow-auto" style={{ maxHeight: "70vh" }}>
                  <div
                    ref={lineNumRef}
                    className="shrink-0 overflow-hidden bg-gray-100 py-3 pl-2 dark:bg-gray-900"
                  >
                    <LineNumbers count={textareaLines} errorLine={parseResult.errorLine} />
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onScroll={handleTextareaScroll}
                    spellCheck={false}
                    className="flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600"
                    style={{ minHeight: Math.max(200, Math.min(textareaLines * 24, 600)) }}
                    placeholder="Paste JSON here..."
                  />
                </div>
              </div>

              {/* Output pane */}
              <div className="relative">
                <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Formatted Output
                  </span>
                </div>
                <div className="flex overflow-auto" style={{ maxHeight: "70vh" }}>
                  <div className="shrink-0 bg-gray-100 py-3 pl-2 dark:bg-gray-900">
                    <LineNumbers count={lineCount} errorLine={-1} />
                  </div>
                  <div className="flex-1 overflow-x-auto p-3">
                    {parseResult.valid && parseResult.formatted ? (
                      <Highlight
                        theme={themes.nightOwl}
                        code={parseResult.formatted}
                        language="json"
                      >
                        {({ tokens, getLineProps, getTokenProps }) => (
                          <pre className="font-mono text-sm leading-6">
                            {tokens.map((line, i) => (
                              <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                  <span key={key} {...getTokenProps({ token })} />
                                ))}
                              </div>
                            ))}
                          </pre>
                        )}
                      </Highlight>
                    ) : (
                      <pre className="font-mono text-sm leading-6 text-red-400 whitespace-pre-wrap">
                        {input}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tree view */
            <div>
              <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Tree View
                </span>
              </div>
              <div
                className="overflow-auto p-4 font-mono text-sm leading-6"
                style={{ maxHeight: "70vh" }}
              >
                {parseResult.valid && parseResult.value !== null ? (
                  <TreeNode value={parseResult.value} depth={0} defaultOpen />
                ) : (
                  <div className="text-gray-500 italic">
                    {input.trim() ? "Fix JSON errors to view tree" : "Paste JSON to view tree"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
