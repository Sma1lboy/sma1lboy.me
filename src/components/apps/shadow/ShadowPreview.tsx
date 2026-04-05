import { useRef, useEffect } from "react";

const W = 200;
const H = 120;

export default function ShadowPreview() {
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

      const t = frame * 0.02;

      // Animated shadow offset
      const ox = Math.sin(t) * 6;
      const oy = Math.cos(t * 0.7) * 4 + 4;
      const blur = 12 + Math.sin(t * 1.3) * 4;

      // Draw shadow (using circles for glow effect)
      const cx = W / 2;
      const cy = H / 2;
      const boxW = 48;
      const boxH = 36;

      // Shadow glow
      const gradient = ctx.createRadialGradient(
        cx + ox,
        cy + oy,
        0,
        cx + ox,
        cy + oy,
        blur + 20,
      );
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.35)");
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.12)");
      gradient.addColorStop(1, "rgba(139, 92, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        cx - boxW / 2 + ox - blur,
        cy - boxH / 2 + oy - blur,
        boxW + blur * 2,
        boxH + blur * 2,
        blur,
      );
      ctx.fill();

      // Main box
      ctx.fillStyle = "#e5e7eb";
      ctx.beginPath();
      ctx.roundRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH, 6);
      ctx.fill();

      // Small control indicators
      const indicatorY = cy + boxH / 2 + 14;
      for (let i = 0; i < 4; i++) {
        const ix = cx - 24 + i * 16;
        ctx.fillStyle = i === 0 ? "#8b5cf6" : "#4b5563";
        ctx.beginPath();
        ctx.roundRect(ix, indicatorY, 12, 3, 1.5);
        ctx.fill();
      }

      frame++;
    };

    draw();
    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="rounded" />
    </div>
  );
}
