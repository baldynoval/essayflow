import { CalendarClock } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RubricSummary } from '@/components/app/RubricSummary';
import { SubmissionForm } from '@/components/student/SubmissionForm';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CURRENT_STUDENT_ID } from '@/data/mock';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatTime } from '@/lib/format';
import { getClass, getTask, listSubmissions } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Detail Tugas — EssayFlow' };

export default async function StudentTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('mahasiswa', `/student/tasks/${id}`);

  const task = await getTask(id);
  if (!task || task.status === 'draft') notFound();

  const classRoom = await getClass(task.classId);
  const [submission] = await listSubmissions({ taskId: task.id, studentId: CURRENT_STUDENT_ID });

  const past = new Date(task.deadline).getTime() < Date.now();
  const policy = task.settings.latePolicy;
  const locked =
    (past && policy === 'tidak-diizinkan') || task.status === 'closed' || task.status === 'archived';
  const lockReason =
    task.status === 'closed' || task.status === 'archived'
      ? 'Tugas ini sudah ditutup oleh pengajar.'
      : 'Tenggat telah lewat dan tugas ini tidak menerima pengumpulan terlambat.';

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={task.title}
        meta={
          <>
            {submission ? <StatusBadge status={submission.status} /> : <StatusBadge status={task.status} />}
            <span>{classRoom?.name ?? '—'}</span>
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="size-3" aria-hidden />
              {formatDate(task.deadline)}, {formatTime(task.deadline)}
            </span>
          </>
        }
        actions={
          task.settings.allowRevision ? (
            <Button href={`/student/tasks/${task.id}/revisions`} variant="secondary">
              Riwayat Revisi
            </Button>
          ) : undefined
        }
      />

      {past && policy !== 'tidak-diizinkan' && !locked && (
        <Alert tone="warning" title="Anda mengumpulkan setelah tenggat">
          Pengumpulan akan ditandai <strong>Terlambat</strong>
          {policy === 'maksimal-keterlambatan' && task.settings.maxLateHours
            ? ` dan hanya diterima sampai ${task.settings.maxLateHours} jam setelah tenggat.`
            : ' dan diterima sampai tugas ditutup.'}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <h2 className="text-body font-medium text-ink">Instruksi Tugas</h2>
            <p className="mt-4 whitespace-pre-wrap text-body-sm leading-relaxed text-ink-2">{task.instructions}</p>
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Kumpulkan Tugas</h2>
            <div className="mt-6">
              {submission ? (
                <Alert tone="info" title="Anda sudah mengumpulkan tugas ini">
                  Status saat ini diperlihatkan pada halaman pengumpulan.
                </Alert>
              ) : (
                <SubmissionForm taskId={task.id} settings={task.settings} locked={locked} lockReason={lockReason} />
              )}
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="text-body font-medium text-ink">Rubrik Penilaian</h2>
          <div className="mt-6">
            <RubricSummary criteria={task.rubric} />
          </div>
        </Card>
      </div>
    </div>
  );
}
