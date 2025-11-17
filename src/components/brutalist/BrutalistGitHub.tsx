import { useGitHub } from '@/hooks/useGitHub';
import { ExternalLink, Star, GitFork, Code } from 'lucide-react';
import { useMemo } from 'react';

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
      <section className="min-h-screen py-16 px-4 bg-black dark:bg-white flex items-center justify-center">
        <div className="text-6xl font-black text-white dark:text-black uppercase animate-pulse">
          LOADING...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen py-16 px-4 bg-red-500 flex items-center justify-center">
        <div className="text-4xl font-black text-white uppercase text-center">
          ERROR LOADING<br />GITHUB DATA
        </div>
      </section>
    );
  }

  const topRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 6);

  return (
    <section
      id="github-activity"
      className="min-h-screen py-16 px-4 bg-green-400 dark:bg-red-600"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 bg-black dark:bg-white p-8 border-8 border-black dark:border-white">
          <h2 className="text-5xl lg:text-7xl font-black uppercase text-white dark:text-black">
            GITHUB<br />ACTIVITY
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-red-500 p-6 border-8 border-black dark:border-white">
            <div className="text-white font-black text-xs uppercase mb-2">
              Total Repos
            </div>
            <div className="text-white font-black text-5xl">
              {stats.totalRepos}
            </div>
          </div>

          <div className="bg-yellow-400 p-6 border-8 border-black dark:border-white">
            <div className="text-black font-black text-xs uppercase mb-2">
              Total Stars
            </div>
            <div className="text-black font-black text-5xl">
              {stats.totalStars}
            </div>
          </div>

          <div className="bg-blue-500 p-6 border-8 border-black dark:border-white">
            <div className="text-white font-black text-xs uppercase mb-2">
              Total Forks
            </div>
            <div className="text-white font-black text-5xl">
              {stats.totalForks}
            </div>
          </div>

          <div className="bg-purple-600 p-6 border-8 border-black dark:border-white">
            <div className="text-white font-black text-xs uppercase mb-2">
              Contributions
            </div>
            <div className="text-white font-black text-5xl">
              {stats.totalContributions}
            </div>
          </div>
        </div>

        {/* Popular Repositories */}
        <div className="mb-12">
          <div className="bg-blue-600 p-6 border-8 border-black dark:border-white mb-6">
            <h3 className="text-3xl lg:text-4xl font-black uppercase text-white">
              POPULAR REPOS
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="bg-white dark:bg-black p-6 border-8 border-black dark:border-white hover:translate-x-2 hover:translate-y-2 transition-transform h-full flex flex-col">
                  {/* Repo Name */}
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-xl font-black uppercase text-black dark:text-white flex-1 break-words">
                      {repo.name}
                    </h4>
                    <ExternalLink
                      size={24}
                      className="text-black dark:text-white group-hover:rotate-45 transition-transform flex-shrink-0 ml-2"
                    />
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <div className="bg-gray-100 dark:bg-gray-900 p-3 border-4 border-black dark:border-white mb-4 flex-1">
                      <p className="text-sm font-bold text-black dark:text-white line-clamp-3">
                        {repo.description}
                      </p>
                    </div>
                  )}

                  {/* Language */}
                  {repo.language && (
                    <div className="bg-yellow-300 dark:bg-yellow-600 px-3 py-2 border-4 border-black dark:border-white inline-block mb-4">
                      <span className="text-black dark:text-white font-black text-xs uppercase flex items-center gap-2">
                        <Code size={16} />
                        {repo.language}
                      </span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex gap-4 mt-auto">
                    <div className="bg-red-500 px-3 py-2 border-4 border-black dark:border-white flex items-center gap-2">
                      <Star size={16} className="text-white" />
                      <span className="text-white font-black text-sm">
                        {repo.stargazers_count}
                      </span>
                    </div>
                    <div className="bg-blue-500 px-3 py-2 border-4 border-black dark:border-white flex items-center gap-2">
                      <GitFork size={16} className="text-white" />
                      <span className="text-white font-black text-sm">
                        {repo.forks_count}
                      </span>
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
              className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-6 border-8 border-black dark:border-white font-black text-2xl uppercase hover:translate-x-2 hover:translate-y-2 transition-transform"
            >
              VIEW ON GITHUB →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
