import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

const galleryImages = [
  { src: "/images/pochi-preview.png", caption: "Pochi — AI coding teammate" },
  { src: "/images/tabby-preview.png", caption: "TabbyML — self-hosted AI coding assistant" },
  { src: "/images/foxychat-preview.png", caption: "FoxyChat — cross-platform AI chat" },
  { src: "/images/taskforge-preview.png", caption: "TaskForge — full-stack task management" },
  { src: "/images/personal-preview.png", caption: "This site — sma1lboy.me" },
];

export function ImageGallery() {
  const [index, setIndex] = useState(0);

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1));
  }, []);

  const next = useCallback(() => {
    setIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1));
  }, []);

  const current = galleryImages[index];

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center p-6 md:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.caption}
            className="w-full object-contain"
            style={{ maxHeight: "60vh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>

      <p className="mt-4 text-center text-xs" style={{ color: "#888888" }}>
        {current.caption}
      </p>

      <div className="mt-4 flex items-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous image"
          className="text-xl transition-colors duration-150 focus-visible:outline-none"
          style={{ color: "#666666" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
          onFocus={(e) => (e.currentTarget.style.color = "#ffffff")}
          onBlur={(e) => (e.currentTarget.style.color = "#666666")}
        >
          &larr;
        </button>
        <span className="text-[11px]" style={{ color: "#666666" }}>
          {index + 1} / {galleryImages.length}
        </span>
        <button
          onClick={next}
          aria-label="Next image"
          className="text-xl transition-colors duration-150 focus-visible:outline-none"
          style={{ color: "#666666" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#666666")}
          onFocus={(e) => (e.currentTarget.style.color = "#ffffff")}
          onBlur={(e) => (e.currentTarget.style.color = "#666666")}
        >
          &rarr;
        </button>
      </div>
    </motion.div>
  );
}
