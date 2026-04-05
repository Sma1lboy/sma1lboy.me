import { useEffect, useRef } from "react";

const W = 200;
const H = 120;

const PASTEL = [
  "#fef3c7",
  "#fce7f3",
  "#dbeafe",
  "#d1fae5",
  "#ede9fe",
  "#fef9c3",
  "#ffe4e6",
  "#e0f2fe",
  "#f3e8ff",
  "#ccfbf1",
];

interface NoteState {
  col: number;
  row: number;
  color: string;
  targetCol: number;
  transitioning: boolean;
  x: number;
  y: number;
}

function randomPastel(): string {
  return PASTEL[Math.floor(Math.random() * PASTEL.length)];
}

export default function KanbanPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const COL_W = 58;
    const COL_GAP = 8;
    const CARD_W = 48;
    const CARD_H = 14;
    const CARD_GAP = 4;
    const HEADER_H = 16;
    const COL_X = (i: number) => 10 + i * (COL_W + COL_GAP);
    const CARD_X = (col: number) => COL_X(col) + (COL_W - CARD_W) / 2;
    const CARD_Y = (row: number) => 12 + HEADER_H + row * (CARD_H + CARD_GAP);

    // Initialize notes
    const notes: NoteState[] = [];
    const colCounts = [3, 2, 2];
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < colCounts[col]; row++) {
        notes.push({
          col,
          row,
          color: randomPastel(),
          targetCol: col,
          transitioning: false,
          x: CARD_X(col),
          y: CARD_Y(row),
        });
      }
    }

    function getColCards(colIdx: number) {
      return notes
        .filter((n) => n.col === colIdx && !n.transitioning)
        .sort((a, b) => a.row - b.row);
    }

    function startTransition() {
      // Pick a random non-transitioning card and move it to a different column
      const candidates = notes.filter((n) => !n.transitioning);
      if (candidates.length === 0) return;
      const note = candidates[Math.floor(Math.random() * candidates.length)];
      const possibleCols = [0, 1, 2].filter((c) => c !== note.col);
      const targetCol =
        possibleCols[Math.floor(Math.random() * possibleCols.length)];

      note.transitioning = true;
      note.targetCol = targetCol;
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Background
      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, W, H);

      // Draw columns
      for (let i = 0; i < 3; i++) {
        const x = COL_X(i);
        ctx!.fillStyle = "rgba(255,255,255,0.03)";
        ctx!.beginPath();
        ctx!.roundRect(x, 8, COL_W, H - 16, 4);
        ctx!.fill();

        // Column header line
        ctx!.fillStyle = "rgba(255,255,255,0.15)";
        ctx!.fillRect(x + 6, 14, 30, 3);

        // Card count dot
        const count = notes.filter(
          (n) => n.col === i && !n.transitioning,
        ).length;
        ctx!.fillStyle = "rgba(255,255,255,0.1)";
        ctx!.beginPath();
        ctx!.arc(x + COL_W - 10, 16, 5, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = "rgba(255,255,255,0.3)";
        ctx!.font = "7px sans-serif";
        ctx!.textAlign = "center";
        ctx!.fillText(String(count), x + COL_W - 10, 18.5);
      }

      // Draw cards
      for (const note of notes) {
        ctx!.fillStyle = note.color;
        ctx!.globalAlpha = note.transitioning ? 0.8 : 1;
        ctx!.beginPath();
        ctx!.roundRect(note.x, note.y, CARD_W, CARD_H, 3);
        ctx!.fill();

        // Subtle shadow
        ctx!.fillStyle = "rgba(0,0,0,0.08)";
        ctx!.beginPath();
        ctx!.roundRect(note.x + 1, note.y + 1, CARD_W, CARD_H, 3);
        ctx!.fill();

        // Re-draw card on top of shadow
        ctx!.fillStyle = note.color;
        ctx!.beginPath();
        ctx!.roundRect(note.x, note.y, CARD_W, CARD_H, 3);
        ctx!.fill();

        // Text lines on card
        ctx!.fillStyle = "rgba(0,0,0,0.15)";
        ctx!.fillRect(note.x + 4, note.y + 4, CARD_W * 0.6, 2);
        ctx!.fillRect(note.x + 4, note.y + 8, CARD_W * 0.4, 2);

        ctx!.globalAlpha = 1;
      }
    }

    let frame = 0;

    function tick() {
      frame++;

      // Start a transition every ~90 frames (~1.5s at 60fps)
      if (frame % 90 === 0) {
        startTransition();
      }

      // Animate transitioning notes
      for (const note of notes) {
        if (!note.transitioning) continue;

        const targetCards = getColCards(note.targetCol);
        const targetRow = targetCards.length;
        const tx = CARD_X(note.targetCol);
        const ty = CARD_Y(targetRow);

        const dx = tx - note.x;
        const dy = ty - note.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
          // Arrived
          const oldCol = note.col;
          note.col = note.targetCol;
          note.row = targetRow;
          note.x = tx;
          note.y = ty;
          note.transitioning = false;

          // Re-index old column
          const oldCards = getColCards(oldCol);
          oldCards.forEach((n, i) => {
            n.row = i;
          });
        } else {
          const speed = 2.5;
          note.x += (dx / dist) * speed;
          note.y += (dy / dist) * speed;
        }
      }

      // Snap non-transitioning cards to their proper positions
      for (const note of notes) {
        if (note.transitioning) continue;
        const tx = CARD_X(note.col);
        const ty = CARD_Y(note.row);
        note.x += (tx - note.x) * 0.15;
        note.y += (ty - note.y) * 0.15;
      }

      draw();
    }

    draw();
    const interval = setInterval(tick, 1000 / 60);
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
