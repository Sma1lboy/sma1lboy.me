import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import {
  galleryPhotos,
  galleryCategories,
  type GalleryPhoto,
  type GalleryCategory,
} from "@/constants/gallery";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

/* ── Category Filter Pills ── */

function CategoryFilters({
  active,
  onSelect,
}: {
  active: GalleryCategory | "All";
  onSelect: (cat: GalleryCategory | "All") => void;
}) {
  const categories = ["All", ...galleryCategories] as const;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
            active === cat
              ? "bg-gray-900 text-white shadow-sm dark:bg-white dark:text-gray-900"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#151515] dark:text-gray-400 dark:hover:bg-[#1f1f1f]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ── Photo Card ── */

function PhotoCard({
  photo,
  onClick,
}: {
  photo: GalleryPhoto;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      className="group mb-4 cursor-pointer overflow-hidden rounded-xl break-inside-avoid"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ aspectRatio: `${photo.width}/${photo.height}` }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end rounded-xl bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-1 inline-block w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {photo.category}
          </span>
          <p className="text-sm leading-snug text-white/90">{photo.caption}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Lightbox Modal ── */

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index];

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Photo */}
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="flex max-h-[85vh] max-w-[90vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[75vh] max-w-full rounded-lg object-contain"
        />
        <div className="mt-4 text-center">
          <span className="mb-1 inline-block rounded-full bg-white/15 px-3 py-0.5 text-xs font-medium text-white/80">
            {photo.category}
          </span>
          <p className="mt-1 text-sm text-white/70">{photo.caption}</p>
          <p className="mt-1 text-xs text-white/40">
            {index + 1} / {photos.length}
          </p>
        </div>
      </motion.div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  );
}

/* ── Gallery Page ── */

export default function GalleryPage() {
  useSEO({
    title: "Gallery",
    description: "A visual tour of developer life — workspace setups, events, travel, and code.",
    path: "/gallery",
  });

  const [activeCategory, setActiveCategory] = useState<GalleryCategory | "All">("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "All"
        ? galleryPhotos
        : galleryPhotos.filter((p) => p.category === activeCategory),
    [activeCategory],
  );

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filteredPhotos.length) % filteredPhotos.length));
  }, [filteredPhotos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filteredPhotos.length));
  }, [filteredPhotos.length]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            Gallery
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Snapshots from the developer life — work, events, travel, and everything in between.
          </p>
        </motion.header>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease }}
          className="mb-8"
        >
          <CategoryFilters active={activeCategory} onSelect={setActiveCategory} />
        </motion.div>

        {/* Masonry Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {filteredPhotos.map((photo, i) => (
              <PhotoCard key={photo.id} photo={photo} onClick={() => openLightbox(i)} />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPhotos.length === 0 && (
          <p className="py-20 text-center text-gray-400 dark:text-gray-500">
            No photos in this category yet.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filteredPhotos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
