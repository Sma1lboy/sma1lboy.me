import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Github, Star, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { containerVariants, itemVariants } from "../../constants/home";
import { useGitHub } from "../../hooks/useGitHub";
import type { GitHubRepo } from "../../services/githubApi";

// Contribution heatmap component
function ContributionHeatmap({
  contributions,
}: {
  contributions: Array<{ date: string; contributionCount: number }>;
}) {
  const heatmapData = useMemo(() => {
    // Get last 53 weeks (1 year of data)
    const weeks: Array<Array<{ date: string; count: number }>> = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 365);

    // Group by weeks
    for (let i = 0; i < 53; i++) {
      const week: Array<{ date: string; count: number }> = [];
      for (let j = 0; j < 7; j++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i * 7 + j);
        const dateStr = date.toISOString().split("T")[0];
        const contribution = contributions.find((c) => c.date === dateStr);
        week.push({
          date: dateStr,
          count: contribution?.contributionCount || 0,
        });
      }
      weeks.push(week);
    }

    return weeks;
  }, [contributions]);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count <= 2) return "bg-green-200 dark:bg-green-900";
    if (count <= 5) return "bg-green-400 dark:bg-green-700";
    if (count <= 10) return "bg-green-600 dark:bg-green-600";
    return "bg-green-800 dark:bg-green-500";
  };

  if (heatmapData.length === 0 || contributions.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        No contribution data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-center overflow-x-auto sm:overflow-visible">
        <div className="inline-flex gap-1">
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-shrink-0 flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`h-3 w-3 rounded-sm ${getIntensity(day.count)}`}
                  title={`${day.date}: ${day.count} contributions`}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.1,
                    delay: Math.min((weekIndex * 7 + dayIndex) * 0.001, 0.5),
                  }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-600" />
          <div className="h-3 w-3 rounded-sm bg-green-800 dark:bg-green-500" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// Popular repositories component - show pinned repos or top starred repos
function PopularRepos({ repos }: { repos: GitHubRepo[] }) {
  const popularRepos = useMemo(() => {
    // If repos are already pinned (from GraphQL), use them directly
    // Otherwise, filter and sort to get top starred repos
    if (repos.length <= 6) {
      // Likely pinned repos, use as is
      return repos.filter((repo) => !repo.fork).slice(0, 6);
    }

    // Filter out forks and get top starred repos
    const filteredRepos = repos
      .filter((repo) => !repo.fork) // Exclude forks
      .sort((a, b) => {
        // Sort by stars first, then by updated date
        const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
        if (starDiff !== 0) return starDiff;
        return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      })
      .slice(0, 6); // Get top 6 repos
    return filteredRepos;
  }, [repos]);

  if (popularRepos.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        No repositories available
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {popularRepos.map((repo) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -2 }}
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {repo.name}
              </h3>
            </div>
            <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          {repo.description && (
            <p className="mb-3 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repo.stargazers_count || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{repo.forks_count || 0}</span>
            </div>
            {repo.language && (
              <span className="ml-auto rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">
                {repo.language}
              </span>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  );
}

// Stats component
function GitHubStats({
  repos,
  totalContributions,
}: {
  repos: GitHubRepo[];
  totalContributions: number;
}) {
  const totalStars = useMemo(() => {
    return repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
  }, [repos]);

  const totalForks = useMemo(() => {
    return repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
  }, [repos]);

  const stats = [
    {
      label: "Total Contributions",
      value: totalContributions.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Repository Stars",
      value: totalStars.toLocaleString(),
      icon: Star,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Public Repositories",
      value: repos.length.toLocaleString(),
      icon: Github,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Forks",
      value: totalForks.toLocaleString(),
      icon: GitBranch,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="mb-2 flex items-center justify-between">
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function GitHubActivitySection() {
  const { user, repos, contributions, totalContributions, loading, error } = useGitHub();

  if (loading) {
    return (
      <motion.section
        id="github-activity"
        className="bg-white px-4 py-12 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-24 dark:bg-gray-900"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-4 h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mx-auto h-4 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="space-y-8">
            <div className="h-32 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
            <div className="h-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </motion.section>
    );
  }

  // Show error state instead of returning null
  if (error || !user) {
    return (
      <motion.section
        id="github-activity"
        className="bg-white px-4 py-12 sm:px-8 sm:py-12 lg:px-16 lg:py-16 xl:px-24 dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mb-12 text-center sm:mb-16" variants={itemVariants}>
            <h2 className="mb-3 text-2xl font-light text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl dark:text-gray-100">
              GitHub Activity
            </h2>
            <p className="mx-auto max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400">
              Unable to load GitHub activity data at the moment.
            </p>
            {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">Error: {error}</p>}
            <motion.a
              href="https://github.com/Sma1lboy"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="h-4 w-4" />
              <span>View GitHub Profile</span>
              <ExternalLink className="h-3 w-3" />
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="github-activity"
      className="bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24 xl:px-24 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="mb-12 text-center sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="mb-3 text-2xl font-light text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl dark:text-gray-100">
            GitHub Activity
          </h2>
          <p className="mx-auto max-w-2xl text-base font-light text-gray-600 sm:text-lg dark:text-gray-400">
            My open-source contributions, popular repositories, and coding activity over the past
            year.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GitHubStats repos={repos} totalContributions={totalContributions} />
        </motion.div>

        {/* Contribution Heatmap */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mx-auto w-fit rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contribution Activity
            </h3>
            {contributions.length > 0 ? (
              <ContributionHeatmap contributions={contributions} />
            ) : (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Loading contribution data...
              </div>
            )}
          </div>
        </motion.div>

        {/* Popular Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Popular Repositories
          </h3>
          {repos.length > 0 ? (
            <PopularRepos repos={repos} />
          ) : (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No repositories available
            </div>
          )}
        </motion.div>

        {/* Link to GitHub Profile */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Github className="h-4 w-4" />
            <span>View GitHub Profile</span>
            <ExternalLink className="h-3 w-3" />
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
}
