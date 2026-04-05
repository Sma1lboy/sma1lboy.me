import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

export default function QrPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    // Generate a stable random grid for the QR pattern
    const gridSize = 11;
    const cellSize = 6;
    const offsetX = (W - gridSize * cellSize) / 2;
    const offsetY = (H - gridSize * cellSize) / 2;

    // Seed-based pseudo-random for consistent pattern
    const cells: boolean[][] = [];
    for (let r = 0; r < gridSize; r++) {
      cells[r] = [];
      for (let c = 0; c < gridSize; c++) {
        // Finder patterns (top-left, top-right, bottom-left corners)
        const inTopLeft = r < 3 && c < 3;
        const inTopRight = r < 3 && c >= gridSize - 3;
        const inBottomLeft = r >= gridSize - 3 && c < 3;
        if (inTopLeft || inTopRight || inBottomLeft) {
          // Solid border for finder patterns
          const isEdge =
            (inTopLeft && (r === 0 || r === 2 || c === 0 || c === 2)) ||
            (inTopRight && (r === 0 || r === 2 || c === gridSize - 1 || c === gridSize - 3)) ||
            (inBottomLeft && (r === gridSize - 1 || r === gridSize - 3 || c === 0 || c === 2));
          const isCenter =
            (inTopLeft && r === 1 && c === 1) ||
            (inTopRight && r === 1 && c === gridSize - 2) ||
            (inBottomLeft && r === gridSize - 2 && c === 1);
          cells[r][c] = isEdge || isCenter;
        } else {
          cells[r][c] = ((r * 7 + c * 13 + r * c) % 3) !== 0;
        }
      }
    }

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      // Label
      ctx.font = "bold 8px monospace";
      ctx.fillStyle = "rgba(107, 114, 128, 0.5)";
      ctx.fillText("QR CODE", 12, 12);

      // Draw QR grid with animated cells
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const x = offsetX + c * cellSize;
          const y = offsetY + r * cellSize;

          // Some cells flicker/shift over time for animation effect
          const isFinderRegion =
            (r < 3 && c < 3) || (r < 3 && c >= gridSize - 3) || (r >= gridSize - 3 && c < 3);

          let filled = cells[r][c];
          if (!isFinderRegion) {
            // Animate some data cells
            const phase = Math.sin((frame * 0.03) + r * 0.5 + c * 0.7);
            if (Math.abs(phase) > 0.85) {
              filled = !filled;
            }
          }

          if (filled) {
            const alpha = isFinderRegion
              ? 0.9
              : 0.5 + Math.sin((frame * 0.04) + r + c * 2) * 0.3;
            ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
            ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          } else {
            ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
            ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
          }
        }
      }

      // URL text at bottom
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(52, 211, 153, 0.5)";
      const urlText = "https://sma1lboy.me";
      const visibleLen = Math.min(Math.floor(frame / 6) % (urlText.length + 8), urlText.length);
      ctx.fillText(urlText.slice(0, visibleLen), 12, H - 8);

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
