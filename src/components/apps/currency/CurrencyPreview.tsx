import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const SYMBOLS = ["$", "\u20ac", "\u00a3", "\u00a5"];

export default function CurrencyPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;

    // Generate a fake rate line
    const points: number[] = [];
    let val = 0.85;
    for (let i = 0; i < 40; i++) {
      val += (Math.random() - 0.48) * 0.015;
      val = Math.max(0.78, Math.min(0.92, val));
      points.push(val);
    }

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("Currency", 12, 12);

      // Animated symbol
      const symbolIdx = Math.floor(frame / 90) % SYMBOLS.length;
      const progress = (frame % 90) / 90;
      const alpha =
        progress < 0.1
          ? progress / 0.1
          : progress > 0.9
            ? (1 - progress) / 0.1
            : 1;

      // Draw chart line
      const chartX = 20;
      const chartY = 30;
      const chartW = W - 40;
      const chartH = 50;
      const min = Math.min(...points);
      const max = Math.max(...points);
      const range = max - min || 0.01;

      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const visiblePts = Math.min(
        points.length,
        Math.floor(((frame % 90) / 90) * points.length) + 5,
      );
      for (let i = 0; i < visiblePts; i++) {
        const x = chartX + (i / (points.length - 1)) * chartW;
        const y = chartY + chartH - ((points[i] - min) / range) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill under
      const lastIdx = visiblePts - 1;
      const lastX = chartX + (lastIdx / (points.length - 1)) * chartW;
      ctx.lineTo(lastX, chartY + chartH);
      ctx.lineTo(chartX, chartY + chartH);
      ctx.closePath();
      ctx.fillStyle = "rgba(96, 165, 250, 0.08)";
      ctx.fill();

      // Symbol and rate
      ctx.globalAlpha = alpha;
      ctx.font = "bold 20px monospace";
      ctx.fillStyle = "#60a5fa";
      ctx.textAlign = "center";
      ctx.fillText(SYMBOLS[symbolIdx], W / 2 - 40, H - 12);

      ctx.font = "bold 10px monospace";
      ctx.fillStyle = "rgba(156, 163, 175, 0.7)";
      ctx.fillText(
        `1 USD = ${points[Math.min(visiblePts - 1, points.length - 1)].toFixed(4)} EUR`,
        W / 2 + 20,
        H - 12,
      );

      ctx.globalAlpha = 1;
      ctx.textAlign = "start";
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
