import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Twitter,
  Play,
  Code,
  FolderGit2,
  FileText,
  Clock,
  Briefcase,
  Activity,
} from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { resumeData } from "../../../constants/resume";
import { featuredProjects, socialLinks } from "../../../constants/home";
import { blogPosts } from "../../../constants/blog";
import { changelogEntries } from "../../../constants/changelog";
import { sortedExperiences } from "../../../constants/experiences";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Twitter,
  Play,
  Github,
  Linkedin,
  Mail,
};

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Find current work
const currentWork = sortedExperiences.find(
  (e) => (e.type === "work" || e.type === "internship") && !e.period.end,
);

// Find featured project
const featuredProject = featuredProjects.find((p) => p.featured) ?? featuredProjects[0];

// Latest blog posts
const latestPosts = blogPosts.slice(0, 3);

// Latest changelog
const latestChangelog = changelogEntries.slice(0, 3);

// Derived stats
const yearsCoding = new Date().getFullYear() - 2021;
const projectCount = featuredProjects.length;
const blogPostCount = blogPosts.length;

// Mini heatmap data (decorative)
function generateHeatmapData() {
  const weeks = 20;
  const days = 7;
  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      // Weighted random to simulate realistic contribution patterns
      const r = Math.random();
      if (r < 0.3) week.push(0);
      else if (r < 0.6) week.push(1);
      else if (r < 0.8) week.push(2);
      else if (r < 0.95) week.push(3);
      else week.push(4);
    }
    data.push(week);
  }
  return data;
}

const heatmapData = generateHeatmapData();

const heatmapColors = [
  "fill-zinc-800",
  "fill-emerald-900/60",
  "fill-emerald-700/60",
  "fill-emerald-500/60",
  "fill-emerald-400/70",
];

function CardWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors duration-200 hover:border-zinc-700 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Card 1: Hero ──
function HeroCard() {
  return (
    <CardWrapper className="col-span-1 md:col-span-2">
      <Link to="/profile" className="block">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Portfolio</p>
            <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
              {resumeData.name}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">@{resumeData.handle}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{resumeData.title}</p>
          </div>
          <div className="flex gap-2">
            {socialLinks.map((link) => {
              const Icon = iconMap[link.icon];
              if (!Icon) return null;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full border border-zinc-800 p-2 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                >
                  <Icon size={14} className="text-zinc-400" />
                </a>
              );
            })}
          </div>
        </div>
      </Link>
    </CardWrapper>
  );
}

