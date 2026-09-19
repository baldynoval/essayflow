import type { SubmissionStatus, TaskStatus } from '@/types/domain';
import { Badge, type BadgeProps, type BadgeTone } from './Badge';

export type StatusKey = TaskStatus | SubmissionStatus;

const STATUS: Record<StatusKey, { label: string; tone: BadgeTone }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  active: { label: 'Aktif', tone: 'success' },
  closed: { label: 'Ditutup', tone: 'neutral' },
  archived: { label: 'Diarsipkan', tone: 'neutral' },
  'belum-mengumpulkan': { label: 'Belum Mengumpulkan', tone: 'danger' },
  dikumpulkan: { label: 'Dikumpulkan', tone: 'neutral' },
  terlambat: { label: 'Terlambat', tone: 'warning' },
  'ai-menilai': { label: 'AI Menilai', tone: 'accent' },
  'ai-gagal': { label: 'AI gagal menilai', tone: 'danger' },
  'menunggu-review': { label: 'Menunggu Review', tone: 'warning' },
  'sudah-dinilai': { label: 'Sudah Dinilai', tone: 'success' },
};

export function statusLabel(status: StatusKey) {
  return STATUS[status].label;
}

export function StatusBadge({ status, ...props }: { status: StatusKey } & Omit<BadgeProps, 'tone' | 'children'>) {
  const { label, tone } = STATUS[status];
  return (
    <Badge tone={tone} dot {...props}>
      {label}
    </Badge>
  );
}
