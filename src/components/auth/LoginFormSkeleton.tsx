import { cn } from '@/lib/cn';

const bar = 'animate-pulse rounded-sm bg-muted motion-reduce:animate-none';

/** Loading state while the client form (which reads search params) hydrates. */
export function LoginFormSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-5">
      <div className={cn(bar, 'h-12 w-full')} />
      <div className="flex flex-col gap-2">
        <div className={cn(bar, 'h-4 w-1/4')} />
        <div className={cn(bar, 'h-12 w-full')} />
      </div>
      <div className="flex flex-col gap-2">
        <div className={cn(bar, 'h-4 w-1/4')} />
        <div className={cn(bar, 'h-12 w-full')} />
      </div>
      <div className={cn(bar, 'h-12 w-full')} />
    </div>
  );
}
