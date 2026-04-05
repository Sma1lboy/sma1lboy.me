import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

/**
 * Base skeleton block with shimmer animation.
 * Uses a subtle gradient sweep over a dark/light background.
 */
export function Skeleton({ className, width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gray-200 dark:bg-neutral-800",
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: rounded,
      }}
    />
  );
}

/** Single line of text placeholder. */
export function SkeletonText({
  className,
  width,
  lines = 1,
}: {
  className?: string;
  width?: string;
  lines?: number;
}) {
  if (lines === 1) {
    return (
      <Skeleton
        className={cn("h-4", className)}
        width={width}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", className)}
          width={i === lines - 1 ? "60%" : width}
        />
      ))}
    </div>
  );
}

/** Card-shaped skeleton with optional header and body lines. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-white/10 dark:bg-neutral-900",
        className,
      )}
    >
      <Skeleton className="mb-3 h-5 w-2/5" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

/** Rectangular image placeholder. */
export function SkeletonImage({
  className,
  aspectRatio,
}: {
  className?: string;
  aspectRatio?: string;
}) {
  return (
    <div
      className={cn(
        "animate-shimmer w-full rounded-xl bg-gray-200 dark:bg-neutral-800",
        className,
      )}
      style={{ aspectRatio }}
    />
  );
}

/** Circular skeleton for avatars. */
export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn("shrink-0 rounded-full", className)}
      width={size}
      height={size}
    />
  );
}
