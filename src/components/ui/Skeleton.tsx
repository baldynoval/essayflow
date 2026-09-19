import { cn } from '@/lib/cn';

/** Loading placeholder. Always aria-hidden — announce loading on the container instead. */
export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn('block animate-pulse rounded-sm bg-muted motion-reduce:animate-none', className)} />;
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-md border border-line bg-bg p-6">
      <Skeleton className="h-4 w-1/3" />
      <div className="mt-6 flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}
