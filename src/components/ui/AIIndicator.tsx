import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Small, quiet marker for anything AI-generated. */
export function AIIndicator({ label = 'AI', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 rounded-full bg-accent-soft px-2 text-caption font-medium text-accent shadow-ai',
        className,
      )}
    >
      <Sparkles className="size-3" aria-hidden />
      {label}
    </span>
  );
}
