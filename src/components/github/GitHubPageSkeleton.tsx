import { Skeleton } from "@/components/ui/skeleton";

function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-neutral-900"
        >
          <Skeleton className="mb-2 h-4 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

function SkeletonHeatmap() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-32" />
      <div className="grid grid-cols-[repeat(53,1fr)] gap-[3px]">
        {Array.from({ length: 53 * 7 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-sm" />
        ))}
      </div>
    </div>
  );
}

function SkeletonLanguages() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-full" />
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
          className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-neutral-900"
        >
          <Skeleton className="mb-2 h-5 w-40" />
          <Skeleton className="mb-3 h-4 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function GitHubPageSkeleton() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Back link placeholder */}
        <Skeleton className="mb-8 h-5 w-16" />

        {/* Header */}
        <div className="mb-12">
          <Skeleton className="h-9 w-64 sm:h-10" />
          <Skeleton className="mt-2 h-5 w-80" />
        </div>

        {/* Stats */}
        <div className="mb-12">
          <SkeletonStats />
        </div>

        {/* Heatmap */}
        <div className="mb-12">
          <Skeleton className="mb-4 h-6 w-32" />
          <SkeletonHeatmap />
        </div>

        {/* Languages */}
        <div className="mb-12">
          <Skeleton className="mb-4 h-6 w-36" />
          <SkeletonLanguages />
        </div>

        {/* Repos */}
        <div>
          <Skeleton className="mb-4 h-6 w-48" />
          <SkeletonRepoList />
        </div>
      </div>
    </div>
  );
}
