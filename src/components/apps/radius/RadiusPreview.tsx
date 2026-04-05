import { useRef, useEffect } from "react";

const W = 200;
const H = 120;

export default function RadiusPreview() {
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

      const t = frame * 0.025;
      const cx = W / 2;
      const cy = H / 2 - 4;
      const size = 44;

      // Animated border-radius corners
      const tl = 10 + Math.sin(t) * 10;
      const tr = 10 + Math.sin(t + 1.5) * 10;
      const br = 10 + Math.sin(t + 3) * 10;
      const bl = 10 + Math.sin(t + 4.5) * 10;

      // Gradient fill
      const grad = ctx.createLinearGradient(
        cx - size / 2,
        cy - size / 2,
        cx + size / 2,
        cy + size / 2,
      );
      grad.addColorStop(0, "#06b6d4");
      grad.addColorStop(1, "#0891b2");

      // Draw shape with varying corner radii
      const x = cx - size / 2;
      const y = cy - size / 2;
      ctx.beginPath();
      ctx.moveTo(x + tl, y);
      ctx.lineTo(x + size - tr, y);
      ctx.arcTo(x + size, y, x + size, y + tr, tr);
      ctx.lineTo(x + size, y + size - br);
      ctx.arcTo(x + size, y + size, x + size - br, y + size, br);
      ctx.lineTo(x + bl, y + size);
      ctx.arcTo(x, y + size, x, y + size - bl, bl);
      ctx.lineTo(x, y + tl);
      ctx.arcTo(x, y, x + tl, y, tl);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Corner dots
      const corners = [
        { px: x, py: y, r: tl },
        { px: x + size, py: y, r: tr },
        { px: x + size, py: y + size, r: br },
        { px: x, py: y + size, r: bl },
      ];
      for (const c of corners) {
        const alpha = 0.4 + (c.r / 22) * 0.6;
        ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.beginPath();
        ctx.arc(c.px, c.py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Slider indicators at bottom
      const indicatorY = cy + size / 2 + 16;
      for (let i = 0; i < 4; i++) {
        const ix = cx - 24 + i * 16;
        ctx.fillStyle = i === Math.floor(frame / 30) % 4 ? "#06b6d4" : "#4b5563";
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
