import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const BASE = typeof window !== "undefined" ? window.location.origin : "";

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/thoughts.json",
    description: "All thoughts/notes, ordered newest-first.",
  },
  {
    method: "GET",
    path: "/api/projects.json",
    description: "Featured projects with title, description, tech stack, and URLs.",
  },
];

function EndpointRow({ ep, index }: { ep: Endpoint; index: number }) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = `${BASE}${ep.path}`;

  const tryIt = useCallback(async () => {
    if (response) {
      setResponse(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(ep.path);
      const json = await res.json();
      setResponse(JSON.stringify(json, null, 2));
    } catch {
      setResponse("// Error fetching endpoint");
    }
    setLoading(false);
  }, [ep.path, response]);

  const copyUrl = useCallback(() => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [fullUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: 0.15 + index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="py-5"
    >
      {/* Method + path row */}
      <div className="flex items-center gap-2.5">
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          {ep.method}
        </span>
        <code className="text-sm text-gray-900 dark:text-gray-100">{ep.path}</code>
      </div>

      {/* Description */}
      <p className="mt-1.5 text-[13px] text-gray-500 dark:text-gray-400">{ep.description}</p>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={tryIt}
          disabled={loading}
          className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-100"
        >
          {loading ? "Fetching..." : response ? "Collapse" : "Try it →"}
        </button>
        <button
          onClick={copyUrl}
          className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <a
          href={ep.path}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <ArrowUpRight size={10} />
          Raw
        </a>
      </div>

      {/* Response */}
      {response && (
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="mt-3 max-h-56 overflow-auto rounded-md bg-gray-50 p-3 font-mono text-[11px] leading-relaxed text-gray-600 dark:bg-gray-900/50 dark:text-gray-400"
        >
          {response}
        </motion.pre>
      )}
    </motion.div>
  );
}

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
        {live === null ? "Checking..." : live ? "Operational" : "Degraded"}
      </span>
    </span>
  );
}

export default function ApiPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-xl px-6 py-12 sm:py-20">
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
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">API</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Public JSON endpoints. No auth. CORS enabled.
          </p>
          <div className="mt-2.5 flex items-center gap-4">
            <StatusDot />
            <code className="text-xs text-gray-400 dark:text-gray-500">
              {BASE || "https://sma1lboy.me"}
            </code>
          </div>
        </motion.header>

        {/* Endpoints */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800/60">
          {endpoints.map((ep, i) => (
            <EndpointRow key={ep.path} ep={ep} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
