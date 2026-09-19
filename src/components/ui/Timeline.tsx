import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface TimelineStep {
  label: string;
  description?: string;
  at?: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  /** Index of the current step. Everything before it is complete. */
  activeIndex: number;
  className?: string;
}

/** Submission lifecycle: Dikumpulkan → AI Menilai → Menunggu Review → Sudah Dinilai. */
export function Timeline({ steps, activeIndex, className }: TimelineProps) {
  return (
    <ol className={cn('flex flex-col gap-0 sm:flex-row sm:gap-0', className)}>
      {steps.map((step, index) => {
        const done = index < activeIndex;
        const current = index === activeIndex;
        return (
          <li key={step.label} className="relative flex flex-1 gap-3 pb-6 sm:flex-col sm:pb-0">
            <div className="flex flex-col items-center sm:w-full sm:flex-row">
              <span
                className={cn(
                  'inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-caption font-medium',
                  done && 'border-success bg-success text-bg',
                  current && 'border-accent bg-accent-soft text-accent',
                  !done && !current && 'border-line bg-bg text-ink-3',
                )}
                aria-hidden
              >
                {done ? <Check className="size-3" /> : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn('mx-auto w-px flex-1 sm:mx-3 sm:h-px sm:w-auto sm:flex-1', done ? 'bg-success' : 'bg-line')}
                />
              )}
            </div>
            <div className="sm:mt-3 sm:pr-6">
              <p className={cn('text-meta font-medium', current ? 'text-ink' : done ? 'text-ink' : 'text-ink-2')}>
                {step.label}
              </p>
              {step.description && <p className="mt-1 text-caption text-ink-2">{step.description}</p>}
              {step.at && <p className="mt-1 text-caption text-ink-3">{step.at}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
