import { Accordion } from '@/components/ui/Accordion';
import { totalWeight } from '@/lib/scoring';
import type { RubricCriterion } from '@/types/domain';

/** Expandable rubric overview reused by teacher task detail and student task pages. */
export function RubricSummary({ criteria }: { criteria: RubricCriterion[] }) {
  return (
    <div>
      <Accordion
        items={criteria.map((criterion) => ({
          id: criterion.id,
          title: `${criterion.name} — ${criterion.weight}%`,
          content: <p className="text-meta text-ink-2">{criterion.description ?? 'Tidak ada deskripsi.'}</p>,
        }))}
      />
      <p className="mt-4 flex items-center justify-between border-t border-line pt-4 text-meta">
        <span className="text-ink-2">Total bobot</span>
        <span className="font-medium tabular-nums text-ink">{totalWeight(criteria)}%</span>
      </p>
    </div>
  );
}
