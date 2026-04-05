import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  ArrowRightLeft,
  Lock,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";

// --- Helpers ---

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n.toLocaleString()} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

// --- Codec implementations ---

function base64Encode(input: string): string {
  return btoa(
    new Uint8Array(new TextEncoder().encode(input)).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );
}

function base64Decode(input: string): string {
  const bytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function htmlEntitiesEncode(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return input.replace(/[&<>"']/g, (ch) => map[ch]);
}

function htmlEntitiesDecode(input: string): string {
  const map: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
  };
  return input.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, (entity) => map[entity] ?? entity);
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function jwtDecode(input: string): string {
  const parts = input.trim().split(".");
  if (parts.length !== 3) {
    return "Error: Invalid JWT — expected 3 dot-separated parts";
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return JSON.stringify({ header, payload }, null, 2);
  } catch {
    return "Error: Failed to decode JWT — invalid Base64 or JSON";
  }
}

// --- Tab definitions ---

type TabId = "base64" | "url" | "html" | "jwt";

interface TabDef {
  id: TabId;
  label: string;
  encodeOnly?: boolean;
  encode: (input: string) => string;
  decode: (input: string) => string;
}

const tabs: TabDef[] = [
  {
    id: "base64",
    label: "Base64",
    encode: base64Encode,
    decode: base64Decode,
  },
  {
    id: "url",
    label: "URL Encode",
    encode: encodeURIComponent,
    decode: decodeURIComponent,
  },
  {
    id: "html",
    label: "HTML Entities",
    encode: htmlEntitiesEncode,
    decode: htmlEntitiesDecode,
  },
  {
    id: "jwt",
    label: "JWT Decode",
    encodeOnly: true,
    encode: () => "",
    decode: jwtDecode,
  },
];

// --- Main Component ---

export default function EncoderDecoder() {
  useSEO({
    title: "Encoder / Decoder",
    description:
      "Multi-tool encoder/decoder with Base64, URL encoding, HTML entities, and JWT decode.",
    path: "/apps/encode",
  });

  const [activeTab, setActiveTab] = useState<TabId>("base64");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const tab = tabs.find((t) => t.id === activeTab)!;

  // Force decode mode for JWT
  const effectiveMode = tab.encodeOnly ? "decode" : mode;

  const output = useMemo(() => {
    if (!input) return "";
    try {
      return effectiveMode === "encode" ? tab.encode(input) : tab.decode(input);
    } catch {
      return `Error: Failed to ${effectiveMode} input`;
    }
  }, [input, effectiveMode, tab]);

  const inputBytes = useMemo(() => byteSize(input), [input]);
  const outputBytes = useMemo(() => byteSize(output), [output]);

  const handleCopy = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [output]);

  const handleTabSwitch = useCallback((id: TabId) => {
    setActiveTab(id);
    if (tabs.find((t) => t.id === id)?.encodeOnly) {
      setMode("decode");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Encoder / Decoder
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Base64, URL encoding, HTML entities, and JWT decode
          </p>
        </div>

        {/* Tab bar */}
        <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabSwitch(t.id)}
              className={`relative flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === t.id
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {activeTab === t.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-800"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Input / Output */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">
                {/* Input pane */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Input
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatBytes(inputBytes)}
                    </span>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    spellCheck={false}
                    className="min-h-[300px] flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600 sm:min-h-[400px]"
                    placeholder={
                      activeTab === "jwt"
                        ? "Paste a JWT token here (e.g. eyJhbGci...)"
                        : `Enter text to ${effectiveMode}...`
                    }
                  />
                </div>

                {/* Center controls */}
                <div className="flex items-center justify-center border-y border-gray-200 px-4 py-3 lg:flex-col lg:border-x lg:border-y-0 lg:py-0 dark:border-gray-800">
                  {tab.encodeOnly ? (
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                      <Lock size={14} />
                      Decode only
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setMode((m) => (m === "encode" ? "decode" : "encode"))
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowRightLeft size={14} />
                      {effectiveMode === "encode" ? "Encode →" : "← Decode"}
                    </button>
                  )}
                </div>

                {/* Output pane */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Output
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {formatBytes(outputBytes)}
                      </span>
                      <button
                        onClick={handleCopy}
                        disabled={!output}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      >
                        {copied ? (
                          <Check size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <pre className="min-h-[300px] flex-1 overflow-auto whitespace-pre-wrap break-all bg-transparent p-4 font-mono text-sm leading-6 text-gray-900 dark:text-gray-100 sm:min-h-[400px]">
                    {output || (
                      <span className="text-gray-400 dark:text-gray-600">
                        Output will appear here...
                      </span>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
