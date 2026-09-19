'use client';

import { Check, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { AI_STAGE_LABELS } from '@/types/domain';
import { cn } from '@/lib/cn';

/**
 * AI stage progress. The work conceptually runs in the background — the student may
 * leave this page at any time and will be notified when the analysis is finished.
 */
export function AIProcessing({ startIndex = 0 }: { startIndex?: number }) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (index >= AI_STAGE_LABELS.length - 1) return;
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 2200);
    return () => window.clearTimeout(timer);
  }, [index]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <AIIndicator label="AI EssayFlow" />
        <p className="text-meta text-ink-2">Analisis Algoritma Pencarian</p>
      </div>

      <ul className="mt-6 flex flex-col gap-3" aria-live="polite">
        {AI_STAGE_LABELS.map((stage, stageIndex) => {
          const done = stageIndex < index;
          const active = stageIndex === index;
          return (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex size-6 items-center justify-center rounded-full border',
                  done && 'border-success bg-success text-bg',
                  active && 'border-accent bg-accent-soft text-accent',
                  !done && !active && 'border-line bg-bg text-ink-3',
                )}
                aria-hidden
              >
                {done ? (
                  <Check className="size-3" />
                ) : active ? (
                  <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" />
                ) : (
                  <span className="size-1 rounded-full bg-ink-3" />
                )}
              </span>
              <span className={cn('text-body-sm', done || active ? 'text-ink' : 'text-ink-2')}>{stage}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
