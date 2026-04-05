import { Skeleton } from "@/components/ui/skeleton";

export function GalleryPageSkeleton() {
  // Simulate varied image heights for masonry feel
  const heights = [200, 280, 180, 240, 300, 200, 260, 180, 220];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Back link */}
        <div className="mb-8">
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Header */}
        <div className="mb-10">
          <Skeleton className="h-9 w-40 sm:h-10" />
          <Skeleton className="mt-2 h-5 w-96 max-w-full" />
        </div>

        {/* Filter pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", "Work", "Events", "Travel", "Life"].map((cat) => (
            <Skeleton key={cat} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {heights.map((h, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <Skeleton
                className="w-full rounded-xl"
                height={h}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
