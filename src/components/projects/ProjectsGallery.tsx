import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import { featuredProjects, projectCategories, type ProjectCategory } from "@/constants/home";

type FilterOption = "All" | ProjectCategory;

const filters: FilterOption[] = ["All", ...projectCategories];

const featuredItems = featuredProjects.filter((p) => p.featured);

export function ProjectsGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");

  const filteredProjects =
    activeFilter === "All"
      ? featuredProjects
      : featuredProjects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-white transition-colors duration-300 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-[#1a1a1a] dark:bg-[#0a0a0a]/80">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-200"
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <div className="h-4 w-px bg-gray-200 dark:bg-[#2a2a2a]" />
          <h1
            className="text-sm font-medium tracking-wide text-gray-900 dark:text-[#e0e0e0]"
          >
            Projects
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured Hero Section */}
        <FeaturedHero projects={featuredItems} />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
        />

        {/* Project Grid */}
        <ProjectGrid projects={filteredProjects} />
      </main>
    </div>
  );
}

/* ─── Featured Hero ─── */

function FeaturedHero({
  projects,
}: {
  projects: typeof featuredProjects;
}) {
  return (
    <section className="mb-16">
      <motion.p
        className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-[#666]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Star size={12} />
        Featured
      </motion.p>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-[#1a1a1a]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={project.preview}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Content overlay — stays light text on dark gradient regardless of theme */}
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#b0b0b0]"
                >
                  {project.category}
                </span>
                <span className="text-[11px] text-[#666]">
                  {project.year}
                </span>
              </div>

              <h3 className="mb-1.5 text-xl font-semibold text-white">
                {project.title}
              </h3>

              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-300">
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.techTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/[0.08] px-2 py-0.5 text-[11px] text-[#999]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* View link */}
              <div className="mt-3 flex items-center gap-1 text-[12px] text-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span>View Project</span>
                <ArrowUpRight size={12} />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ─── Filter Bar ─── */

function FilterBar({
  filters,
  active,
  onChange,
}: {
  filters: FilterOption[];
  active: FilterOption;
  onChange: (f: FilterOption) => void;
}) {
  return (
    <motion.div
      className="mb-10 flex gap-1 overflow-x-auto pb-2 scrollbar-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`relative whitespace-nowrap rounded-lg px-4 py-2 text-[13px] font-medium transition-colors hover:cursor-pointer ${
            active === filter
              ? "text-gray-900 dark:text-[#e0e0e0]"
              : "text-gray-400 dark:text-[#666]"
          }`}
        >
          <span className="relative z-10">{filter}</span>
          {active === filter && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-white/[0.06]"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      ))}
    </motion.div>
  );
}

/* ─── Project Grid ─── */

function ProjectGrid({
  projects,
}: {
  projects: typeof featuredProjects;
}) {
  return (
    <motion.div
      layout
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Project Card ─── */

function ProjectCard({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  return (
    <motion.a
      layout
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 transition-colors hover:border-gray-300 dark:border-[#1a1a1a] dark:hover:border-[#2a2a2a]"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{
        duration: 0.4,
        delay: index * 0.06,
        layout: { type: "spring", stiffness: 300, damping: 30 },
      }}
      whileHover={{ y: -4 }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={project.preview}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3
            className="text-sm font-semibold text-gray-800 transition-colors duration-200 group-hover:text-gray-900 dark:text-[#d0d0d0] dark:group-hover:text-white"
          >
            {project.title}
          </h3>
          <ArrowUpRight
            size={14}
            className="text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 dark:text-[#666]"
          />
        </div>

        <p
          className="mb-3 line-clamp-2 text-[12px] leading-relaxed text-gray-500 dark:text-[#888]"
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-1.5">
          {project.techTags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-[#666]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Category + Year */}
        <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-[#1a1a1a]">
          <span
            className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-[#555]"
          >
            {project.category}
          </span>
          <span className="text-[10px] text-gray-300 dark:text-[#444]">
            ·
          </span>
          <span className="text-[10px] text-gray-300 dark:text-[#444]">
            {project.year}
          </span>
        </div>
      </div>
    </motion.a>
  );
}
