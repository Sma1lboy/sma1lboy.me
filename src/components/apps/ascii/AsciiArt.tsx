import { useState, useMemo, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Copy, Check, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";
import { renderAscii, FONTS, type FontStyle } from "./fonts";

const FONT_OPTIONS: { value: FontStyle; label: string; desc: string }[] = [
  { value: "block", label: "Standard Block", desc: "Bold █ ░ characters" },
  { value: "shadow", label: "Shadow", desc: "Block with ░ shadow depth" },
  { value: "slim", label: "Slim", desc: "Thin box-drawing lines" },
];

export default function AsciiArt() {
  useSEO({
    title: "ASCII Art Generator | sma1lboy",
    description:
      "Type text and see it rendered as large ASCII art with multiple font styles.",
  });

  const [text, setText] = useState("HELLO");
  const [font, setFont] = useState<FontStyle>("block");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => renderAscii(text, font), [text, font]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

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
            Back to Apps
          </Link>
          <div className="flex items-center gap-3">
            <Type size={24} className="text-gray-700 dark:text-gray-300" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
              ASCII Art Generator
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Type text and see it rendered as large ASCII art. Supports A-Z, 0-9,
            and common punctuation.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 space-y-4">
          {/* Text input */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something..."
              maxLength={40}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-lg text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-gray-600"
            />
          </div>

          {/* Font selector */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Font Style
            </label>
            <div className="flex flex-wrap gap-2">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFont(opt.value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    font === opt.value
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span className="block">{opt.label}</span>
                  <span className="block text-xs font-normal opacity-60">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="relative">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Output &middot; {FONTS[font].name} &middot; {FONTS[font].height}{" "}
              lines tall
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-30 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
            >
              {copied ? (
                <>
                  <Check size={12} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={12} />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-6 dark:border-gray-800">
            <AnimatePresence mode="wait">
              <motion.pre
                key={font + text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-sm leading-tight text-green-400 sm:text-base"
              >
                {output || (
                  <span className="text-gray-600">
                    Start typing to see ASCII art...
                  </span>
                )}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>

        {/* Copied toast */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-gray-100 dark:text-gray-900"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
