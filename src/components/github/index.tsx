import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  GitFork,
  RefreshCw,
  Star,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useGitHub } from "@/hooks/useGitHub";
import type { GitHubRepo } from "@/services/githubApi";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// --- Color helpers ---

const CONTRIBUTION_COLORS = [
  "bg-neutral-800", // 0
  "bg-emerald-900", // 1-2
  "bg-emerald-700", // 3-5
  "bg-emerald-500", // 6-8
  "bg-emerald-400", // 9+
] as const;

function getContributionColor(count: number) {
  if (count === 0) return CONTRIBUTION_COLORS[0];
  if (count <= 2) return CONTRIBUTION_COLORS[1];
  if (count <= 5) return CONTRIBUTION_COLORS[2];
  if (count <= 8) return CONTRIBUTION_COLORS[3];
  return CONTRIBUTION_COLORS[4];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Jupyter: "#DA5B0B",
  SCSS: "#c6538c",
};

function languageColor(lang: string) {
  return LANGUAGE_COLORS[lang] || "#8b949e";
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// --- Skeleton components ---

function SkeletonHeatmap() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
      <div className="grid grid-cols-[repeat(53,1fr)] gap-[3px]">
        {Array.from({ length: 53 * 7 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-sm bg-neutral-800" />
        ))}
      </div>
    </div>
  );
}

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-white/10 bg-neutral-900 p-5">
          <div className="mb-2 h-4 w-20 rounded bg-neutral-800" />
          <div className="h-8 w-16 rounded bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

function SkeletonRepoList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-white/10 bg-neutral-900 p-5"
        >
          <div className="mb-2 h-5 w-40 rounded bg-neutral-800" />
          <div className="mb-3 h-4 w-full rounded bg-neutral-800" />
          <div className="flex gap-4">
            <div className="h-4 w-16 rounded bg-neutral-800" />
            <div className="h-4 w-12 rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Main page ---

