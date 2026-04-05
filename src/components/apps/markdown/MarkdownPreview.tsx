import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

export default function MarkdownPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;

    const lines = [
      { text: "# Hello World", color: "#60a5fa", x: 14 },
      { text: "**bold** and *italic*", color: "#a78bfa", x: 14 },
      { text: "- list item one", color: "#34d399", x: 14 },
      { text: "- list item two", color: "#34d399", x: 14 },
      { text: "> blockquote", color: "#fbbf24", x: 14 },
      { text: "`inline code`", color: "#f472b6", x: 14 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Divider line (editor | preview split)
      const divX = W * 0.48;
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(divX, 8);
      ctx.lineTo(divX, H - 8);
      ctx.stroke();

      // Left side: "editor" with raw markdown
      ctx.font = "10px monospace";
      lines.forEach((line, i) => {
        const y = 22 + i * 15;
        const progress = Math.min(1, Math.max(0, (frame - i * 12) / 20));
        const visibleChars = Math.floor(progress * line.text.length);
        const displayed = line.text.substring(0, visibleChars);

        ctx.globalAlpha = 0.5 + progress * 0.5;
        ctx.fillStyle = "#9ca3af";
        ctx.fillText(displayed, line.x, y);
      });

      // Right side: "preview" rendered look
      ctx.globalAlpha = 1;
      const rx = divX + 10;

      lines.forEach((line, i) => {
        const y = 22 + i * 15;
        const progress = Math.min(1, Math.max(0, (frame - i * 12 - 10) / 15));

        if (progress <= 0) return;

        ctx.globalAlpha = progress;
        ctx.fillStyle = line.color;

        if (i === 0) {
          // Heading - bigger, bold
          ctx.font = "bold 11px sans-serif";
          ctx.fillText("Hello World", rx, y);
        } else if (i === 1) {
          // Bold + italic
          ctx.font = "bold 9px sans-serif";
          ctx.fillText("bold", rx, y);
          ctx.font = "italic 9px sans-serif";
          ctx.fillText(" and italic", rx + 24, y);
        } else if (i === 2 || i === 3) {
          // List items with bullet
          ctx.font = "9px sans-serif";
          ctx.fillText("•", rx, y);
          ctx.fillText(i === 2 ? "list item one" : "list item two", rx + 10, y);
        } else if (i === 4) {
          // Blockquote with bar
          ctx.fillStyle = "#fbbf24";
          ctx.fillRect(rx, y - 8, 2, 10);
          ctx.font = "italic 9px sans-serif";
          ctx.fillText("blockquote", rx + 6, y);
        } else if (i === 5) {
          // Code with background
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(rx - 2, y - 9, 62, 12);
          ctx.fillStyle = "#f472b6";
          ctx.font = "9px monospace";
          ctx.fillText("inline code", rx, y);
        }
      });

      // Cursor blink on left side
      ctx.globalAlpha = 1;
      if (Math.floor(frame / 15) % 2 === 0) {
        const cursorLine = Math.min(Math.floor(frame / 12), lines.length - 1);
        const cursorY = 14 + cursorLine * 15;
        const charProgress = Math.min(1, Math.max(0, (frame - cursorLine * 12) / 20));
        const cursorX = 14 + Math.floor(charProgress * lines[cursorLine].text.length) * 6;

        ctx.fillStyle = "#60a5fa";
        ctx.fillRect(cursorX, cursorY, 1, 12);
      }

      frame++;

      // Loop animation
      if (frame > lines.length * 12 + 60) {
        frame = 0;
      }
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
