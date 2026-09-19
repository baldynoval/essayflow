import { GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { CURRENT_STUDENT_ID } from '@/data/mock';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatScore } from '@/lib/format';
import { finalVersionOf, listSubmissions, listTasks, releasedScore } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Hasil Penilaian — EssayFlow' };

export default async function StudentResultsPage() {
  await requireRole('mahasiswa', '/student/results');
  const [submissions, tasks] = await Promise.all([
    listSubmissions({ studentId: CURRENT_STUDENT_ID }),
    listTasks(),
  ]);
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const released = submissions.filter((submission) => releasedScore(submission) !== null);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Hasil Penilaian" description="Hasil yang sudah ditinjau dan dirilis oleh pengajar." />
      {released.length === 0 ? (
        <EmptyState icon={GraduationCap} title="Belum ada hasil yang dirilis" description="Nilai tampil setelah pengajar menyetujui penilaian." />
      ) : (
        <ul className="flex flex-col gap-3">
          {released.map((submission) => {
            const score = releasedScore(submission) as number;
            const version = finalVersionOf(submission);
            return (
              <Card as="li" key={submission.id} interactive className="list-none">
                <Link href={`/student/results/${submission.id}`} className="flex items-center justify-between gap-4 rounded-sm">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-ink">{taskById.get(submission.taskId)?.title}</p>
                    <p className="mt-1 text-caption text-ink-2">
                      Versi {version.version} · dinilai {version.assessment?.reviewedAt ? formatDate(version.assessment.reviewedAt) : '—'}
                    </p>
                  </div>
                  <span className="shrink-0 text-sub font-semibold tabular-nums text-ink">{formatScore(score)}</span>
                </Link>
              </Card>
            );
          })}
        </ul>
      )}
    </div>
  );
}
