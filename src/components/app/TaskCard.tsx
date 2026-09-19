import { CalendarClock, Users } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatDate, formatTime } from '@/lib/format';
import type { Task, TaskStatus } from '@/types/domain';

export interface TaskCardProps {
  task: Task;
  className: string;
  href: string;
  /** Jumlah mahasiswa pada kelas tugas ini. */
  studentCount?: number;
  status?: TaskStatus;
}

export function TaskCard({ task, className, href, studentCount, status }: TaskCardProps) {
  return (
    <Card as="li" padding="sm" interactive className="list-none">
      <Link href={href} className="block rounded-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium text-ink">{task.title}</p>
            <p className="mt-1 truncate text-meta text-ink-2">{className}</p>
          </div>
          <StatusBadge status={status ?? task.status} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-caption text-ink-2">
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="size-3" aria-hidden />
            {formatDate(task.deadline)}, {formatTime(task.deadline)}
          </span>
          {studentCount !== undefined && (
            <span className="inline-flex items-center gap-2">
              <Users className="size-3" aria-hidden />
              {studentCount} mahasiswa
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
