import { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Line, Rect, Ellipse } from "react-konva";
import type Konva from "konva";
import { motion } from "framer-motion";
import {
  Pencil,
  Eraser,
  Trash2,
  Undo2,
  Download,
  Square,
  CircleIcon,
  Minus,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type ToolType = "pen" | "eraser" | "rect" | "circle" | "line";

interface Stroke {
  tool: ToolType;
  points: number[];
  color: string;
  strokeWidth: number;
}

interface ShapeObj {
  tool: "rect" | "circle" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
}

type HistoryItem = { type: "stroke"; data: Stroke } | { type: "shape"; data: ShapeObj };

const PRESET_COLORS = [
  "#ffffff",
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#34d399",
  "#22d3ee",
  "#60a5fa",
  "#a78bfa",
  "#f472b6",
  "#e879f9",
  "#94a3b8",
];

const BRUSH_SIZES = [
  { label: "S", value: 2 },
  { label: "M", value: 5 },
  { label: "L", value: 10 },
  { label: "XL", value: 20 },
];

const MAX_UNDO = 20;

export default function DrawingCanvas() {
  useSEO({
    title: "Drawing Canvas",
    description: "Freehand drawing canvas with shapes, colors, and export.",
    path: "/apps/draw",
  });

  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(5);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<number[]>([]);
  const [shapeStart, setShapeStart] = useState<{ x: number; y: number } | null>(null);
  const [shapePreview, setShapePreview] = useState<ShapeObj | null>(null);

  // Resize canvas to fill container
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const isShapeTool = tool === "rect" || tool === "circle" || tool === "line";
  const effectiveColor = tool === "eraser" ? "#000000" : color;

  const handlePointerDown = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>) => {
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;
      setIsDrawing(true);

      if (isShapeTool) {
        setShapeStart({ x: pos.x, y: pos.y });
        setShapePreview(null);
      } else {
        setCurrentStroke([pos.x, pos.y]);
      }
    },
    [isShapeTool],
  );

  const handlePointerMove = useCallback(
    (e: Konva.KonvaEventObject<PointerEvent | MouseEvent | TouchEvent>) => {
      if (!isDrawing) return;
      const stage = e.target.getStage();
      const pos = stage?.getPointerPosition();
      if (!pos) return;

      if (isShapeTool && shapeStart) {
        setShapePreview({
          tool: tool as "rect" | "circle" | "line",
          x: shapeStart.x,
          y: shapeStart.y,
          width: pos.x - shapeStart.x,
          height: pos.y - shapeStart.y,
          color: effectiveColor,
          strokeWidth,
        });
      } else {
        setCurrentStroke((prev) => [...prev, pos.x, pos.y]);
      }
    },
    [isDrawing, isShapeTool, shapeStart, tool, effectiveColor, strokeWidth],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (isShapeTool && shapePreview) {
      setHistory((prev) => {
        const next = [...prev, { type: "shape" as const, data: shapePreview }];
        return next.slice(-MAX_UNDO);
      });
      setShapePreview(null);
      setShapeStart(null);
    } else if (currentStroke.length >= 4) {
      const stroke: Stroke = {
        tool: tool === "eraser" ? "eraser" : "pen",
        points: currentStroke,
        color: effectiveColor,
        strokeWidth,
      };
      setHistory((prev) => {
        const next = [...prev, { type: "stroke" as const, data: stroke }];
        return next.slice(-MAX_UNDO);
      });
    }
    setCurrentStroke([]);
  }, [isDrawing, isShapeTool, shapePreview, currentStroke, tool, effectiveColor, strokeWidth]);

  const handleUndo = useCallback(() => {
    setHistory((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setHistory([]);
  }, []);

  const handleDownload = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const uri = stage.toDataURL({ pixelRatio: 2 });
    const a = document.createElement("a");
    a.download = "drawing.png";
    a.href = uri;
    a.click();
  }, []);

  const toolButtons: {
    id: ToolType;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { id: "pen", icon: <Pencil size={18} />, label: "Pen" },
    { id: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
    { id: "rect", icon: <Square size={18} />, label: "Rectangle" },
    { id: "circle", icon: <CircleIcon size={18} />, label: "Circle" },
    { id: "line", icon: <Minus size={18} />, label: "Line" },
  ];

  return (
    <div className="flex h-screen flex-col bg-black">
      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-3 border-b border-gray-800 bg-gray-950 px-4 py-2"
      >
        <Breadcrumbs />

        {/* Divider */}
        <div className="h-6 w-px bg-gray-800" />

        {/* Tools */}
        <div className="flex items-center gap-1">
          {toolButtons.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              className={`rounded-md p-2 transition-colors ${
                tool === t.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-800" />

        {/* Brush sizes */}
        <div className="flex items-center gap-1">
          {BRUSH_SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStrokeWidth(s.value)}
              title={`Size ${s.label}`}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                strokeWidth === s.value
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-800" />

        {/* Color palette */}
        <div className="flex flex-wrap items-center gap-1">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (tool === "eraser") setTool("pen");
              }}
              className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-110 ${
                color === c && tool !== "eraser"
                  ? "border-white scale-110"
                  : "border-gray-700"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              if (tool === "eraser") setTool("pen");
            }}
            className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
            title="Custom color"
          />
        </div>

        <div className="h-6 w-px bg-gray-800" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo"
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Undo2 size={18} />
          </button>
          <button
            onClick={handleClear}
            title="Clear canvas"
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleDownload}
            title="Download PNG"
            className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-green-400"
          >
            <Download size={18} />
          </button>
        </div>
      </motion.div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 cursor-crosshair overflow-hidden">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{ touchAction: "none" }}
        >
          <Layer>
            {/* Rendered history */}
            {history.map((item, i) => {
              if (item.type === "stroke") {
                const s = item.data;
                return (
                  <Line
                    key={i}
                    points={s.points}
                    stroke={s.color}
                    strokeWidth={s.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      s.tool === "eraser" ? "destination-out" : "source-over"
                    }
                  />
                );
              }
              const sh = item.data;
              if (sh.tool === "rect") {
                return (
                  <Rect
                    key={i}
                    x={Math.min(sh.x, sh.x + sh.width)}
                    y={Math.min(sh.y, sh.y + sh.height)}
                    width={Math.abs(sh.width)}
                    height={Math.abs(sh.height)}
                    stroke={sh.color}
                    strokeWidth={sh.strokeWidth}
                  />
                );
              }
              if (sh.tool === "circle") {
                return (
                  <Ellipse
                    key={i}
                    x={sh.x + sh.width / 2}
                    y={sh.y + sh.height / 2}
                    radiusX={Math.abs(sh.width / 2)}
                    radiusY={Math.abs(sh.height / 2)}
                    stroke={sh.color}
                    strokeWidth={sh.strokeWidth}
                  />
                );
              }
              if (sh.tool === "line") {
                return (
                  <Line
                    key={i}
                    points={[sh.x, sh.y, sh.x + sh.width, sh.y + sh.height]}
                    stroke={sh.color}
                    strokeWidth={sh.strokeWidth}
                    lineCap="round"
                  />
                );
              }
              return null;
            })}

            {/* Current freehand stroke being drawn */}
            {!isShapeTool && currentStroke.length >= 4 && (
              <Line
                points={currentStroke}
                stroke={effectiveColor}
                strokeWidth={strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            )}

            {/* Shape preview while dragging */}
            {shapePreview && (
              <>
                {shapePreview.tool === "rect" && (
                  <Rect
                    x={Math.min(shapePreview.x, shapePreview.x + shapePreview.width)}
                    y={Math.min(shapePreview.y, shapePreview.y + shapePreview.height)}
                    width={Math.abs(shapePreview.width)}
                    height={Math.abs(shapePreview.height)}
                    stroke={shapePreview.color}
                    strokeWidth={shapePreview.strokeWidth}
                    dash={[6, 3]}
                  />
                )}
                {shapePreview.tool === "circle" && (
                  <Ellipse
                    x={shapePreview.x + shapePreview.width / 2}
                    y={shapePreview.y + shapePreview.height / 2}
                    radiusX={Math.abs(shapePreview.width / 2)}
                    radiusY={Math.abs(shapePreview.height / 2)}
                    stroke={shapePreview.color}
                    strokeWidth={shapePreview.strokeWidth}
                    dash={[6, 3]}
                  />
                )}
                {shapePreview.tool === "line" && (
                  <Line
                    points={[
                      shapePreview.x,
                      shapePreview.y,
                      shapePreview.x + shapePreview.width,
                      shapePreview.y + shapePreview.height,
                    ]}
                    stroke={shapePreview.color}
                    strokeWidth={shapePreview.strokeWidth}
                    dash={[6, 3]}
                    lineCap="round"
                  />
                )}
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
