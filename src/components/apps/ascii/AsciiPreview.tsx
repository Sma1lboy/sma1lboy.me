import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

// Simple block-pixel font for preview — only need "ASCII" and a cursor
const LETTERS: Record<string, number[][]> = {
  A: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [1, 1, 0],
  ],
  C: [
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [0, 1, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
};

export default function AsciiPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    let frame = 0;
    const word = "ASCII";
    const cellSize = 4;
    const gap = 2;
    const charW = 3 * cellSize + gap;
    const totalW = word.length * charW - gap;
    const startX = (W - totalW) / 2;
    const startY = (H - 5 * cellSize) / 2 - 6;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const t = frame * 0.03;

      // Draw each letter
      for (let li = 0; li < word.length; li++) {
        const letter = LETTERS[word[li]];
        if (!letter) continue;
        const ox = startX + li * charW;
        const oy = startY;

        // Color cycling per letter
        const hue = (frame * 0.8 + li * 50) % 360;

        for (let row = 0; row < letter.length; row++) {
          for (let col = 0; col < letter[row].length; col++) {
            if (letter[row][col]) {
              const x = ox + col * cellSize;
              const y = oy + row * cellSize;
              // Slight wave
              const wave = Math.sin(t + li * 0.5 + row * 0.3) * 2;
              ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
              ctx.fillRect(x, y + wave, cellSize - 1, cellSize - 1);
            }
          }
        }
      }

      // Blinking cursor after text
      if (Math.floor(frame / 15) % 2 === 0) {
        const cursorX = startX + word.length * charW + 2;
        const cursorY = startY;
        ctx.fillStyle = "rgba(74, 222, 128, 0.8)";
        ctx.fillRect(cursorX, cursorY, 2, 5 * cellSize);
      }

      // Simulated input field at bottom
      const fieldY = startY + 5 * cellSize + 12;
      ctx.strokeStyle = "rgba(100, 100, 100, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(startX - 4, fieldY, totalW + 12, 16, 3);
      } else {
        ctx.rect(startX - 4, fieldY, totalW + 12, 16);
      }
      ctx.stroke();

      // "Type here..." text
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
      ctx.fillText("Type text...", startX, fieldY + 11);

      // Label
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(160, 160, 160, 0.4)";
      ctx.fillText("ASCII ART", W - 60, H - 5);

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
