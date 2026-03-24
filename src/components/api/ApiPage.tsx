import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Copy, Globe } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const BASE = typeof window !== "undefined" ? window.location.origin : "";

interface Endpoint {
  method: string;
  path: string;
  description: string;
  example: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/thoughts.json",
    description: "Returns all thoughts/notes as a JSON array, ordered newest-first.",
    example: "thoughts",
  },
  {
    method: "GET",
    path: "/api/projects.json",
    description: "Returns featured projects with title, description, tech stack, and URLs.",
    example: "projects",
  },
];

function EndpointCard({ ep, index }: { ep: Endpoint; index: number }) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `${BASE}${ep.path}`;

  const tryIt = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(ep.path);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch {
      setResponse("// Error fetching endpoint");
    }
    setLoading(false);
  }, [ep.path]);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [fullUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.15 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800/60">
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            {ep.method}
          </span>
          <code className="text-sm font-medium text-gray-800 dark:text-gray-200">{ep.path}</code>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <a
            href={ep.path}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <ArrowUpRight size={12} />
            Open
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{ep.description}</p>

        <button
          onClick={tryIt}
          disabled={loading}
          className="mb-3 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-gray-400 hover:text-gray-900 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:text-gray-100"
        >
          {loading ? "Fetching..." : "Try it"}
        </button>

        {response && (
          <motion.pre
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="max-h-64 overflow-auto rounded-md bg-gray-50 p-4 text-xs leading-relaxed text-gray-700 dark:bg-gray-900 dark:text-gray-300"
          >
            {response}
          </motion.pre>
        )}
      </div>
    </motion.div>
  );
}

// Live status indicator
function StatusDot() {
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/thoughts.json")
      .then((r) => setLive(r.ok))
      .catch(() => setLive(false));
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          live === null ? "bg-gray-300 dark:bg-gray-600" : live ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      <span className="text-gray-400 dark:text-gray-500">
        {live === null ? "Checking..." : live ? "All systems operational" : "Degraded"}
      </span>
    </span>
  );
}

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-gray-700 dark:text-gray-300" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API</h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Public JSON endpoints for sma1lboy.me data. No auth required. CORS enabled.
          </p>
          <div className="mt-3">
            <StatusDot />
          </div>
        </motion.header>

        {/* Base URL */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8 rounded-lg border border-gray-100 bg-gray-50 px-5 py-3 dark:border-gray-800 dark:bg-gray-900"
        >
          <span className="text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-gray-500">
            Base URL
          </span>
          <code className="mt-1 block text-sm text-gray-800 dark:text-gray-200">
            {BASE || "https://sma1lboy.me"}
          </code>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-5">
          {endpoints.map((ep, i) => (
            <EndpointCard key={ep.path} ep={ep} index={i} />
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center text-xs text-gray-400 dark:text-gray-600"
        >
          Data is served as static JSON. Refresh for latest updates.
        </motion.p>
      </div>
    </div>
  );
}
