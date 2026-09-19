import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: 'default' | 'accent';
  className?: string;
}

/** Single statistic tile used by both dashboards and task detail. */
export function MetricCard({ label, value, icon: Icon, hint, tone = 'default', className }: MetricCardProps) {
  return (
    <Card padding="sm" className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center gap-2 text-meta text-ink-2">
        {Icon && (
          <span
            className={cn(
              'inline-flex size-6 items-center justify-center rounded-sm',
              tone === 'accent' ? 'bg-accent-soft text-accent' : 'bg-muted text-ink-2',
            )}
          >
            <Icon className="size-3" aria-hidden />
          </span>
        )}
        <span className="truncate">{label}</span>
      </div>
      <p className="text-page font-semibold leading-none tracking-tight tabular-nums text-ink">{value}</p>
      {hint && <p className="text-caption text-ink-2">{hint}</p>}
    </Card>
  );
}