// ── Card 2: Latest Blog Posts ──
function BlogCard() {
  return (
    <CardWrapper className="row-span-1 md:row-span-2">
      <Link to="/blog" className="group mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-zinc-500" />
          <h2 className="text-sm font-semibold text-white">Latest Posts</h2>
        </div>
        <ArrowUpRight
          size={12}
          className="text-zinc-600 transition-colors group-hover:text-zinc-300"
        />
      </Link>
      <div className="space-y-4">
        {latestPosts.map((post) => (
          <Link
            key={post.slug}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="group/post block"
          >
            <p className="text-xs font-medium text-zinc-300 transition-colors group-hover/post:text-white">
              {post.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">
              {post.excerpt}
            </p>
            <p className="mt-1.5 text-[10px] text-zinc-600">{post.date}</p>
          </Link>
        ))}
      </div>
    </CardWrapper>
  );
}

// ── Card 3: Featured Project ──
function ProjectCard() {
  if (!featuredProject) return null;
  return (
    <CardWrapper>
      <a
        href={featuredProject.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 size={14} className="text-zinc-500" />
            <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Featured</p>
          </div>
          <ArrowUpRight
            size={12}
            className="text-zinc-600 transition-transform transition-colors group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>
        <h2 className="text-sm font-semibold text-white">{featuredProject.title}</h2>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500">
          {featuredProject.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {featuredProject.techTags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </a>
    </CardWrapper>
  );
}

// ── Card 4: GitHub Mini Heatmap ──
function GithubHeatmapCard() {
  return (
    <CardWrapper>
      <Link to="/github" className="group block">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github size={14} className="text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Contributions</h2>
          </div>
          <ArrowUpRight
            size={12}
            className="text-zinc-600 transition-colors group-hover:text-zinc-300"
          />
        </div>
        <svg viewBox="0 0 260 98" className="w-full" aria-label="Contribution heatmap">
          {heatmapData.map((week, wi) =>
            week.map((level, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * 13}
                y={di * 13}
                width={10}
                height={10}
                rx={2}
                className={heatmapColors[level]}
              />
            )),
          )}
        </svg>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-zinc-600">
          <span>Less</span>
          {heatmapColors.map((color, i) => (
            <svg key={i} width={10} height={10}>
              <rect width={10} height={10} rx={2} className={color} />
            </svg>
          ))}
          <span>More</span>
        </div>
      </Link>
    </CardWrapper>
  );
}

// ── Card 5: Quick Stats ──
function StatsCard() {
  const stats = [
    { label: "Years Coding", value: yearsCoding, icon: Code },
    { label: "Projects", value: projectCount, icon: FolderGit2 },
    { label: "Blog Posts", value: blogPostCount, icon: FileText },
    { label: "Contributions", value: "60M+", icon: Activity },
  ];

  return (
    <CardWrapper>
      <Link to="/stats" className="group block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Quick Stats</h2>
          <ArrowUpRight
            size={12}
            className="text-zinc-600 transition-colors group-hover:text-zinc-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="flex items-center gap-1.5">
                <stat.icon size={11} className="text-zinc-600" />
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
              <p className="text-[10px] text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </Link>
    </CardWrapper>
  );
}

// ── Card 6: Recent Changelog ──
function ChangelogCard() {
  const typeColors: Record<string, string> = {
    new: "bg-emerald-500",
    improved: "bg-sky-500",
    fixed: "bg-amber-500",
  };

  return (
    <CardWrapper>
      <Link to="/changelog" className="group block">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Changelog</h2>
          </div>
          <ArrowUpRight
            size={12}
            className="text-zinc-600 transition-colors group-hover:text-zinc-300"
          />
        </div>
        <div className="space-y-3">
          {latestChangelog.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2.5">
              <div
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${typeColors[entry.type] ?? "bg-zinc-500"}`}
              />
              <div>
                <p className="text-xs font-medium text-zinc-300">{entry.title}</p>
                <p className="mt-0.5 text-[10px] text-zinc-600">
                  {entry.version} &middot; {entry.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Link>
    </CardWrapper>
  );
}

// ── Card 7: Now Section ──
function NowCard() {
  return (
    <CardWrapper>
      <Link to="/timeline" className="group block">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-zinc-500" />
            <h2 className="text-sm font-semibold text-white">Now</h2>
          </div>
          <ArrowUpRight
            size={12}
            className="text-zinc-600 transition-colors group-hover:text-zinc-300"
          />
        </div>
        {currentWork && (
          <div className="mb-3">
            <p className="text-xs font-medium text-zinc-300">{currentWork.title}</p>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              {currentWork.company} &middot; {currentWork.location}
            </p>
          </div>
        )}
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Focus</p>
          {["Distributed Systems", "AI Tooling", "Open Source"].map((focus) => (
            <div key={focus} className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-zinc-600" />
              <p className="text-xs text-zinc-400">{focus}</p>
            </div>
          ))}
        </div>
      </Link>
    </CardWrapper>
  );
}

// ── Main Component ──
export function Home4() {
  useSEO({
    title: "Jackson Chen - Software Engineer",
    description:
      "Full-Stack Developer & AI Engineer. Building AI tooling, open-source projects, and interactive web experiences.",
    path: "/",
  });

  return (
    <div className="min-h-screen bg-black px-4 py-12 text-white sm:px-6 md:py-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto grid max-w-5xl auto-rows-auto grid-cols-1 gap-4 md:grid-cols-3"
      >
        {/* Row 1: Hero (2 cols) + Blog (1 col, spans 2 rows) */}
        <HeroCard />
        <BlogCard />

        {/* Row 2: Featured Project + GitHub Heatmap */}
        <ProjectCard />
        <GithubHeatmapCard />

        {/* Row 3: Quick Stats + Changelog + Now */}
        <StatsCard />
        <ChangelogCard />
        <NowCard />
      </motion.div>
    </div>
  );
}
