import { BookOpen, CircleAlert, FileCheck2, RefreshCcw, Send, Sparkles, type LucideIcon } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/format';
import type { ActivityItemData, ActivityKind } from '@/types/domain';
import { cn } from '@/lib/cn';

const ICONS: Record<ActivityKind, { icon: LucideIcon; tone: string }> = {
  pengumpulan: { icon: Send, tone: 'bg-muted text-ink-2' },
  'ai-selesai': { icon: Sparkles, tone: 'bg-accent-soft text-accent' },
  'ai-gagal': { icon: CircleAlert, tone: 'bg-danger-soft text-danger' },
  'hasil-dirilis': { icon: FileCheck2, tone: 'bg-success-soft text-success' },
  'kelas-baru': { icon: BookOpen, tone: 'bg-muted text-ink-2' },
  'tugas-baru': { icon: FileCheck2, tone: 'bg-muted text-ink-2' },
  revisi: { icon: RefreshCcw, tone: 'bg-warning-soft text-warning' },
};

export function ActivityItem({ item }: { item: ActivityItemData }) {
  const { icon: Icon, tone } = ICONS[item.kind];
  return (
    <li className="flex gap-3 border-b border-line py-4 last:border-b-0 last:pb-0 first:pt-0">
      <span className={cn('inline-flex size-8 shrink-0 items-center justify-center rounded-full', tone)}>
        <Icon className="size-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-meta font-medium text-ink">{item.title}</p>
        <p className="mt-1 text-caption text-ink-2">{item.description}</p>
        <p className="mt-1 text-caption text-ink-3">
          {formatDate(item.at)}, {formatTime(item.at)}
        </p>
      </div>
    </li>
  );
}
