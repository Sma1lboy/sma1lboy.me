import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const WEATHER_ICONS = ["sun", "cloud", "rain", "snow"] as const;

function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, frame: number) {
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  const rayLen = r * 0.6;
  ctx.strokeStyle = "#facc15";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4 + frame * 0.01;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (r + 3), cy + Math.sin(angle) * (r + 3));
    ctx.lineTo(cx + Math.cos(angle) * (r + 3 + rayLen), cy + Math.sin(angle) * (r + 3 + rayLen));
    ctx.stroke();
  }
}

function drawCloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.fillStyle = "rgba(209, 213, 219, 0.8)";
  ctx.beginPath();
  ctx.arc(cx, cy, 8 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 10 * scale, cy - 4 * scale, 10 * scale, 0, Math.PI * 2);
  ctx.arc(cx + 22 * scale, cy, 8 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawRainDrop(ctx: CanvasRenderingContext2D, x: number, y: number, len: number) {
  ctx.strokeStyle = "rgba(96, 165, 250, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - 1, y + len);
  ctx.stroke();
}

function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export default function WeatherPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    const drops: { x: number; y: number; speed: number; len: number }[] = [];
    const flakes: {
      x: number;
      y: number;
      speed: number;
      r: number;
      drift: number;
    }[] = [];

    for (let i = 0; i < 20; i++) {
      drops.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 1 + Math.random() * 2,
        len: 4 + Math.random() * 6,
      });
    }
    for (let i = 0; i < 15; i++) {
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        speed: 0.3 + Math.random() * 0.7,
        r: 1 + Math.random() * 2,
        drift: (Math.random() - 0.5) * 0.5,
      });
    }

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const cycleLen = 180;
      const iconIdx = Math.floor(frame / cycleLen) % WEATHER_ICONS.length;
      const progress = (frame % cycleLen) / cycleLen;
      const alpha = progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;

      ctx.globalAlpha = alpha;

      const icon = WEATHER_ICONS[iconIdx];

      if (icon === "sun") {
        drawSun(ctx, W / 2, H / 2 - 5, 14, frame);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "rgba(250, 204, 21, 0.6)";
        ctx.fillText("72°F  Sunny", W / 2 - 30, H / 2 + 28);
      } else if (icon === "cloud") {
        drawCloud(ctx, W / 2 - 12, H / 2 - 8, 1.3);
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "rgba(209, 213, 219, 0.6)";
        ctx.fillText("58°F  Cloudy", W / 2 - 32, H / 2 + 28);
      } else if (icon === "rain") {
        drawCloud(ctx, W / 2 - 12, H / 2 - 18, 1.2);
        for (const drop of drops) {
          drawRainDrop(ctx, drop.x, drop.y, drop.len);
          drop.y += drop.speed;
          if (drop.y > H) {
            drop.y = H / 2 - 5;
            drop.x = W / 2 - 30 + Math.random() * 60;
          }
        }
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "rgba(96, 165, 250, 0.6)";
        ctx.fillText("45°F  Rain", W / 2 - 26, H / 2 + 38);
      } else if (icon === "snow") {
        drawCloud(ctx, W / 2 - 12, H / 2 - 18, 1.2);
        for (const flake of flakes) {
          drawSnowflake(ctx, flake.x, flake.y, flake.r);
          flake.y += flake.speed;
          flake.x += flake.drift + Math.sin(frame * 0.05 + flake.x) * 0.3;
          if (flake.y > H) {
            flake.y = H / 2 - 5;
            flake.x = W / 2 - 30 + Math.random() * 60;
          }
        }
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.fillText("28°F  Snow", W / 2 - 26, H / 2 + 38);
      }

      ctx.globalAlpha = 1;

      // Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("Weather", 12, 12);

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
