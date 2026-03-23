import React from "react";
import { motion } from "framer-motion";

interface PaperCardProps {
  text: string;
  isPolished: boolean;
  preview?: boolean;
  rotation?: number;
}

export default function PaperCard({
  text,
  isPolished,
  preview = false,
  rotation = 0,
}: PaperCardProps) {
  if (preview) {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#fdfbf7] p-4 shadow-sm">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10"></div>
        <div className="mb-2 h-2 w-full rounded bg-gray-200 opacity-50"></div>
        <div className="mb-2 h-2 w-3/4 rounded bg-gray-200 opacity-50"></div>
        <div className="h-2 w-5/6 rounded bg-gray-200 opacity-50"></div>
      </div>
    );
  }

  return (
    <motion.div
      drag
      dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
      whileDrag={{ scale: 1.05, cursor: "grabbing", zIndex: 50 }}
      className="relative h-[300px] w-[210mm] cursor-grab overflow-hidden bg-[#fdfbf7] shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
      style={{
        boxShadow: "1px 1px 5px rgba(0,0,0,0.1), 5px 5px 20px rgba(0,0,0,0.05)",
        rotate: rotation,
      }}
    >
      {/* Paper Texture/Watermark effect */}
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-10"></div>

      {/* Header/Date (Visual) */}
      <div className="absolute top-8 right-8 font-serif text-sm text-[#999] italic opacity-50 select-none">
        {new Date().toLocaleDateString()}
      </div>

      <div
        className={`h-full w-full p-12 font-mono text-xl leading-loose whitespace-pre-wrap text-[#222] ${isPolished ? "font-serif text-[#1a1a1a]" : ""}`}
      >
        {text || <span className="italic opacity-20">The blank page awaits...</span>}
      </div>
    </motion.div>
  );
}