export default function GitHubActivityPage() {
  const { user, repos, contributions, totalContributions, loading, error } = useGitHub();

  if (error) {
    return <ErrorFallback message={error} />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">GitHub Activity</h1>
          <p className="mt-2 text-gray-400">Open source contributions and activity</p>
        </motion.div>

        {/* Stats */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          {loading ? <SkeletonStats /> : <StatsBar user={user} repos={repos} totalContributions={totalContributions} />}
        </motion.section>

        {/* Contribution Heatmap */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-200">Contributions</h2>
          {loading ? <SkeletonHeatmap /> : <ContributionHeatmap contributions={contributions} />}
        </motion.section>

        {/* Top Languages */}
        <motion.section
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-200">Top Languages</h2>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-neutral-800" />
              ))}
            </div>
          ) : (
            <TopLanguages repos={repos} />
          )}
        </motion.section>

        {/* Repo Activity Feed */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-200">Recent Repositories</h2>
          {loading ? <SkeletonRepoList /> : <RepoActivityFeed repos={repos} />}
        </motion.section>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatsBar({
  user,
  repos,
  totalContributions,
}: {
  user: ReturnType<typeof useGitHub>["user"];
  repos: ReturnType<typeof useGitHub>["repos"];
  totalContributions: number;
}) {
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  const stats = [
    { label: "Contributions", value: totalContributions },
    { label: "Public Repos", value: user?.public_repos ?? repos.length },
    { label: "Total Stars", value: totalStars },
    { label: "Followers", value: user?.followers ?? 0 },
    { label: "Forks", value: totalForks },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="rounded-xl border border-white/10 bg-neutral-900 p-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease }}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{s.label}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            {s.value.toLocaleString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ContributionHeatmap({
  contributions,
}: {
  contributions: { date: string; contributionCount: number }[];
}) {
  // Organize by weeks (columns) — each column is a week, 7 rows
  const weeks: { date: string; count: number }[][] = [];
  let currentWeek: { date: string; count: number }[] = [];

  // Pad start so first column starts on Sunday
  if (contributions.length > 0) {
    const firstDay = new Date(contributions[0].date).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push({ date: "", count: -1 }); // empty cell
    }
  }

  for (const c of contributions) {
    currentWeek.push({ date: c.date, count: c.contributionCount });
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Month labels
  const months: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const validCell = weeks[w].find((c) => c.date);
    if (validCell) {
      const m = new Date(validCell.date).getMonth();
      if (m !== lastMonth) {
        months.push({
          label: new Date(validCell.date).toLocaleString("en", { month: "short" }),
          col: w,
        });
        lastMonth = m;
      }
    }
  }

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900 p-4">
      {/* Month labels */}
      <div className="mb-1 flex" style={{ paddingLeft: 32 }}>
        {months.map((m, i) => {
          const nextCol = i < months.length - 1 ? months[i + 1].col : weeks.length;
          const span = nextCol - m.col;
          return (
            <span
              key={`${m.label}-${m.col}`}
              className="text-xs text-gray-500"
              style={{ width: span * 14, minWidth: span * 14, flexShrink: 0 }}
            >
              {m.label}
            </span>
          );
        })}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="mr-1 flex flex-col justify-between" style={{ width: 28 }}>
          {dayLabels.map((d, i) => (
            <span key={i} className="text-[10px] leading-[14px] text-gray-500">
              {d}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell, di) => (
                <motion.div
                  key={`${wi}-${di}`}
                  className={`h-[11px] w-[11px] rounded-sm ${cell.count < 0 ? "bg-transparent" : getContributionColor(cell.count)}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: wi * 0.008,
                    ease,
                  }}
                  title={cell.date ? `${cell.date}: ${cell.count} contributions` : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-gray-500">
        <span>Less</span>
        {CONTRIBUTION_COLORS.map((c, i) => (
          <div key={i} className={`h-[11px] w-[11px] rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function TopLanguages({ repos }: { repos: GitHubRepo[] }) {
  const langMap = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) {
      langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
    }
  }

  const sorted = [...langMap.entries()].sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((s, [, v]) => s + v, 0);

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500">No language data available</p>;
  }

  return (
    <div className="space-y-4">
      {/* Horizontal bar */}
      <div className="flex h-3 overflow-hidden rounded-full">
        {sorted.map(([lang, count], i) => (
          <motion.div
            key={lang}
            className="h-full"
            style={{ backgroundColor: languageColor(lang), width: `${(count / total) * 100}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.03, ease }}
          />
        ))}
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {sorted.map(([lang, count], i) => (
          <motion.span
            key={lang}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-900 px-3 py-1 text-sm text-gray-300"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.04, ease }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: languageColor(lang) }}
            />
            {lang}
            <span className="text-gray-500">{((count / total) * 100).toFixed(0)}%</span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function RepoActivityFeed({ repos }: { repos: GitHubRepo[] }) {
  const sorted = [...repos].sort(
    (a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime(),
  );

  if (sorted.length === 0) {
    return <p className="text-sm text-gray-500">No repositories found</p>;
  }

  return (
    <div className="space-y-3">
      {sorted.map((repo, i) => (
        <motion.a
          key={repo.id}
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-white/10 bg-neutral-900 p-5 transition-colors hover:border-emerald-500/30 hover:bg-neutral-900/80"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 + i * 0.04, ease }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="shrink-0 text-emerald-400" />
                <h3 className="truncate font-semibold text-gray-100 group-hover:text-emerald-400">
                  {repo.name}
                </h3>
              </div>
              {repo.description && (
                <p className="mt-1 line-clamp-2 text-sm text-gray-400">{repo.description}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: languageColor(repo.language) }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {repo.stargazers_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {repo.forks_count || 0}
                </span>
                {repo.updated_at && <span>{relativeTime(repo.updated_at)}</span>}
              </div>
            </div>
            <ExternalLink
              size={14}
              className="shrink-0 text-gray-600 transition-colors group-hover:text-emerald-400"
            />
          </div>
        </motion.a>
      ))}
    </div>
  );
}

function ErrorFallback({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-gray-100">
      <div className="text-center">
        <p className="mb-4 text-lg text-gray-400">Failed to load GitHub data</p>
        <p className="mb-6 text-sm text-gray-500">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-neutral-900 px-4 py-2 text-sm transition-colors hover:bg-neutral-800"
        >
          <RefreshCw size={14} />
          Retry
        </button>
        <div className="mt-4">
          <Link to="/" className="text-sm text-gray-500 hover:text-white">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
