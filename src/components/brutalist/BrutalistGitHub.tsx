import { useGitHub } from "@/hooks/useGitHub";
import { ExternalLink, Star, GitFork, Code } from "lucide-react";
import { useMemo } from "react";

export function BrutalistGitHub() {
  const { user, repos, totalContributions, loading, error } = useGitHub();

  const stats = useMemo(() => {
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
    const totalRepos = repos.filter((repo) => !repo.fork).length;

    return {
      totalRepos,
      totalStars,
      totalForks,
      totalContributions,
    };
  }, [repos, totalContributions]);

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-black px-4 py-16 dark:bg-white">
        <div className="animate-pulse text-6xl font-black text-white uppercase dark:text-black">
          LOADING...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-red-500 px-4 py-16">
        <div className="text-center text-4xl font-black text-white uppercase">
          ERROR LOADING
          <br />
          GITHUB DATA
        </div>
      </section>
    );
  }

  const topRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6);

  return (
    <section id="github-activity" className="min-h-screen bg-green-400 px-4 py-16 dark:bg-red-600">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 border-8 border-black bg-black p-8 dark:border-white dark:bg-white">
          <h2 className="text-5xl font-black text-white uppercase lg:text-7xl dark:text-black">
            GITHUB
            <br />
            ACTIVITY
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          <div className="border-8 border-black bg-red-500 p-6 dark:border-white">
            <div className="mb-2 text-xs font-black text-white uppercase">Total Repos</div>
            <div className="text-5xl font-black text-white">{stats.totalRepos}</div>
          </div>

          <div className="border-8 border-black bg-yellow-400 p-6 dark:border-white">
            <div className="mb-2 text-xs font-black text-black uppercase">Total Stars</div>
            <div className="text-5xl font-black text-black">{stats.totalStars}</div>
          </div>

          <div className="border-8 border-black bg-blue-500 p-6 dark:border-white">
            <div className="mb-2 text-xs font-black text-white uppercase">Total Forks</div>
            <div className="text-5xl font-black text-white">{stats.totalForks}</div>
          </div>

          <div className="border-8 border-black bg-purple-600 p-6 dark:border-white">
            <div className="mb-2 text-xs font-black text-white uppercase">Contributions</div>
            <div className="text-5xl font-black text-white">{stats.totalContributions}</div>
          </div>
        </div>

        {/* Popular Repositories */}
        <div className="mb-12">
          <div className="mb-6 border-8 border-black bg-blue-600 p-6 dark:border-white">
            <h3 className="text-3xl font-black text-white uppercase lg:text-4xl">POPULAR REPOS</h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="flex h-full flex-col border-8 border-black bg-white p-6 transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white dark:bg-black">
                  {/* Repo Name */}
                  <div className="mb-4 flex items-start justify-between">
                    <h4 className="flex-1 text-xl font-black break-words text-black uppercase dark:text-white">
                      {repo.name}
                    </h4>
                    <ExternalLink
                      size={24}
                      className="ml-2 flex-shrink-0 text-black transition-transform group-hover:rotate-45 dark:text-white"
                    />
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <div className="mb-4 flex-1 border-4 border-black bg-gray-100 p-3 dark:border-white dark:bg-gray-900">
                      <p className="line-clamp-3 text-sm font-bold text-black dark:text-white">
                        {repo.description}
                      </p>
                    </div>
                  )}

                  {/* Language */}
                  {repo.language && (
                    <div className="mb-4 inline-block border-4 border-black bg-yellow-300 px-3 py-2 dark:border-white dark:bg-yellow-600">
                      <span className="flex items-center gap-2 text-xs font-black text-black uppercase dark:text-white">
                        <Code size={16} />
                        {repo.language}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-auto flex gap-4">
                    <div className="flex items-center gap-2 border-4 border-black bg-red-500 px-3 py-2 dark:border-white">
                      <Star size={16} className="text-white" />
                      <span className="text-sm font-black text-white">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-2 border-4 border-black bg-blue-500 px-3 py-2 dark:border-white">
                      <GitFork size={16} className="text-white" />
                      <span className="text-sm font-black text-white">{repo.forks_count}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* GitHub Profile Link */}
        {user && (
          <div className="text-center">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-8 border-black bg-black px-12 py-6 text-2xl font-black text-white uppercase transition-transform hover:translate-x-2 hover:translate-y-2 dark:border-white dark:bg-white dark:text-black"
            >
              VIEW ON GITHUB →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
