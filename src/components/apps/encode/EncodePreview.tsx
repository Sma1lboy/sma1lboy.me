import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const CHARS_PLAIN = 'Hello, World! <html>&amp;"encode"';
const CHARS_ENCODED = "SGVsbG8sIFdvcmxkIQ== %3Chtml%3E &amp;quot;";

export default function EncodePreview() {
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

      const t = frame / 120; // cycle period
      const phase = t % 2; // 0-1: encode, 1-2: decode

      // Draw input label
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.6)";
      ctx.fillText("INPUT", 12, 18);
      ctx.fillText("OUTPUT", 12, H / 2 + 18);

      // Divider line
      ctx.strokeStyle = "rgba(75, 85, 99, 0.3)";
      ctx.beginPath();
      ctx.moveTo(10, H / 2 + 2);
      ctx.lineTo(W - 10, H / 2 + 2);
      ctx.stroke();

      // Arrow in center
      const arrowY = H / 2 + 2;
      const arrowProgress = Math.sin(phase * Math.PI) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(96, 165, 250, ${0.3 + arrowProgress * 0.5})`;
      const arrowX = W / 2;
      ctx.beginPath();
      if (phase < 1) {
        // Encode arrow pointing down
        ctx.moveTo(arrowX - 6, arrowY - 5);
        ctx.lineTo(arrowX + 6, arrowY - 5);
        ctx.lineTo(arrowX, arrowY + 3);
      } else {
        // Decode arrow pointing up
        ctx.moveTo(arrowX - 6, arrowY + 5);
        ctx.lineTo(arrowX + 6, arrowY + 5);
        ctx.lineTo(arrowX, arrowY - 3);
      }
      ctx.fill();

      // Characters morphing in input area
      const morphProgress = Math.min(1, (phase % 1) * 2);

      ctx.font = "11px monospace";

      // Input text
      const inputText = phase < 1 ? CHARS_PLAIN : CHARS_ENCODED;
      let x = 12;
      const y1 = 36;
      for (let i = 0; i < inputText.length && x < W - 10; i++) {
        const ch = inputText[i];
        const hue = (i * 37) % 360;
        ctx.fillStyle = `hsla(${hue}, 60%, 70%, 0.8)`;
        ctx.fillText(ch, x, y1);
        x += ctx.measureText(ch).width;
      }

      // Output text with morph effect
      const outputText = phase < 1 ? CHARS_ENCODED : CHARS_PLAIN;
      x = 12;
      const y2 = H / 2 + 36;
      for (let i = 0; i < outputText.length && x < W - 10; i++) {
        const ch = outputText[i];
        const hue = (i * 53 + 120) % 360;
        const alpha = 0.3 + morphProgress * 0.6;
        ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${alpha})`;
        const jitter = (1 - morphProgress) * (Math.sin(i * 2 + frame * 0.1) * 3);
        ctx.fillText(ch, x, y2 + jitter);
        x += ctx.measureText(ch).width;
      }

      // Mode label
      ctx.font = "bold 8px monospace";
      const modeLabel = phase < 1 ? "ENCODE" : "DECODE";
      const modeColor = phase < 1 ? "rgba(34, 197, 94, 0.7)" : "rgba(251, 146, 60, 0.7)";
      ctx.fillStyle = modeColor;
      const labelW = ctx.measureText(modeLabel).width;
      ctx.fillText(modeLabel, W - labelW - 10, 18);

      frame++;
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="rounded" style={{ width: W, height: H }} />
    </div>
  );
}
