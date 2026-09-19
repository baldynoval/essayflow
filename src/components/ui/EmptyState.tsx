import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-bg px-6 py-16 text-center', className)}>
      {Icon && (
        <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-muted text-ink-3">
          <Icon className="size-4" aria-hidden />
        </span>
      )}
      <p className="text-body font-medium text-ink">{title}</p>
      {description && <p className="mt-2 max-w-copy text-body-sm text-ink-2">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
