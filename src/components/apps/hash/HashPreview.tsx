import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const HASH_CHARS = "0123456789abcdef";
const LABELS = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

export default function HashPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Input text at top
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.6)";
      ctx.fillText("INPUT", 12, 14);

      const inputText = "Hello, World!";
      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(167, 139, 250, 0.8)";
      const charIdx = Math.floor(frame / 8) % (inputText.length + 5);
      const visibleText = inputText.slice(0, Math.min(charIdx, inputText.length));
      ctx.fillText(visibleText, 12, 26);

      // Blinking cursor
      if (frame % 30 < 15) {
        const cursorX = 12 + ctx.measureText(visibleText).width;
        ctx.fillStyle = "rgba(167, 139, 250, 0.6)";
        ctx.fillRect(cursorX, 18, 1, 10);
      }

      // Hash outputs
      const startY = 42;
      const lineH = 20;

      for (let i = 0; i < LABELS.length; i++) {
        const y = startY + i * lineH;

        // Label
        ctx.font = "bold 8px monospace";
        ctx.fillStyle = "rgba(96, 165, 250, 0.6)";
        ctx.fillText(LABELS[i], 12, y);

        // Hash characters that shift over time
        ctx.font = "9px monospace";
        let x = 52;
        const hashLen = i === 3 ? 18 : i === 2 ? 16 : 14;
        for (let j = 0; j < hashLen && x < W - 8; j++) {
          const charIndex = (frame + j * 3 + i * 7) % HASH_CHARS.length;
          const alpha = 0.3 + Math.sin((frame + j * 5 + i * 11) * 0.05) * 0.3;
          ctx.fillStyle = `rgba(52, 211, 153, ${alpha + 0.2})`;
          ctx.fillText(HASH_CHARS[charIndex], x, y);
          x += 8;
        }
      }

      frame++;
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas
        ref={canvasRef}
        className="rounded"
        style={{ width: W, height: H }}
      />
    </div>
  );
}
