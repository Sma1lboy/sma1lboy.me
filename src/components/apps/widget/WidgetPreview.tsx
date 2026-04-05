import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

export default function WidgetPreview() {
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

      // --- GitHub badge widget ---
      const badgeX = 16;
      const badgeY = 12;
      const badgeW = W - 32;
      const badgeH = 26;

      ctx.fillStyle = "#161b22";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 6);
      ctx.fill();

      // Star icon
      const starX = badgeX + 12;
      const starY = badgeY + badgeH / 2;
      const pulse = 1 + Math.sin(t * 2) * 0.15;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const r = i === 0 ? 5 * pulse : 5 * pulse;
        const x = starX + Math.cos(angle) * r;
        const y = starY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        const innerAngle = angle + (2 * Math.PI) / 10;
        const ir = 2.2 * pulse;
        ctx.lineTo(
          starX + Math.cos(innerAngle) * ir,
          starY + Math.sin(innerAngle) * ir,
        );
      }
      ctx.closePath();
      ctx.fill();

      // Repo text
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "#e6edf3";
      ctx.fillText("owner/repo", badgeX + 24, badgeY + 17);

      // Star count
      ctx.fillStyle = "#f59e0b";
      ctx.fillText("12.4k", badgeX + badgeW - 38, badgeY + 17);

      // --- Profile card widget ---
      const cardX = 16;
      const cardY = 46;
      const cardW = (W - 40) / 2;
      const cardH = 60;

      ctx.fillStyle = "#161b22";
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 6);
      ctx.fill();

      // Avatar circle
      const avatarX = cardX + cardW / 2;
      const avatarY = cardY + 16;
      const avatarR = 8;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarR, 0, Math.PI * 2);
      ctx.fillStyle = "#6366f1";
      ctx.fill();
      ctx.strokeStyle = "#818cf8";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Name placeholder
      ctx.fillStyle = "#e6edf3";
      ctx.fillRect(cardX + cardW / 2 - 18, cardY + 30, 36, 4);

      // Title placeholder
      ctx.fillStyle = "rgba(230,237,243,0.3)";
      ctx.fillRect(cardX + cardW / 2 - 14, cardY + 38, 28, 3);

      // Social links
      const dotColors = ["#6366f1", "#818cf8", "#a5b4fc"];
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = dotColors[i];
        ctx.beginPath();
        ctx.arc(cardX + cardW / 2 - 8 + i * 8, cardY + 50, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Counter widget ---
      const ctrX = cardX + cardW + 8;
      const ctrY = 46;
      const ctrW = cardW;
      const ctrH = 60;

      ctx.fillStyle = "#161b22";
      ctx.beginPath();
      ctx.roundRect(ctrX, ctrY, ctrW, ctrH, 6);
      ctx.fill();

      // Animated counter number
      const counterVal = Math.round(
        1234 * Math.min(1, (frame % 120) / 80),
      );
      const eased =
        counterVal >= 1234
          ? "1,234"
          : counterVal.toLocaleString();

      ctx.font = "bold 16px monospace";
      ctx.fillStyle = "#22c55e";
      const numWidth = ctx.measureText(eased).width;
      ctx.fillText(eased, ctrX + ctrW / 2 - numWidth / 2, ctrY + 30);

      // Label
      ctx.font = "8px sans-serif";
      ctx.fillStyle = "rgba(230,237,243,0.5)";
      const labelText = "Happy Users";
      const labelWidth = ctx.measureText(labelText).width;
      ctx.fillText(labelText, ctrX + ctrW / 2 - labelWidth / 2, ctrY + 45);

      // Bottom label
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(160,160,160,0.4)";
      ctx.fillText("WIDGET GEN", W - 72, H - 4);

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
