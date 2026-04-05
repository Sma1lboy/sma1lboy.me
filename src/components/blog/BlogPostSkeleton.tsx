import { Skeleton } from "@/components/ui/skeleton";

export function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100">
      <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
        {/* Back link */}
        <Skeleton className="mb-10 h-5 w-20" />

        {/* Header */}
        <div className="mb-10">
          {/* Date + reading time */}
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-1" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title */}
          <Skeleton className="h-8 w-full sm:h-9" />
          <Skeleton className="mt-2 h-8 w-3/4 sm:h-9" />

          {/* Tags */}
          <div className="mt-4 flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
        </div>

        {/* Body content lines */}
        <div className="space-y-5">
          {/* Paragraph 1 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Code block placeholder */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-neutral-900">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Paragraph 3 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
