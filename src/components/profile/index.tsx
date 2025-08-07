import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Award, Code2 } from "lucide-react";
import { useGitHub } from "../../hooks/useGitHub";
import { sortedExperiences } from "../../constants/experiences";
import { ExperienceType } from "../../types";

/**
 * Background component with blurred landscape image and gradient overlay
 */
function ProfileBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <div
        className="h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519904981063-b0cf448d479e?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-blue-900/50 to-green-900/40" />
      </div>
    </div>
  );
}

/**
 * Reusable glassmorphism card component with animation
 */
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 ${className} `}
    >
      {children}
    </motion.div>
  );
}

/**
 * Custom interactive GitHub-style contribution graph
 */
function CommitGraphWithData() {
  const { contributions, loading, error } = useGitHub();
  const [selectedCell, setSelectedCell] = useState<{ date: string; count: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  const WEEKS_IN_YEAR = 53;
  const DAYS_IN_WEEK = 7;
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Memoize contributions map for efficient lookups
  const contributionsByDate = useMemo(() => {
    const map = new Map<string, number>();
    if (Array.isArray(contributions)) {
      for (const c of contributions) {
        if (c && c.date) {
          map.set(c.date, c.contributionCount || 0);
        }
      }
    }
    return map;
  }, [contributions]);

  // Memoize the grid creation
  const yearGrid = useMemo(() => {
    const grid = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let week = 0; week < WEEKS_IN_YEAR; week++) {
      const weekData = [];
      for (let day = 0; day < DAYS_IN_WEEK; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + week * 7 + day);

        if (currentDate > today) {
          weekData.push(null);
          continue;
        }

        const dateStr = currentDate.toISOString().split("T")[0];
        const count = contributionsByDate.get(dateStr) || 0;

        weekData.push({
          date: dateStr,
          count,
          dayOfWeek: day,
          formattedDate: currentDate.toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
      grid.push(weekData);
    }
    return grid;
  }, [contributionsByDate]);

  // Memoize month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; week: number }[] = [];
    let lastMonth = -1;

    yearGrid.forEach((week, weekIndex) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const date = new Date(firstDay.date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          lastMonth = month;
          labels.push({
            month: date.toLocaleString("en", { month: "short" }),
            week: weekIndex,
          });
        }
      }
    });
    return labels;
  }, [yearGrid]);

  const getColorIntensity = useCallback((count: number, isSelected = false, isHovered = false) => {
    const safeCount = Math.max(0, count || 0);
    let baseColor = "";
    if (safeCount === 0) baseColor = "bg-gray-700/30";
    else if (safeCount <= 3) baseColor = "bg-emerald-700/40";
    else if (safeCount <= 6) baseColor = "bg-emerald-600/60";
    else if (safeCount <= 9) baseColor = "bg-emerald-500/80";
    else baseColor = "bg-emerald-400/90";

    let effects = "";
    if (isSelected) effects += " ring-2 ring-emerald-300 ring-opacity-60 scale-110";
    else if (isHovered) effects += " scale-105 brightness-110";

    return `${baseColor} ${effects} transition-all duration-200 cursor-pointer`;
  }, []);

  const handleCellClick = useCallback(
    (day: { date: string; count: number; formattedDate: string }) => {
      if (selectedCell?.date === day.date) {
        setSelectedCell(null);
      } else {
        setSelectedCell(day);
      }
    },
    [selectedCell],
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-full rounded-lg bg-white/5"></div>
        </div>
      </div>
    );
  }

  if (error && contributionsByDate.size === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-sm text-white/50">
          <p>Unable to load contribution data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Selected cell info - Fixed height to prevent layout shift */}
      <div className="mb-2 h-10">
        {selectedCell ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex h-full items-center rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3"
          >
            <span className="text-xs font-medium text-emerald-300">
              {selectedCell.count} •{" "}
              {new Date(selectedCell.date).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </motion.div>
        ) : (
          <div className="flex h-full items-center px-3">
            <span className="text-xs text-white/30">Click any cell for details</span>
          </div>
        )}
      </div>

      {/* Legend only */}
      <div className="mb-3 flex items-center justify-end px-1">
        <div className="flex items-center gap-1 text-xs text-white/40">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-sm bg-gray-700/30"></div>
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-700/40"></div>
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-600/60"></div>
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500/80"></div>
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400/90"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Main calendar container */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Month Labels */}
        <div className="relative mb-1 ml-8 h-4">
          {monthLabels.map(({ month, week }) => (
            <span
              key={`${month}-${week}`}
              className="absolute text-xs text-white/50"
              style={{
                left: `${week * 14}px`, // w-2.5 (10px) + gap-1 (4px) = 14px
              }}
            >
              {month}
            </span>
          ))}
        </div>

        {/* Grid container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Weekday labels */}
          <div className="mr-2 flex w-6 flex-col gap-1 pr-2 text-right text-xs text-white/50">
            {weekDays.map((day, i) => (
              <div key={i} className="flex h-2.5 items-center justify-end">
                {i % 2 === 1 ? day : ""}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="scrollbar-hide flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-1" style={{ width: "max-content" }}>
              {yearGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    if (!day) {
                      return <div key={dayIndex} className="h-2.5 w-2.5" />;
                    }

                    const isSelected = selectedCell?.date === day.date;
                    const isHovered = hoveredCell?.date === day.date;

                    return (
                      <motion.div
                        key={`${day.date}-${dayIndex}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: weekIndex * 0.005,
                          duration: 0.2,
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }}
                        className={`group relative h-2.5 w-2.5 rounded-sm ${getColorIntensity(day.count, isSelected, isHovered)}`}
                        onClick={() => handleCellClick(day)}
                        onMouseEnter={() => setHoveredCell(day)}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* Hover tooltip */}
                        {hoveredCell?.date === day.date && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md border border-white/20 bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-100"
                          >
                            <div className="font-semibold">{day.count} contributions</div>
                            <div className="text-[10px] text-gray-300">{day.formattedDate}</div>
                            <div className="text-[10px] text-gray-400">Click to select</div>
                            {/* Tooltip arrow */}
                            <div className="absolute top-full left-1/2 -mt-1 -translate-x-1/2">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error indicator - Fixed height */}
      <div className="mt-2 flex h-4 justify-center">
        {error && <span className="text-xs text-yellow-400/50">⚠</span>}
      </div>
    </div>
  );
}

