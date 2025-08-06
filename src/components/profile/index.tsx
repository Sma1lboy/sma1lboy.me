import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useGitHub } from "../../hooks/useGitHub";
import { GitHubContribution } from "../../services/githubApi";

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
 * GitHub-style contribution graph component with real data
 */
function CommitGraphWithData() {
  const { contributions, loading, error } = useGitHub();

  // Get color intensity based on contribution count
  const getColorIntensity = (count: number): string => {
    // Validate input
    const safeCount = typeof count === "number" && !isNaN(count) ? Math.max(0, count) : 0;

    if (safeCount === 0) return "bg-gray-800/50";
    if (safeCount === 1) return "bg-green-900/60";
    if (safeCount === 2) return "bg-green-700/70";
    if (safeCount >= 3 && safeCount < 6) return "bg-green-500/80";
    return "bg-green-400/90";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-52 gap-1">
            {Array.from({ length: 364 }).map((_, i) => (
              <div key={i} className="h-2.5 w-2.5 rounded-sm bg-white/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Validate and safe-guard contributions data
  const safeContributions = Array.isArray(contributions) ? contributions : [];

  if (error && safeContributions.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <div className="text-sm text-white/50">
          <p>Contribution graph unavailable</p>
          <p className="mt-1 text-xs">Unable to load GitHub data</p>
        </div>
        <div className="grid grid-cols-52 gap-1">
          {Array.from({ length: 364 }).map((_, i) => (
            <div key={i} className="h-2.5 w-2.5 rounded-sm bg-gray-800/30" />
          ))}
        </div>
      </div>
    );
  }

  // Group daily data by weeks for display
  const weeks: GitHubContribution[][] = [];
  let currentWeek: GitHubContribution[] = [];

  safeContributions.forEach((day, index) => {
    // Validate day object
    const safeDay = day && typeof day === "object" ? day : { date: "", contributionCount: 0 };
    currentWeek.push(safeDay);

    if (currentWeek.length === 7 || index === safeContributions.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-2.5 w-2.5 rounded-sm bg-gray-800/50" />
            <div className="h-2.5 w-2.5 rounded-sm bg-green-900/60" />
            <div className="h-2.5 w-2.5 rounded-sm bg-green-700/70" />
            <div className="h-2.5 w-2.5 rounded-sm bg-green-500/80" />
            <div className="h-2.5 w-2.5 rounded-sm bg-green-400/90" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const safeDay = day || { date: "", contributionCount: 0 };
                const contributionCount = safeDay.contributionCount || 0;
                const date = safeDay.date || `week-${weekIndex}-day-${dayIndex}`;

                return (
                  <motion.div
                    key={`${date}-${weekIndex}-${dayIndex}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: (weekIndex * 7 + dayIndex) * 0.002,
                    }}
                    whileHover={{ scale: 1.2 }}
                    className={`h-2.5 w-2.5 cursor-pointer rounded-sm border border-white/10 ${getColorIntensity(contributionCount)} transition-all hover:border-white/30`}
                    title={`${date}: ${contributionCount} contributions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-center text-xs text-yellow-400/70">
          ⚠️ Using cached contribution data
        </div>
      )}
    </div>
  );
}

/**
 * Animated profile avatar component
 */
function ProfileAvatar() {
  return (
    <div className="col-span-3 row-span-1 flex items-center justify-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative"
      >
        <img
          src="/home-avatar.png"
          alt="Profile Avatar"
          className="h-32 w-32 rounded-full border-4 border-white/30 shadow-2xl"
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
      <div className="col-span-9 row-span-1 flex flex-col justify-center space-y-3">
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
      <div className="col-span-9 row-span-1 flex flex-col justify-center space-y-3">
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
    <div className="col-span-9 row-span-1 flex flex-col justify-center space-y-3">
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
    <div className="col-span-3 row-span-1">
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
    <div className="col-span-3 row-span-1">
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="col-span-6 row-span-2">
      <GlassCard delay={0.4} className="h-full w-full">
        <div className="flex h-full flex-col space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">💖 {currentYear} GitHub Contributions</span>
            {error && (
              <span className="text-xs text-yellow-400/70" title="Data may be stale">
                ⚠️
              </span>
            )}
          </div>

          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-2/3 rounded bg-white/20"></div>
              <div className="h-4 w-1/2 rounded bg-white/10"></div>
              <div className="h-4 w-3/4 rounded bg-white/10"></div>
            </div>
          ) : error && !safeContributions.length ? (
            <div className="space-y-1 text-sm text-white/70">
              <p className="text-red-400/70">GitHub data unavailable</p>
              <p>Unable to load contribution data</p>
              <p className="text-xs text-white/50">Check network connection</p>
            </div>
          ) : (
            <div className="text-sm text-white/70">
              <p>
                {safeTotalContributions.toLocaleString()} contributions in {currentYear}
              </p>
              <p>{daysWithContributions} days of coding</p>
              <p>{safeRepos.length} public repositories</p>
              {error && <p className="mt-2 text-xs text-yellow-400/70">Using cached data</p>}
            </div>
          )}

          <div className="min-h-0 flex-1">
            <CommitGraphWithData />
          </div>
        </div>
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
    <div className="col-span-6 row-span-1">
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
 * Work experience timeline component
 */
function ExperienceCard() {
  const experiences = [
    { company: "Guangzhou University of Science", period: "2021-2023" },
    { company: "Guangzhou Flying Pig Technology", period: "2023-2024" },
    { company: "Guangzhou Starry Network", period: "2024-Present" },
  ];

  return (
    <div className="col-span-6 row-span-1">
      <GlassCard delay={0.6} className="h-full w-full">
        <div className="flex h-full flex-col justify-center space-y-4">
          {experiences.map((exp) => (
            <div key={exp.company} className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <span className="text-sm font-medium text-white">{exp.company}</span>
              <span className="ml-auto text-xs text-white/60">{exp.period}</span>
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
