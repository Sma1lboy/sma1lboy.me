import { Skeleton } from "@/components/ui/skeleton";

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        {/* Back link */}
        <Skeleton className="mb-10 h-5 w-16" />

        {/* Header */}
        <div className="mb-14">
          <Skeleton className="h-8 w-28 sm:h-9" />
          <Skeleton className="mt-2 h-4 w-80 max-w-full" />
        </div>

        {/* Post list */}
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-5">
              {/* Date + reading time */}
              <div className="mb-2 flex items-center gap-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-1" />
                <Skeleton className="h-3 w-16" />
              </div>

              {/* Title */}
              <Skeleton className="h-5 w-4/5 sm:h-6" />

              {/* Excerpt */}
              <Skeleton className="mt-1.5 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-3/4" />

              {/* Tags */}
              <div className="mt-3 flex gap-1.5">
                <Skeleton className="h-5 w-14 rounded-md" />
                <Skeleton className="h-5 w-18 rounded-md" />
              </div>

              {/* Divider */}
              {i < 4 && (
                <div className="mt-5 border-b border-gray-100 dark:border-gray-800/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
