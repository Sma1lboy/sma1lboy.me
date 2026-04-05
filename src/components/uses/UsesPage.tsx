import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { usesItems, categoryMeta, categoryOrder } from "../../constants/uses";
import { useSEO } from "@/hooks/useSEO";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
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

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease },
  },
};

export default function UsesPage() {
  useSEO({
    title: "Uses",
    description: "Tools, hardware, and software I use daily.",
    path: "/uses",
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            Uses
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            Hardware, software, and tools I use daily for development and productivity.
          </p>
        </motion.header>

        {/* Sections */}
        <div className="space-y-12">
          {categoryOrder.map((category, sectionIndex) => {
            const meta = categoryMeta[category];
            const items = usesItems[category];
            return (
              <motion.section
                key={category}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <h2 className="mb-5 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <span className="mr-2">{meta.emoji}</span>
                  {meta.label}
                </h2>

                <motion.div
                  className="grid gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {items.map((item) => {
                    const content = (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        className={`group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-5 py-4 transition-colors duration-200 hover:border-gray-200 dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:hover:border-[#2a2a2a] dark:hover:bg-[#111]${item.url ? "cursor-pointer" : ""}`}
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-sm text-gray-500 dark:text-[#888]">
                            {item.description}
                          </p>
                        </div>
                        {item.url && (
                          <ExternalLink
                            size={14}
                            className="ml-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500 dark:text-[#333] dark:group-hover:text-[#888]"
                          />
                        )}
                      </motion.div>
                    );

                    if (item.url) {
                      return (
                        <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                          {content}
                        </a>
                      );
                    }

                    return content;
                  })}
                </motion.div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
