import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Badges, status, metadata shown under the title. */
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/** Consistent page title block for every application page. */
export function PageHeader({ title, description, meta, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 md:flex-row md:items-start md:justify-between', className)}>
      <div className="min-w-0">
        <h1 className="text-sub text-ink md:text-section">{title}</h1>
        {description && <p className="mt-2 max-w-copy-lg text-body-sm text-ink-2">{description}</p>}
        {meta && <div className="mt-4 flex flex-wrap items-center gap-3 text-meta text-ink-2">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
