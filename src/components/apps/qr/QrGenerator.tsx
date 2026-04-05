import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check, QrCode } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import QRCode from "qrcode";

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export default function QrGenerator() {
  useSEO({
    title: "QR Code Generator",
    description:
      "Generate QR codes from text or URLs with custom colors. Download as PNG.",
    path: "/apps/qr",
  });

  const [input, setInput] = useState("https://sma1lboy.me");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [ecLevel, setEcLevel] = useState<ErrorCorrectionLevel>("M");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render QR code to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!input.trim()) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = "rgba(156, 163, 175, 0.5)";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Enter text to generate", 128, 128);
      }
      return;
    }

    QRCode.toCanvas(canvas, input, {
      width: 256,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: ecLevel,
    }).catch(() => {
      // Input too long or invalid — ignore
    });
  }, [input, fgColor, bgColor, ecLevel]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !input.trim()) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [input]);

  const handleCopy = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !input.trim()) return;

    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Clipboard API not supported or denied
    }
  }, [input]);

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
            QR Code Generator
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Generate QR codes from text or URLs with custom colors
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Input panel */}
            <div className="flex-1 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
              {/* Text input */}
              <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="border-b border-gray-200 px-4 py-2 dark:border-gray-800">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Text / URL
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  spellCheck={false}
                  className="min-h-[120px] w-full resize-none bg-transparent p-4 font-mono text-sm leading-6 text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-600"
                  placeholder="Enter text or URL..."
                />
              </div>

              {/* Options */}
              <div className="space-y-4 p-4">
                {/* Color pickers */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Foreground
                    </label>
                    <div className="relative">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-gray-200 bg-transparent dark:border-gray-700"
                      />
                    </div>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {fgColor}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Background
                    </label>
                    <div className="relative">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border border-gray-200 bg-transparent dark:border-gray-700"
                      />
                    </div>
                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                      {bgColor}
                    </span>
                  </div>
                </div>

                {/* Error correction level */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-gray-400">
                    Error Correction
                  </label>
                  <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900">
                    {(["L", "M", "Q", "H"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setEcLevel(level)}
                        className={`relative flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                          ecLevel === level
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                      >
                        {ecLevel === level && (
                          <motion.div
                            layoutId="ecLevelTab"
                            className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-800"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.4,
                            }}
                          />
                        )}
                        <span className="relative z-10">{level}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                    L = 7% recovery · M = 15% · Q = 25% · H = 30%
                  </p>
                </div>
              </div>
            </div>

            {/* QR code output panel */}
            <div className="flex flex-col items-center gap-4 lg:w-[320px]">
              <div className="flex w-full flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-950">
                <div className="mb-4 flex items-center gap-2">
                  <QrCode size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Preview
                  </span>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700">
                  <canvas ref={canvasRef} style={{ width: 256, height: 256 }} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex w-full gap-2">
                <button
                  onClick={handleDownload}
                  disabled={!input.trim()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
                >
                  <Download size={14} />
                  Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!input.trim()}
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-100 dark:hover:bg-gray-900"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