/**
 * Animated profile avatar component
 */
function ProfileAvatar() {
  return (
    <div className="col-span-4 row-span-2 flex justify-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative"
      >
        <img
          src="/home-avatar.png"
          alt="Profile Avatar"
          className="h-80 w-80 rounded-full shadow-2xl"
        />
      </motion.div>
    </div>
  );
}

/**
 * User description and social links component with real GitHub data
 */
function ProfileDescription() {
  const { user, loading, error } = useGitHub();

  if (loading) {
    return (
      <div className="col-span-8 row-span-2 flex flex-col justify-center space-y-3">
        <div className="animate-pulse space-y-2">
          <div className="h-6 w-3/4 rounded bg-white/20"></div>
          <div className="h-4 w-1/2 rounded bg-white/10"></div>
          <div className="h-4 w-2/3 rounded bg-white/10"></div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="col-span-8 row-span-2 flex flex-col justify-center space-y-3">
        <h3 className="text-lg font-semibold text-white">Front-end Developer</h3>
        <div className="space-y-1 text-sm text-white/70">
          <p>Guangzhou, China</p>
          <p>2+ years experience</p>
          <p className="text-xs text-red-400/70">GitHub data unavailable</p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://github.com/sma1lboy"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
          >
            <div className="h-4 w-4 rounded bg-gray-800" />
          </a>
        </div>
      </div>
    );
  }

  const calculateYearsExperience = (createdAt: string | undefined): number => {
    if (!createdAt) return 2;

    try {
      const createdDate = new Date(createdAt);
      if (isNaN(createdDate.getTime())) return 2;

      const years = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      return Math.max(years, 1); // Minimum 1 year
    } catch {
      return 2; // Default fallback
    }
  };

  const yearsExperience = calculateYearsExperience(user?.created_at);

  const formatBlogUrl = (blog: string | null): string | null => {
    if (!blog) return null;

    try {
      // Add https:// if missing
      if (!blog.startsWith("http://") && !blog.startsWith("https://")) {
        return `https://${blog}`;
      }
      return blog;
    } catch {
      return null;
    }
  };

  const blogUrl = formatBlogUrl(user?.blog || null);

  return (
    <div className="col-span-8 row-span-2 flex flex-col justify-center space-y-3">
      <h3 className="text-lg font-semibold text-white">{user?.bio || "Front-end Developer"}</h3>
      <div className="space-y-1 text-sm text-white/70">
        <p>{user?.location || "Guangzhou, China"}</p>
        <p>{yearsExperience}+ years on GitHub</p>
        {user?.company && <p>Working at {user.company}</p>}
        {error && <p className="text-xs text-yellow-400/70">Using cached data</p>}
      </div>
      <div className="flex gap-2">
        {blogUrl && (
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
            title="Visit blog"
          >
            <div className="h-4 w-4 rounded bg-blue-500" />
          </a>
        )}
        <a
          href={`https://github.com/${user?.login || "sma1lboy"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
          title="Visit GitHub profile"
        >
          <div className="h-4 w-4 rounded bg-gray-800" />
        </a>
      </div>
    </div>
  );
}

/**
 * Location status card component with real GitHub data
 */
function LocationCard() {
  const { user, loading, error } = useGitHub();

  return (
    <div className="col-span-2 row-span-1">
      <GlassCard delay={0.2} className="h-full w-full">
        <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
          <MapPin size={20} className="text-white/60" />
          {loading ? (
            <div className="animate-pulse space-y-1">
              <div className="h-4 w-16 rounded bg-white/20"></div>
              <div className="h-3 w-12 rounded bg-white/10"></div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-white">{user?.location || "Remote"}</p>
              <p className="text-xs text-white/70">{error && !user ? "Offline" : "Developer"}</p>
              {error && <p className="text-xs text-yellow-400/50">⚠️</p>}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Work status card component
 */
function WorkStatusCard() {
  return (
    <div className="col-span-2 row-span-1">
      <GlassCard delay={0.3} className="h-full w-full">
        <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
          <div className="h-5 w-5 rounded bg-white/60" />
          <div>
            <p className="text-sm font-medium text-white">Advertising</p>
            <p className="text-xs text-white/70">Part-time</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * GitHub contributions card component with real data
 */
function GitHubCard() {
  const { totalContributions, contributions, loading, repos, error } = useGitHub();

  const safeContributions = Array.isArray(contributions) ? contributions : [];
  const safeRepos = Array.isArray(repos) ? repos : [];
  const safeTotalContributions = typeof totalContributions === "number" ? totalContributions : 0;

  const daysWithContributions = safeContributions.filter(
    (day) => day && typeof day.contributionCount === "number" && day.contributionCount > 0,
  ).length;

  return (
    <div className="col-span-8 row-span-2">
      <GlassCard delay={0.4} className="flex h-full w-full flex-col p-4">
        {/* Header with title and year */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-lg font-semibold text-white">GitHub Activity</span>
              {error && (
                <span className="text-xs text-yellow-400/70" title="Data may be stale">
                  ⚠️
                </span>
              )}
            </div>
            <div className="text-sm text-white/60">
              {new Date().getFullYear()} Contribution Overview
            </div>
          </div>

          {/* Quick stats grid */}
          {!loading && (
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">
                  {safeTotalContributions.toLocaleString()}
                </div>
                <div className="text-white/50">Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">{safeRepos.length}</div>
                <div className="text-white/50">Repos</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">{daysWithContributions}</div>
                <div className="text-white/50">Active</div>
              </div>
            </div>
          )}
        </div>

        {/* Additional info bar */}
        <div className="mb-4 flex items-center justify-between rounded-lg border border-white/5 bg-black/10 px-2 py-2">
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>📈 Coding streak</span>
            <span>
              🔥 Most productive: {new Date().toLocaleDateString("en", { month: "short" })}
            </span>
          </div>
          <div className="text-xs text-white/50">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-1 items-center justify-center">
            <div className="animate-pulse space-y-2">
              <div className="mx-auto h-4 w-48 rounded bg-white/20"></div>
              <div className="mx-auto h-4 w-36 rounded bg-white/10"></div>
              <div className="mx-auto h-4 w-40 rounded bg-white/10"></div>
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && !safeContributions.length && (
          <div className="flex flex-1 items-center justify-center">
            <div className="space-y-1 text-center text-sm text-white/70">
              <p className="text-red-400/70">GitHub data unavailable</p>
              <p>Unable to load contribution data</p>
              <p className="text-xs text-white/50">Check network connection</p>
            </div>
          </div>
        )}

        {/* Contribution graph - takes remaining space */}
        {!loading && safeContributions.length > 0 && (
          <div className="min-h-0 flex-1">
            <CommitGraphWithData />
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/**
 * Skills and interests tags component
 */
function SkillsCard() {
  const skills = [
    "Programming",
    "Sports",
    "Gaming",
    "Music",
    "Development",
    "Reading",
    "Novels",
    "League of Legends",
    "Technology",
    "Design",
    "Learning",
    "Growth",
  ];

  return (
    <div className="col-span-4 row-span-1">
      <GlassCard delay={0.5} className="h-full w-full">
        <div className="flex h-full flex-col justify-center space-y-3">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/15"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(5, 8).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/15"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.slice(8, 12).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 transition-colors hover:bg-white/15"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Work experience timeline component with real data
 */
function ExperienceCard() {
  // Get the latest 3 experiences (work + education combined)
  const latestExperiences = sortedExperiences
    .filter((exp) => ["work", "education", "internship", "award"].includes(exp.type))
    .slice(0, 3);

  const getExperienceIcon = (type: ExperienceType) => {
    switch (type) {
      case "work":
      case "internship":
        return <Briefcase size={14} className="text-blue-400" />;
      case "education":
        return <GraduationCap size={14} className="text-green-400" />;
      case "award":
        return <Award size={14} className="text-yellow-400" />;
      case "project":
        return <Code2 size={14} className="text-purple-400" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-orange-500" />;
    }
  };

  const formatPeriod = (period: { start: string; end?: string }) => {
    const startDate = new Date(period.start);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.toLocaleString("en", { month: "short" });

    if (!period.end) {
      return `${startMonth} ${startYear} - Present`;
    }

    const endDate = new Date(period.end);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.toLocaleString("en", { month: "short" });

    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${endYear}`;
    }

    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
  };

  return (
    <div className="col-span-6 row-span-1">
      <GlassCard delay={0.6} className="h-full w-full">
        <div className="flex h-full flex-col justify-center space-y-3">
          <h3 className="mb-2 text-xs font-semibold tracking-wider text-white/80 uppercase">
            Recent Experience
          </h3>
          {latestExperiences.map((exp) => (
            <div key={exp.id} className="group flex items-center gap-3">
              <div className="flex-shrink-0">{getExperienceIcon(exp.type)}</div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white transition-colors group-hover:text-white/90">
                  {exp.company || exp.organization || exp.title}
                </p>
                <p className="truncate text-xs text-white/50">{exp.title}</p>
              </div>
              <span className="flex-shrink-0 text-xs text-white/60">
                {formatPeriod(exp.period)}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Navigation and GitHub stats component with real data
 */
function NavigationCard() {
  const { user, repos, loading, error } = useGitHub();

  // Safe calculations with error handling
  const safeRepos = Array.isArray(repos) ? repos : [];

  const totalStars = safeRepos.reduce((sum, repo) => {
    const stars = repo && typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0;
    return sum + stars;
  }, 0);

  const totalForks = safeRepos.reduce((sum, repo) => {
    const forks = repo && typeof repo.forks_count === "number" ? repo.forks_count : 0;
    return sum + forks;
  }, 0);

  // Safe user data extraction
  const publicRepos =
    user?.public_repos && typeof user.public_repos === "number" ? user.public_repos : 0;
  const followers = user?.followers && typeof user.followers === "number" ? user.followers : 0;

  return (
    <div className="col-span-6 row-span-1">
      <GlassCard delay={0.7} className="h-full w-full">
        <div className="flex h-full flex-col justify-center space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">⚙️ GitHub Stats</span>
            {error && (
              <span className="text-xs text-yellow-400/70" title="Data may be stale">
                ⚠️
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid animate-pulse grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-white/20"></div>
                <div className="h-4 w-2/3 rounded bg-white/10"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-white/20"></div>
                <div className="h-4 w-2/3 rounded bg-white/10"></div>
              </div>
            </div>
          ) : error && !user && safeRepos.length === 0 ? (
            <div className="space-y-2 text-center text-sm text-white/70">
              <p className="text-red-400/70">GitHub stats unavailable</p>
              <p className="text-xs">Unable to load GitHub data</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="h-4 w-4 rounded bg-blue-500" />
                  <span>{publicRepos.toLocaleString()} Repositories</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="h-4 w-4 rounded bg-green-500" />
                  <span>{totalStars.toLocaleString()} Stars</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="h-4 w-4 rounded bg-purple-500" />
                  <span>{followers.toLocaleString()} Followers</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/80">
                  <div className="h-4 w-4 rounded bg-orange-500" />
                  <span>{totalForks.toLocaleString()} Forks</span>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-2 text-xs text-white/60">
            {error && user ? "Using cached data • " : ""}Data updates every 30 minutes
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

/**
 * Main profile page component with fixed grid layout
 * Features: Avatar, description, status cards, GitHub activity, skills, experience, navigation
 */
export function ProfilePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ProfileBackground />

      <div className="relative z-10 min-h-screen bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto h-full max-w-7xl px-6 py-8">
          {/* Fixed Grid Layout: 4 rows, 12 columns */}
          <div className="grid h-full min-h-[800px] grid-cols-12 grid-rows-4 gap-6">
            {/* Row 1: Avatar + Description (No card wrappers) */}
            <ProfileAvatar />
            <ProfileDescription />

            {/* Row 2: Position Status Cards + GitHub Card (spans 2 rows) */}
            <LocationCard />
            <WorkStatusCard />
            <GitHubCard />

            {/* Row 3: Skills/Interests Tags */}
            <SkillsCard />

            {/* Row 4: Work Experience + Navigation */}
            <ExperienceCard />
            <NavigationCard />
          </div>
        </div>
      </div>
    </div>
  );
}
