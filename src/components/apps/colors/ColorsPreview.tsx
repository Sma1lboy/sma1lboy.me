import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

function hsvToRgbFast(h: number, s: number, v: number): [number, number, number] {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

export default function ColorsPreview() {
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

      const t = frame * 0.008;

      // Draw rotating color wheel
      const cx = 55;
      const cy = H / 2;
      const outerR = 32;
      const innerR = 20;
      const segments = 36;

      for (let i = 0; i < segments; i++) {
        const angle1 = (i / segments) * Math.PI * 2 + t;
        const angle2 = ((i + 1) / segments) * Math.PI * 2 + t;
        const hue = (i / segments) * 360;
        const [r, g, b] = hsvToRgbFast(hue, 0.85, 0.9);

        ctx.beginPath();
        ctx.arc(cx, cy, outerR, angle1, angle2);
        ctx.arc(cx, cy, innerR, angle2, angle1, true);
        ctx.closePath();
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fill();
      }

      // Inner circle dark fill
      ctx.beginPath();
      ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0a0a";
      ctx.fill();

      // Rotating picker dot on the wheel
      const dotAngle = t * 1.5;
      const dotR = (outerR + innerR) / 2;
      const dotX = cx + Math.cos(dotAngle) * dotR;
      const dotY = cy + Math.sin(dotAngle) * dotR;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw palette swatches on the right side
      const swatchX = 105;
      const swatchW = 18;
      const swatchH = 14;
      const gap = 4;
      const baseHue = ((dotAngle * 180) / Math.PI) % 360;
      const hues = [baseHue, baseHue + 120, baseHue + 240, baseHue + 180];
      const labels = ["BASE", "TRI", "TRI", "COMP"];

      for (let i = 0; i < hues.length; i++) {
        const y = 16 + i * (swatchH + gap);
        const hue = ((hues[i] % 360) + 360) % 360;
        const [r, g, b] = hsvToRgbFast(hue, 0.75, 0.85);

        // Swatch rect
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.roundRect(swatchX, y, swatchW, swatchH, 2);
        ctx.fill();

        // Hex text
        const hexStr =
          "#" +
          [r, g, b]
            .map((c) => c.toString(16).padStart(2, "0"))
            .join("")
            .toUpperCase()
            .slice(0, 6);
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(200,200,200,0.7)";
        ctx.fillText(hexStr, swatchX + swatchW + 5, y + 10);

        // Label
        ctx.font = "bold 6px monospace";
        ctx.fillStyle = "rgba(120,120,120,0.5)";
        ctx.fillText(labels[i], swatchX + swatchW + 56, y + 10);
      }

      // Contrast ratio display at bottom right
      const ratio = 4.5 + Math.sin(t * 0.7) * 3;
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = ratio >= 4.5 ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)";
      ctx.fillText(`${ratio.toFixed(1)}:1`, 145, H - 14);
      ctx.font = "7px monospace";
      ctx.fillStyle = "rgba(120,120,120,0.5)";
      ctx.fillText("WCAG", 175, H - 14);

      // Title
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(160,160,160,0.4)";
      ctx.fillText("COLOR PICKER", 108, H - 4);

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
