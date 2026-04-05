import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

export default function RegexPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const sampleText = "hello world 2024 foo@bar.com";
    const patterns = [
      { re: /\d+/g, label: "\\d+" },
      { re: /\w+@\w+\.\w+/g, label: "email" },
      { re: /[a-z]+/g, label: "[a-z]+" },
      { re: /\b\w{5}\b/g, label: "\\b\\w{5}\\b" },
    ];

    let frame = 0;

    const draw = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      const t = frame * 0.015;
      const patIdx = Math.floor(t) % patterns.length;
      const pat = patterns[patIdx];

      // Draw regex pattern label at top
      ctx.font = "bold 9px monospace";
      ctx.fillStyle = "rgba(168, 85, 247, 0.8)";
      ctx.fillText(`/${pat.label}/g`, 10, 16);

      // Draw the sample text with highlight animation
      const charW = 6.5;
      const textY = 42;
      const textX = 10;

      // Find matches
      const matches: { start: number; end: number }[] = [];
      let m: RegExpExecArray | null;
      const re = new RegExp(pat.re.source, pat.re.flags);
      while ((m = re.exec(sampleText)) !== null) {
        matches.push({ start: m.index, end: m.index + m[0].length });
      }

      // Draw each character
      ctx.font = "10px monospace";
      for (let i = 0; i < sampleText.length; i++) {
        const x = textX + i * charW;

        // Check if this char is in a match
        let inMatch = false;
        for (const match of matches) {
          if (i >= match.start && i < match.end) {
            inMatch = true;
            break;
          }
        }

        if (inMatch) {
          // Animated highlight with pulsing opacity
          const pulse = 0.15 + 0.15 * Math.sin(t * 4 + i * 0.3);
          ctx.fillStyle = `rgba(34, 197, 94, ${pulse})`;
          ctx.fillRect(x - 1, textY - 10, charW + 1, 14);
          ctx.fillStyle = "rgba(34, 197, 94, 0.9)";
        } else {
          ctx.fillStyle = "rgba(180, 180, 180, 0.6)";
        }

        ctx.fillText(sampleText[i], x, textY);
      }

      // Draw scanning cursor line
      const cursorX = textX + ((frame * 1.5) % (sampleText.length * charW));
      ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cursorX, textY - 12);
      ctx.lineTo(cursorX, textY + 4);
      ctx.stroke();

      // Draw match info at bottom
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(120, 120, 120, 0.5)";
      ctx.fillText(`${matches.length} matches`, 10, 70);

      // Draw capture group boxes
      const boxY = 80;
      for (let i = 0; i < Math.min(matches.length, 4); i++) {
        const bx = 10 + i * 46;
        const text = sampleText.slice(matches[i].start, matches[i].end);
        const displayText = text.length > 5 ? text.slice(0, 5) + ".." : text;

        ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(bx, boxY, 42, 16, 2);
        ctx.stroke();

        ctx.font = "7px monospace";
        ctx.fillStyle = "rgba(34, 197, 94, 0.7)";
        ctx.fillText(displayText, bx + 3, boxY + 11);
      }

      // Title
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "rgba(160, 160, 160, 0.4)";
      ctx.fillText("REGEX TESTER", 120, H - 4);

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
