import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  dot?: boolean;
}

const tones: Record<BadgeTone, { root: string; dot: string }> = {
  neutral: { root: 'bg-muted text-ink-2', dot: 'bg-ink-3' },
  accent: { root: 'bg-accent-soft text-accent', dot: 'bg-accent' },
  success: { root: 'bg-success-soft text-success', dot: 'bg-success' },
  warning: { root: 'bg-warning-soft text-warning', dot: 'bg-warning' },
  danger: { root: 'bg-danger-soft text-danger', dot: 'bg-danger' },
};

export function Badge({ tone = 'neutral', dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-2 whitespace-nowrap rounded-full px-3 text-caption font-medium',
        tones[tone].root,
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden className={cn('size-1 rounded-full', tones[tone].dot)} />}
      {children}
    </span>
  );
}
