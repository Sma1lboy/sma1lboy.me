import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const COLORS = [
  "rgba(96, 165, 250, 0.9)",
  "rgba(248, 113, 113, 0.9)",
  "rgba(52, 211, 153, 0.9)",
  "rgba(250, 204, 21, 0.9)",
  "rgba(167, 139, 250, 0.9)",
];

// Pre-defined brush strokes as bezier-like point arrays
const STROKES: { color: number; points: [number, number][] }[] = [
  {
    color: 0,
    points: [
      [30, 60],
      [50, 30],
      [80, 50],
      [110, 25],
      [140, 55],
      [170, 40],
    ],
  },
  {
    color: 1,
    points: [
      [40, 90],
      [70, 70],
      [100, 95],
      [130, 75],
      [160, 90],
    ],
  },
  {
    color: 2,
    points: [
      [60, 40],
      [80, 80],
      [100, 40],
      [120, 80],
      [140, 40],
    ],
  },
];

export default function DrawPreview() {
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

      // Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("DRAW", 12, 12);

      // Animate strokes being drawn
      const totalFramesPerStroke = 60;
      const cycleLen = STROKES.length * totalFramesPerStroke + 30;
      const t = frame % cycleLen;

      for (let si = 0; si < STROKES.length; si++) {
        const strokeStart = si * totalFramesPerStroke;
        const elapsed = t - strokeStart;
        if (elapsed < 0) continue;

        const s = STROKES[si];
        const progress = Math.min(elapsed / totalFramesPerStroke, 1);
        const pts = s.points;
        const drawCount = Math.floor(progress * (pts.length - 1));

        ctx.beginPath();
        ctx.strokeStyle = COLORS[s.color];
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i <= drawCount; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }

        // Partial segment for smooth animation
        if (drawCount < pts.length - 1) {
          const frac = (progress * (pts.length - 1)) % 1;
          const a = pts[drawCount];
          const b = pts[drawCount + 1];
          ctx.lineTo(a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac);
        }

        ctx.stroke();
      }

      // Cursor
      const activeStroke = Math.min(Math.floor(t / totalFramesPerStroke), STROKES.length - 1);
      if (t < STROKES.length * totalFramesPerStroke) {
        const s = STROKES[activeStroke];
        const localT = (t - activeStroke * totalFramesPerStroke) / totalFramesPerStroke;
        const idx = Math.min(Math.floor(localT * (s.points.length - 1)), s.points.length - 2);
        const frac = (localT * (s.points.length - 1)) % 1;
        const a = s.points[idx];
        const b = s.points[idx + 1];
        const cx = a[0] + (b[0] - a[0]) * frac;
        const cy = a[1] + (b[1] - a[1]) * frac;

        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.fill();
      }

      // Bottom text
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(96, 165, 250, 0.5)";
      ctx.fillText("freehand + shapes", 12, H - 8);

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
