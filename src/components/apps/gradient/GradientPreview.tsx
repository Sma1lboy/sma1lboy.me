import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

export default function GradientPreview() {
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

      const t = frame * 0.012;

      // Animated gradient preview rectangle
      const rx = 16;
      const ry = 14;
      const rw = W - 32;
      const rh = H - 40;

      // Rotating angle for linear gradient
      const angle = t * 0.8;
      const cx = rx + rw / 2;
      const cy = ry + rh / 2;
      const len = Math.max(rw, rh);
      const dx = Math.cos(angle) * len;
      const dy = Math.sin(angle) * len;

      const grad = ctx.createLinearGradient(
        cx - dx / 2,
        cy - dy / 2,
        cx + dx / 2,
        cy + dy / 2,
      );

      // Shifting hue-based colors
      const hue1 = (frame * 0.5) % 360;
      const hue2 = (hue1 + 120) % 360;
      const hue3 = (hue1 + 240) % 360;

      grad.addColorStop(0, `hsl(${hue1}, 80%, 60%)`);
      grad.addColorStop(0.5, `hsl(${hue2}, 75%, 55%)`);
      grad.addColorStop(1, `hsl(${hue3}, 85%, 50%)`);

      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 6);
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw color stop markers at bottom
      const stops = [0, 0.5, 1];
      const hues = [hue1, hue2, hue3];
      for (let i = 0; i < stops.length; i++) {
        const sx = rx + stops[i] * rw;
        const sy = ry + rh + 10;

        // Small triangle pointing up
        ctx.beginPath();
        ctx.moveTo(sx, sy - 4);
        ctx.lineTo(sx - 4, sy + 3);
        ctx.lineTo(sx + 4, sy + 3);
        ctx.closePath();
        ctx.fillStyle = `hsl(${hues[i]}, 80%, 60%)`;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Direction arrow overlay
      const arrowLen = 16;
      const arrowX = cx;
      const arrowY = cy;
      const ax = Math.cos(angle) * arrowLen;
      const ay = Math.sin(angle) * arrowLen;

      ctx.beginPath();
      ctx.moveTo(arrowX - ax / 2, arrowY - ay / 2);
      ctx.lineTo(arrowX + ax / 2, arrowY + ay / 2);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arrow head
      const headAngle = Math.atan2(ay, ax);
      ctx.beginPath();
      ctx.moveTo(arrowX + ax / 2, arrowY + ay / 2);
      ctx.lineTo(
        arrowX + ax / 2 - 5 * Math.cos(headAngle - 0.5),
        arrowY + ay / 2 - 5 * Math.sin(headAngle - 0.5),
      );
      ctx.moveTo(arrowX + ax / 2, arrowY + ay / 2);
      ctx.lineTo(
        arrowX + ax / 2 - 5 * Math.cos(headAngle + 0.5),
        arrowY + ay / 2 - 5 * Math.sin(headAngle + 0.5),
      );
      ctx.stroke();

      // CSS text at bottom
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(160,160,160,0.4)";
      ctx.fillText("GRADIENT GEN", 108, H - 4);

      // Angle readout
      const degrees = Math.round(((angle * 180) / Math.PI) % 360);
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(200,200,200,0.6)";
      ctx.fillText(`${degrees}deg`, rx + 2, H - 4);

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
