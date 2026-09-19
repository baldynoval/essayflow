import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { formatScore } from '@/lib/format';

type ScoreSize = 'md' | 'lg' | 'xl';

const sizes: Record<ScoreSize, string> = {
  md: 'text-sub',
  lg: 'text-page',
  xl: 'text-display',
};

export interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: ScoreSize;
  /** Optional badge / caption rendered next to the label. */
  aside?: ReactNode;
  className?: string;
}

/** Large numeric score (no ring charts). 87.5 -> "87,5" */
export function ScoreDisplay({ score, label = 'Nilai Akhir', size = 'lg', aside, className }: ScoreDisplayProps) {
  return (
    <div className={className} role="group" aria-label={`${label}: ${formatScore(score)}`}>
      <p aria-hidden className={cn('font-semibold leading-none tracking-tight tabular-nums', sizes[size])}>
        {formatScore(score)}
      </p>
      <div className="mt-2 flex items-center gap-2 text-meta text-ink-2">
        <span aria-hidden>{label}</span>
        {aside}
      </div>
    </div>
  );
}
