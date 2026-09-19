import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Decorative product frame used by landing previews. Hidden from assistive tech; adjacent copy carries the meaning. */
export function MockWindow({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn('select-none overflow-hidden rounded-md border border-line bg-bg shadow-panel', className)}>
      <div className="flex h-10 items-center gap-3 border-b border-line bg-surface px-4">
        <div className="flex gap-1">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
        </div>
        <p className="truncate text-caption text-ink-2">{title}</p>
      </div>
      {children}
    </div>
  );
}
