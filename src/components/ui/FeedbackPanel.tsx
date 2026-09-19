import { CircleAlert, Lightbulb, ThumbsUp } from 'lucide-react';
import type { Feedback } from '@/types/domain';
import { cn } from '@/lib/cn';

const SECTIONS = [
  { key: 'strengths', label: 'Yang sudah baik', icon: ThumbsUp, tone: 'text-success' },
  { key: 'improvements', label: 'Yang perlu diperbaiki', icon: CircleAlert, tone: 'text-danger' },
  { key: 'suggestions', label: 'Saran', icon: Lightbulb, tone: 'text-accent' },
] as const;

export interface FeedbackPanelProps {
  feedback: Feedback;
  className?: string;
  columns?: boolean;
}

/** Three fixed feedback sections. Editing is handled by the teacher review workspace. */
export function FeedbackPanel({ feedback, className, columns = true }: FeedbackPanelProps) {
  return (
    <div className={cn('grid gap-6', columns && 'md:grid-cols-3', className)}>
      {SECTIONS.map(({ key, label, icon: Icon, tone }) => (
        <section key={key}>
          <h3 className="flex items-center gap-2 text-meta font-medium text-ink">
            <Icon className={cn('size-4', tone)} aria-hidden />
            {label}
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {feedback[key].map((item, index) => (
              <li key={index} className="flex gap-2 text-meta text-ink-2">
                <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-ink-3" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
