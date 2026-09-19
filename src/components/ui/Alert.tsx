import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  /** Trailing action, e.g. a “Coba Lagi” button. */
  action?: ReactNode;
  className?: string;
}

const tones: Record<AlertTone, { wrapper: string; icon: typeof Info; iconClass: string }> = {
  info: { wrapper: 'border-line bg-surface text-ink', icon: Info, iconClass: 'text-ink-2' },
  success: { wrapper: 'border-success/20 bg-success-soft text-ink', icon: CircleCheck, iconClass: 'text-success' },
  warning: { wrapper: 'border-warning/20 bg-warning-soft text-ink', icon: TriangleAlert, iconClass: 'text-warning' },
  danger: { wrapper: 'border-danger/20 bg-danger-soft text-ink', icon: CircleAlert, iconClass: 'text-danger' },
};

/** Inline message for form-level errors, success confirmations and notices. */
export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  const { wrapper, icon: Icon, iconClass } = tones[tone];
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('flex items-start gap-3 rounded-sm border px-4 py-3', wrapper, className)}
    >
      <Icon className={cn('mt-0.5 size-4 shrink-0', iconClass)} aria-hidden />
      <div className="min-w-0 flex-1 text-meta">
        {title && <p className="font-medium text-ink">{title}</p>}
        {children && <div className={cn('text-ink-2', title && 'mt-1')}>{children}</div>}
      </div>
      {action}
    </div>
  );
}
