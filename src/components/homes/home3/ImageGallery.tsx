import { motion } from "framer-motion";

const galleryImages = [
  { src: "/images/pochi-preview.png", caption: "pochi" },
  { src: "/images/tabby-preview.png", caption: "tabby" },
  { src: "/images/foxychat-preview.png", caption: "foxychat" },
  { src: "/images/taskforge-preview.png", caption: "taskforge" },
  { src: "/images/personal-preview.png", caption: "sma1lboy.me" },
];

export function ImageGallery() {
  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="space-y-4">
        {galleryImages.map((image, i) => (
          <motion.figure
            key={image.src}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.4,
              delay: i * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <img
              src={image.src}
              alt={image.caption}
              loading="lazy"
              className="w-full object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
            <figcaption
              className="mt-2 font-mono text-[11px] text-gray-400 dark:text-[#666]"
            >
              {image.caption}
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <p
        className="mt-8 pb-4 text-center font-mono text-[10px] text-gray-400 dark:text-[#444]"
      >
        {galleryImages.length} projects
      </p>
    </motion.div>
  );
}
