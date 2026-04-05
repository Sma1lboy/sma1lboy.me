import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Code2,
  ExternalLink,
  Flag,
  GraduationCap,
  MapPin,
  Rocket,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { sortedExperiences } from "../../constants/experiences";
import { Experience, ExperienceType } from "../../types";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// Type-based color coding
const typeColors: Record<
  ExperienceType | "milestone",
  { bg: string; dot: string; glow: string; badge: string; label: string }
> = {
  education: {
    bg: "bg-blue-500/10 dark:bg-blue-500/10",
    dot: "bg-blue-500",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.5)]",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Education",
  },
  work: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/10",
    dot: "bg-emerald-500",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.5)]",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    label: "Work",
  },
  internship: {
    bg: "bg-teal-500/10 dark:bg-teal-500/10",
    dot: "bg-teal-500",
    glow: "shadow-[0_0_12px_rgba(20,184,166,0.5)]",
    badge: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    label: "Internship",
  },
  project: {
    bg: "bg-purple-500/10 dark:bg-purple-500/10",
    dot: "bg-purple-500",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.5)]",
    badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    label: "Project",
  },
  award: {
    bg: "bg-amber-500/10 dark:bg-amber-500/10",
    dot: "bg-amber-500",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.5)]",
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "Award",
  },
  certification: {
    bg: "bg-rose-500/10 dark:bg-rose-500/10",
    dot: "bg-rose-500",
    glow: "shadow-[0_0_12px_rgba(244,63,94,0.5)]",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    label: "Certification",
  },
  milestone: {
    bg: "bg-gray-500/10 dark:bg-gray-500/10",
    dot: "bg-gray-400 dark:bg-gray-500",
    glow: "shadow-[0_0_12px_rgba(156,163,175,0.4)]",
    badge: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    label: "Milestone",
  },
};

const typeIcons: Record<ExperienceType | "milestone", React.ComponentType<{ className?: string }>> =
  {
    education: GraduationCap,
    work: Briefcase,
    internship: Users,
    project: Code2,
    award: Trophy,
    certification: Award,
    milestone: Flag,
  };

interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  subtitle?: string;
  description: string;
  type: ExperienceType | "milestone";
  technologies?: string[];
  achievements?: string[];
  location?: string;
  url?: string;
  featured?: boolean;
}

// Additional milestones beyond the experiences data
const additionalMilestones: TimelineEntry[] = [
  {
    id: "first-code",
    date: "2018-09",
    title: "First Line of Code",
    subtitle: "The Beginning",
    description:
      "Wrote my first program and fell in love with the power of turning ideas into working software. Started learning programming fundamentals and building small projects.",
    type: "milestone",
  },
  {
    id: "first-open-source",
    date: "2022-06",
    title: "First Open Source Contribution",
    subtitle: "Open Source Journey",
    description:
      "Made my first meaningful contribution to an open-source project on GitHub, learning the collaborative development workflow and community-driven development.",
    type: "milestone",
  },
  {
    id: "codefox-launch",
    date: "2024-03",
    title: "CodeFox Public Launch",
    subtitle: "Major Project Milestone",
    description:
      "Launched CodeFox as an open-source AI project generation tool, combining build systems with dependency resolution and virtual filesystem for full-stack app generation.",
    type: "milestone",
    url: "https://github.com/CodeFox-Repo/codefox",
  },
  {
    id: "gsoc-accepted",
    date: "2024-04",
    title: "Accepted to Google Summer of Code",
    subtitle: "Google",
    description:
      "Selected as a Google Summer of Code contributor, working on open-source projects under Google's mentorship program.",
    type: "milestone",
  },
  {
    id: "tabby-31k-stars",
    date: "2024-12",
    title: "TabbyML Reaches 31k+ GitHub Stars",
    subtitle: "Open Source Impact",
    description:
      "Contributed to TabbyML's growth to 31,000+ GitHub stars, serving over 60 million users with AI-powered code assistance.",
    type: "milestone",
  },
  {
    id: "graduation",
    date: "2025-05",
    title: "Graduated from UW-Madison",
    subtitle: "University of Wisconsin-Madison",
    description:
      "Completed Bachelor of Science in Computer Sciences with a strong academic record and extensive industry experience gained through internships and open-source contributions.",
    type: "milestone",
    location: "Madison, WI",
  },
];

// Convert experiences to timeline entries
function experienceToEntry(exp: Experience): TimelineEntry {
  return {
    id: exp.id,
    date: exp.period.start,
    title: exp.title,
    subtitle: exp.company || exp.organization,
    description: exp.description,
    type: exp.type,
    technologies: exp.technologies,
    achievements: exp.achievements,
    location: exp.location,
    url: exp.url,
    featured: exp.featured,
  };
}

