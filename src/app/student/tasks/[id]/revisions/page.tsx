import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CURRENT_STUDENT_ID } from '@/data/mock';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatScore, formatTime } from '@/lib/format';
import { getTask, listSubmissions } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Riwayat Revisi — EssayFlow' };

export default async function RevisionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('mahasiswa', `/student/tasks/${id}/revisions`);

  const task = await getTask(id);
  if (!task) notFound();
  const [submission] = await listSubmissions({ taskId: id, studentId: CURRENT_STUDENT_ID });

  const versions = submission ? [...submission.versions].reverse() : [];
  const used = versions.length > 0 ? versions.length - 1 : 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Riwayat Revisi"
        description={task.title}
        meta={
          task.settings.allowRevision ? (
            <Badge tone="accent" dot>
              Revisi Diizinkan
            </Badge>
          ) : (
            <Badge dot>Revisi Tidak Diizinkan</Badge>
          )
        }
        actions={
          <Button href={`/student/tasks/${task.id}`} variant="secondary">
            Kembali ke Tugas
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card padding="sm">
          <p className="text-meta text-ink-2">Batas Revisi</p>
          <p className="mt-2 text-sub font-semibold tabular-nums text-ink">{task.settings.maxRevisions}</p>
        </Card>
        <Card padding="sm">
          <p className="text-meta text-ink-2">Revisi Digunakan</p>
          <p className="mt-2 text-sub font-semibold tabular-nums text-ink">{used}</p>
        </Card>
        <Card padding="sm">
          <p className="text-meta text-ink-2">Deadline Revisi</p>
          <p className="mt-2 text-body font-medium text-ink">
            {task.settings.revisionDeadline ? formatDate(task.settings.revisionDeadline) : '—'}
          </p>
        </Card>
      </div>

      {versions.length === 0 ? (
        <EmptyState title="Belum ada pengumpulan" description="Riwayat versi muncul setelah Anda mengumpulkan tugas." />
      ) : (
        <ol className="flex flex-col gap-4">
          {versions.map((version, index) => {
            const primary = index === 0;
            const score =
              version.assessment && version.assessment.released
                ? version.assessment.adjustedScore ?? version.assessment.aiScore
                : null;
            return (
              <Card as="li" key={version.version} className="list-none">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-3 text-body font-medium text-ink">
                      Versi {version.version}
                      {primary && <Badge tone="accent">Versi Terbaru</Badge>}
                    </p>
                    <p className="mt-1 text-meta text-ink-2">
                      {formatDate(version.submittedAt)}, {formatTime(version.submittedAt)}
                      {version.late && ' · Terlambat'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={version.status} />
                    {score !== null && (
                      <span className="text-sub font-semibold tabular-nums text-ink">{formatScore(score)}</span>
                    )}
                  </div>
                </div>
                {primary && (
                  <p className="mt-4 max-h-40 overflow-y-auto whitespace-pre-wrap border-t border-line pt-4 text-meta leading-relaxed text-ink-2">
                    {version.content}
                  </p>
                )}
                {score !== null && submission && (
                  <Link
                    href={`/student/results/${submission.id}`}
                    className="mt-4 inline-block rounded-sm text-meta text-accent hover:underline"
                  >
                    Lihat hasil penilaian versi ini
                  </Link>
                )}
              </Card>
            );
          })}
        </ol>
      )}
    </div>
  );
}
