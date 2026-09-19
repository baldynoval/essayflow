import { formatScore } from '@/lib/format';
import type { ScoredCriterion } from '@/types/domain';
import { cn } from '@/lib/cn';

/** Criterion score list with a subtle progress bar — no ring charts. */
export function CriteriaScores({ criteria, className }: { criteria: ScoredCriterion[]; className?: string }) {
  return (
    <ul className={cn('flex flex-col gap-4', className)}>
      {criteria.map((criterion) => (
        <li key={criterion.id}>
          <div className="flex items-baseline justify-between gap-4">
            <span className="min-w-0 truncate text-meta text-ink">{criterion.name}</span>
            <span className="shrink-0 text-meta tabular-nums text-ink">
              {formatScore(criterion.score)}
              <span className="ml-2 text-caption text-ink-2">{criterion.weight}%</span>
            </span>
          </div>
          <div aria-hidden className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
            <span className="block h-full rounded-full bg-accent" style={{ width: `${criterion.score}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
