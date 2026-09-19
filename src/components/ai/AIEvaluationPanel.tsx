'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, LoaderCircle } from 'lucide-react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { AI_STAGES, DEMO_CRITERIA } from '@/data/landing';
import { motionTokens } from '@/design/tokens';
import { cn } from '@/lib/cn';
import { weightedScore } from '@/lib/scoring';
import type { ScoredCriterion } from '@/types/domain';

export interface AIEvaluationPanelProps {
  /** Index of the stage currently running. -1 = not started. Last index = finished. */
  activeIndex: number;
  stages?: readonly string[];
  criteria?: ScoredCriterion[];
  className?: string;
}

/**
 * Structured AI panel: processing stages, then criterion scores and a draft score.
 * The result is always labelled as a draft — the teacher is the final decision maker.
 */
export function AIEvaluationPanel({
  activeIndex,
  stages = AI_STAGES,
  criteria = DEMO_CRITERIA,
  className,
}: AIEvaluationPanelProps) {
  const reduce = useReducedMotion();
  const lastIndex = stages.length - 1;
  const complete = activeIndex >= lastIndex;
  const total = weightedScore(criteria);

  return (
    <div className={cn('rounded-md border border-line bg-bg p-6 shadow-soft', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AIIndicator />
          <p className="text-body-sm font-semibold">AI EssayFlow</p>
        </div>
        <p className="text-meta text-ink-2" aria-live="polite">
          {complete ? 'Draf siap ditinjau' : activeIndex < 0 ? 'Menunggu jawaban' : 'Sedang diproses'}
        </p>
      </div>

      <ol className="mt-6 space-y-3" aria-label="Tahap pemrosesan AI">
        {stages.map((stage, i) => {
          const done = i < activeIndex || (complete && i === lastIndex);
          const running = i === activeIndex && !complete;
          return (
            <li key={stage} className="flex items-center gap-3 text-body-sm" aria-current={running ? 'step' : undefined}>
              <span
                className={cn(
                  'grid size-5 shrink-0 place-items-center rounded-full border transition-colors duration-300 motion-reduce:transition-none',
                  done && 'border-accent bg-accent text-on-accent',
                  running && 'border-accent-line bg-accent-soft text-accent',
                  !done && !running && 'border-line text-ink-3',
                )}
              >
                {done ? (
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                ) : running ? (
                  <LoaderCircle className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
                ) : null}
              </span>
              <span className={cn(done && 'text-ink', running && 'font-medium text-accent', !done && !running && 'text-ink-2')}>
                {stage}
              </span>
              <span className="sr-only">{done ? '— selesai' : running ? '— sedang berjalan' : '— menunggu'}</span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence initial={false}>
        {complete && (
          <motion.div
            key="result"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.slow, ease: motionTokens.ease }}
            className="overflow-hidden"
          >
            <div className="mt-6 border-t border-line pt-6">
              <ul className="space-y-4">
                {criteria.map((c, i) => (
                  <li key={c.id}>
                    <div className="flex items-baseline justify-between gap-4 text-body-sm">
                      <span>
                        {c.name} <span className="text-meta text-ink-2">({c.weight}%)</span>
                      </span>
                      <span className="font-semibold tabular-nums">{c.score}</span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-accent"
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: `${c.score}%` }}
                        transition={{ duration: reduce ? 0 : 0.8, ease: motionTokens.ease, delay: reduce ? 0 : 0.15 + i * 0.08 }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-end justify-between gap-4 rounded-sm bg-surface p-4">
                <ScoreDisplay score={total} label="Draf Nilai AI" size="lg" />
                <p className="max-w-[12rem] text-right text-meta text-ink-2">Menunggu tinjauan dan persetujuan pengajar.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
