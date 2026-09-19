import { History } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CURRENT_STUDENT_ID } from '@/data/mock';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatScore, formatTime } from '@/lib/format';
import { listSubmissions, listTasks, releasedScore } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Riwayat — EssayFlow' };

export default async function StudentHistoryPage() {
  await requireRole('mahasiswa', '/student/history');
  const [submissions, tasks] = await Promise.all([
    listSubmissions({ studentId: CURRENT_STUDENT_ID }),
    listTasks(),
  ]);
  const taskById = new Map(tasks.map((task) => [task.id, task]));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Riwayat" description="Seluruh pengumpulan Anda beserta versinya." />
      {submissions.length === 0 ? (
        <EmptyState icon={History} title="Belum ada riwayat" />
      ) : (
        <ul className="flex flex-col gap-4">
          {submissions.map((submission) => {
            const score = releasedScore(submission);
            const task = taskById.get(submission.taskId);
            return (
              <Card as="li" key={submission.id} className="list-none">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-ink">{task?.title ?? 'Tugas'}</p>
                    <p className="mt-1 text-caption text-ink-2">{submission.versions.length} versi</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={submission.status} />
                    {score !== null && <span className="text-body font-semibold tabular-nums text-ink">{formatScore(score)}</span>}
                  </div>
                </div>
                <ol className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
                  {submission.versions.map((version) => (
                    <li key={version.version} className="flex items-center justify-between gap-4 text-caption text-ink-2">
                      <span>Versi {version.version}</span>
                      <span>
                        {formatDate(version.submittedAt)}, {formatTime(version.submittedAt)}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-4 text-meta">
                  <Link href={`/student/submissions/${submission.id}`} className="rounded-sm text-ink-2 hover:text-ink">
                    Status pengumpulan
                  </Link>
                  {task?.settings.allowRevision && (
                    <Link href={`/student/tasks/${task.id}/revisions`} className="rounded-sm text-ink-2 hover:text-ink">
                      Riwayat revisi
                    </Link>
                  )}
                  {score !== null && (
                    <Link href={`/student/results/${submission.id}`} className="rounded-sm text-accent hover:underline">
                      Hasil penilaian
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
