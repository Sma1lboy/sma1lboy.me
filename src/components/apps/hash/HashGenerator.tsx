import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Upload,
  FileText,
  X,
  Hash,
  GitCompareArrows,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { useSEO } from "@/hooks/useSEO";

// --- MD5 Implementation (RFC 1321) ---

function md5(input: string): string {
  const bytes = new TextEncoder().encode(input);
  return md5Bytes(bytes);
}

function md5Bytes(bytes: Uint8Array): string {
  function rotl(x: number, n: number) {
    return (x << n) | (x >>> (32 - n));
  }

  const K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
    0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
    0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
    0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
    0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
    0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23,
    4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
    6, 10, 15, 21,
  ];

  // Pre-processing: pad message
  const bitLen = bytes.length * 8;
  const padLen = bytes.length % 64 < 56 ? 56 - (bytes.length % 64) : 120 - (bytes.length % 64);
  const padded = new Uint8Array(bytes.length + padLen + 8);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  // Append length in bits as 64-bit little-endian
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bitLen >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let offset = 0; offset < padded.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(offset + j * 4, true);
    }

    let A = a0, B = b0, C = c0, D = d0;

    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }

      F = (F + A + K[i] + M[g]) >>> 0;
      A = D;
      D = C;
      C = B;
      B = (B + rotl(F, S[i])) >>> 0;
    }

    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }

  function toLittleEndianHex(n: number) {
    return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return toLittleEndianHex(a0) + toLittleEndianHex(b0) + toLittleEndianHex(c0) + toLittleEndianHex(d0);
}

// --- Web Crypto helpers ---

async function hashText(algorithm: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(hashBuffer);
}