// Merge and sort all entries chronologically (oldest first for timeline)
const allEntries: TimelineEntry[] = [
  ...sortedExperiences.map(experienceToEntry),
  ...additionalMilestones,
]
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// Deduplicate: if a milestone overlaps with an experience (same rough date + similar title), keep the experience
const deduplicatedEntries = allEntries.filter((entry, _idx, arr) => {
  if (entry.type !== "milestone") return true;
  // Check if there's an experience within the same month that covers the same thing
  const hasExperience = arr.some(
    (other) =>
      other.id !== entry.id &&
      other.type !== "milestone" &&
      other.date.slice(0, 7) === entry.date.slice(0, 7) &&
      (other.title.toLowerCase().includes(entry.title.toLowerCase().split(" ")[0]) ||
        entry.title.toLowerCase().includes(other.title.toLowerCase().split(" ")[0])),
  );
  return !hasExperience;
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function TimelineNode({
  entry,
  index,
  isLeft,
}: {
  entry: TimelineEntry;
  index: number;
  isLeft: boolean;
}) {
  const colors = typeColors[entry.type];
  const Icon = typeIcons[entry.type];

  return (
    <div className="relative flex items-start">
      {/* Desktop: alternating layout */}
      <div className="hidden w-full md:flex">
        {/* Left content */}
        <div className="flex w-1/2 justify-end pr-10">
          {isLeft ? (
            <TimelineCard entry={entry} index={index} direction="left" />
          ) : (
            <motion.div
              className="mt-2 text-right"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.03 + 0.1 }}
            >
              <span className="text-sm font-medium text-gray-400 dark:text-[#666]">
                {formatDate(entry.date)}
              </span>
            </motion.div>
          )}
        </div>

        {/* Center dot */}
        <div className="relative z-10 flex flex-shrink-0 items-start">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              duration: 0.4,
              delay: index * 0.03,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-[#0a0a0a] ${colors.dot} ${colors.glow}`}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Right content */}
        <div className="w-1/2 pl-10">
          {!isLeft ? (
            <TimelineCard entry={entry} index={index} direction="right" />
          ) : (
            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.03 + 0.1 }}
            >
              <span className="text-sm font-medium text-gray-400 dark:text-[#666]">
                {formatDate(entry.date)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile: single column */}
      <div className="flex w-full md:hidden">
        {/* Left dot */}
        <div className="relative z-10 mr-4 flex flex-shrink-0 items-start">
          <motion.div
            className="relative"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: 0.4,
              delay: index * 0.03,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white dark:border-[#0a0a0a] ${colors.dot} ${colors.glow}`}
            >
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <TimelineCard entry={entry} index={index} direction="right" />
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  entry,
  index,
  direction,
}: {
  entry: TimelineEntry;
  index: number;
  direction: "left" | "right";
}) {
  const colors = typeColors[entry.type];

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: direction === "left" ? 40 : -40,
        y: 10,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.03 + 0.1,
        ease,
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-md dark:border-[#1a1a1a] dark:bg-[#0f0f0f] dark:hover:border-[#2a2a2a] dark:hover:shadow-lg dark:hover:shadow-black/20">
        {/* Badge + Date */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${colors.badge}`}
          >
            {typeColors[entry.type].label}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-[#666]">
            <Calendar className="h-3 w-3" />
            {formatDate(entry.date)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {entry.title}
        </h3>

        {/* Subtitle (company/org) */}
        {entry.subtitle && (
          <p className="mt-0.5 text-sm text-gray-500 dark:text-[#888]">{entry.subtitle}</p>
        )}

        {/* Location */}
        {entry.location && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 dark:text-[#666]">
            <MapPin className="h-3 w-3" />
            {entry.location}
          </div>
        )}

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-[#999]">
          {entry.description.length > 200
            ? entry.description.slice(0, 200) + "..."
            : entry.description}
        </p>

        {/* Technologies */}
        {entry.technologies && entry.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 dark:bg-[#151515] dark:text-[#888]"
              >
                {tech}
              </span>
            ))}
            {entry.technologies.length > 5 && (
              <span className="rounded-md px-2 py-0.5 text-[11px] text-gray-400 dark:text-[#666]">
                +{entry.technologies.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Key achievements (max 2) */}
        {entry.achievements && entry.achievements.length > 0 && (
          <ul className="mt-3 space-y-1">
            {entry.achievements.slice(0, 2).map((a, i) => (
              <li key={i} className="flex items-start text-xs text-gray-500 dark:text-[#888]">
                <Star className="mr-1.5 mt-0.5 h-3 w-3 flex-shrink-0 text-gray-300 dark:text-[#444]" />
                {a}
              </li>
            ))}
          </ul>
        )}

        {/* Featured badge + Link */}
        <div className="mt-3 flex items-center justify-between">
          {entry.featured && (
            <div className="flex items-center gap-1">
              <Rocket className="h-3 w-3 text-amber-500" />
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                Featured
              </span>
            </div>
          )}
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-gray-600 dark:text-[#555] dark:hover:text-[#999]"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-[#0a0a0a] dark:text-gray-100">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-20">
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
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
            My Journey
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-[#888]">
            From writing my first line of code to building products used by millions
          </p>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {(
              ["education", "work", "internship", "project", "award", "milestone"] as const
            ).map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${typeColors[type].dot}`} />
                <span className="text-xs text-gray-400 dark:text-[#666]">
                  {typeColors[type].label}
                </span>
              </div>
            ))}
          </div>
        </motion.header>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Central line — desktop */}
          <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gray-200 md:block dark:bg-[#1a1a1a]">
            <motion.div
              className="w-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 dark:from-[#333] dark:via-[#555] dark:to-[#333]"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Central line — mobile */}
          <div className="absolute top-0 left-4 h-full w-px bg-gray-200 md:hidden dark:bg-[#1a1a1a]">
            <motion.div
              className="w-full bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 dark:from-[#333] dark:via-[#555] dark:to-[#333]"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Timeline entries */}
          <div className="relative space-y-8 md:space-y-12">
            {deduplicatedEntries.map((entry, index) => (
              <TimelineNode
                key={entry.id}
                entry={entry}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>

          {/* End marker */}
          <motion.div
            className="relative z-10 mt-12 flex justify-center"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 dark:border-[#1a1a1a] dark:bg-[#0f0f0f]">
              <BookOpen className="h-4 w-4 text-gray-400 dark:text-[#666]" />
              <span className="text-sm text-gray-500 dark:text-[#888]">
                The journey continues...
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