async function hashBuffer(algorithm: string, buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
  return bufferToHex(hashBuffer);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// --- Types ---

interface HashResult {
  algorithm: string;
  hash: string;
}

type Mode = "generate" | "compare";

// --- CopyButton ---

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // clipboard denied — ignore
    });
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
      {copied ? (
        <Check size={12} className="text-green-500" />
      ) : (
        <Copy size={12} />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// --- Main Component ---

export default function HashGenerator() {
  useSEO({
    title: "Hash Generator",
    description:
      "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files. Compare and verify hashes.",
    path: "/apps/hash",
  });

  const [mode, setMode] = useState<Mode>("generate");
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<HashResult[]>([]);
  const [computing, setComputing] = useState(false);

  // File state
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  // Compare state
  const [compareHash, setCompareHash] = useState("");
  const [compareInput, setCompareInput] = useState("");
  const [compareResults, setCompareResults] = useState<
    { algorithm: string; hash: string; match: boolean }[]
  >([]);

  // Compute hashes for text input
  useEffect(() => {
    if (mode !== "generate" || fileBuffer) return;
    if (!input) {
      setHashes([]);
      return;
    }

    let cancelled = false;
    setComputing(true);

    const compute = async () => {
      const md5Hash = md5(input);
      const [sha1, sha256, sha512] = await Promise.all([
        hashText("SHA-1", input),
        hashText("SHA-256", input),
        hashText("SHA-512", input),
      ]);

      if (!cancelled) {
        setHashes([
          { algorithm: "MD5", hash: md5Hash },
          { algorithm: "SHA-1", hash: sha1 },
          { algorithm: "SHA-256", hash: sha256 },
          { algorithm: "SHA-512", hash: sha512 },
        ]);
        setComputing(false);
      }
    };

    compute();
    return () => { cancelled = true; };
  }, [input, mode, fileBuffer]);

  // Compute hashes for file
  useEffect(() => {
    if (mode !== "generate" || !fileBuffer) return;

    let cancelled = false;
    setComputing(true);

    const compute = async () => {
      const md5Hash = md5Bytes(new Uint8Array(fileBuffer));
      const [sha1, sha256, sha512] = await Promise.all([
        hashBuffer("SHA-1", fileBuffer),
        hashBuffer("SHA-256", fileBuffer),
        hashBuffer("SHA-512", fileBuffer),
      ]);

      if (!cancelled) {
        setHashes([
          { algorithm: "MD5", hash: md5Hash },
          { algorithm: "SHA-1", hash: sha1 },
          { algorithm: "SHA-256", hash: sha256 },
          { algorithm: "SHA-512", hash: sha512 },
        ]);
        setComputing(false);
      }
    };

    compute();
    return () => { cancelled = true; };
  }, [fileBuffer, mode]);

  // Compare mode computation
  useEffect(() => {
    if (mode !== "compare" || !compareInput || !compareHash.trim()) {
      setCompareResults([]);
      return;
    }

    let cancelled = false;
    const normalizedTarget = compareHash.trim().toLowerCase();

    const compute = async () => {
      const md5Hash = md5(compareInput);
      const [sha1, sha256, sha512] = await Promise.all([
        hashText("SHA-1", compareInput),
        hashText("SHA-256", compareInput),
        hashText("SHA-512", compareInput),
      ]);

      if (!cancelled) {
        setCompareResults([
          { algorithm: "MD5", hash: md5Hash, match: md5Hash === normalizedTarget },
          { algorithm: "SHA-1", hash: sha1, match: sha1 === normalizedTarget },
          { algorithm: "SHA-256", hash: sha256, match: sha256 === normalizedTarget },
          { algorithm: "SHA-512", hash: sha512, match: sha512 === normalizedTarget },
        ]);
      }
    };

    compute();
    return () => { cancelled = true; };
  }, [compareInput, compareHash, mode]);

  // File handling
  const handleFile = useCallback((file: File) => {
    setFileName(file.name);
    setInput("");
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setFileBuffer(reader.result);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const clearFile = useCallback(() => {
    setFileName(null);
    setFileBuffer(null);
    setHashes([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const anyMatch = compareResults.some((r) => r.match);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            Hash Generator
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate and compare MD5, SHA-1, SHA-256, and SHA-512 hashes
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900">
          {(
            [
              { id: "generate" as Mode, label: "Generate", icon: <Hash size={14} /> },
              { id: "compare" as Mode, label: "Compare", icon: <GitCompareArrows size={14} /> },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === tab.id
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {mode === tab.id && (
                <motion.div
                  layoutId="hashModeTab"
                  className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-800"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {mode === "generate" ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                {/* Text input */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {fileName ? "File" : "Text Input"}
                    </span>
                    {fileName && (
                      <button
                        onClick={clearFile}
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                      >
                        <X size={12} />
                        Clear file
                      </button>
                    )}
                  </div>

                  {fileName ? (
                    <div className="flex items-center gap-3 p-4">
                      <FileText size={20} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {fileName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fileBuffer
                            ? `${(fileBuffer.byteLength / 1024).toFixed(1)} KB`
                            : "Loading..."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      spellCheck={false}
                      className="min-h-[160px] w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600 sm:min-h-[200px]"
                      placeholder="Enter text to hash..."
                    />
                  )}
                </div>

                {/* File drop zone */}
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-b border-gray-200 px-4 py-3 transition-colors dark:border-gray-800 ${
                    dragging
                      ? "bg-blue-50 dark:bg-blue-950/30"
                      : "bg-transparent"
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <Upload
                      size={16}
                      className={`${dragging ? "text-blue-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {dragging
                        ? "Drop file here"
                        : "Drag & drop a file here, or"}
                    </span>
                    {!dragging && (
                      <>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          browse
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFile(file);
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Hash outputs */}
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {(hashes.length > 0 ? hashes : [
                    { algorithm: "MD5", hash: "" },
                    { algorithm: "SHA-1", hash: "" },
                    { algorithm: "SHA-256", hash: "" },
                    { algorithm: "SHA-512", hash: "" },
                  ]).map((result) => (
                    <div
                      key={result.algorithm}
                      className="flex items-start justify-between gap-4 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {result.algorithm}
                          </span>
                          {computing && result.hash === "" && (
                            <span className="text-xs text-gray-400">
                              computing...
                            </span>
                          )}
                        </div>
                        <p className="break-all font-mono text-xs leading-5 text-gray-900 dark:text-gray-100">
                          {result.hash || (
                            <span className="text-gray-400 dark:text-gray-600">
                              —
                            </span>
                          )}
                        </p>
                      </div>
                      {result.hash && <CopyButton text={result.hash} />}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                {/* Hash to compare */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Hash to Verify
                    </span>
                  </div>
                  <input
                    type="text"
                    value={compareHash}
                    onChange={(e) => setCompareHash(e.target.value)}
                    spellCheck={false}
                    className="w-full bg-transparent px-4 py-3 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600"
                    placeholder="Paste the hash you want to verify..."
                  />
                </div>

                {/* Original text */}
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Original Text
                    </span>
                  </div>
                  <textarea
                    value={compareInput}
                    onChange={(e) => setCompareInput(e.target.value)}
                    spellCheck={false}
                    className="min-h-[120px] w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600"
                    placeholder="Enter the original text..."
                  />
                </div>

                {/* Comparison results */}
                {compareResults.length > 0 && (
                  <div>
                    {/* Summary bar */}
                    <div
                      className={`border-b px-4 py-2 text-xs font-medium ${
                        anyMatch
                          ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
                          : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
                      }`}
                    >
                      {anyMatch
                        ? `Match found: ${compareResults.filter((r) => r.match).map((r) => r.algorithm).join(", ")}`
                        : "No match — hash does not correspond to any algorithm for this input"}
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                      {compareResults.map((result) => (
                        <div
                          key={result.algorithm}
                          className={`flex items-start justify-between gap-4 px-4 py-3 ${
                            result.match
                              ? "bg-green-50/50 dark:bg-green-950/20"
                              : ""
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                              <span
                                className={`text-xs font-semibold ${
                                  result.match
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-500 dark:text-red-400"
                                }`}
                              >
                                {result.algorithm}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                                  result.match
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                                    : "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300"
                                }`}
                              >
                                {result.match ? "Match" : "No match"}
                              </span>
                            </div>
                            <p className="break-all font-mono text-xs leading-5 text-gray-900 dark:text-gray-100">
                              {result.hash}
                            </p>
                          </div>
                          <CopyButton text={result.hash} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {compareResults.length === 0 && compareHash && compareInput && (
                  <div className="px-4 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                    Computing...
                  </div>
                )}

                {(compareResults.length === 0 && (!compareHash || !compareInput)) && (
                  <div className="px-4 py-8 text-center text-xs text-gray-400 dark:text-gray-500">
                    Enter both a hash and text above to verify
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
