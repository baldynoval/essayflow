import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CriteriaScores } from '@/components/app/CriteriaScores';
import { Accordion } from '@/components/ui/Accordion';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FeedbackPanel } from '@/components/ui/FeedbackPanel';
import { PageHeader } from '@/components/ui/PageHeader';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatScore } from '@/lib/format';
import { finalVersionOf, getClass, getSubmission, getTask, releasedScore } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Hasil Penilaian — EssayFlow' };

export default async function StudentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('mahasiswa', `/student/results/${id}`);

  const submission = await getSubmission(id);
  if (!submission) notFound();

  const score = releasedScore(submission);
  const task = await getTask(submission.taskId);
  const classRoom = task ? await getClass(task.classId) : undefined;
  const version = finalVersionOf(submission);

  // Sebelum pengajar merilis, mahasiswa tidak boleh melihat nilai, kriteria, atau feedback.
  if (score === null || !version.assessment) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Hasil Penilaian" description={task?.title} />
        <Alert tone="info" title="Penilaian AI selesai. Menunggu review pengajar.">
          Nilai dan feedback akan tampil setelah pengajar menyetujui dan merilis hasil.
        </Alert>
        <Button href={`/student/submissions/${submission.id}`} variant="secondary" className="self-start">
          Lihat Status Pengumpulan
        </Button>
      </div>
    );
  }

  const assessment = version.assessment;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hasil Penilaian"
        description={task?.title}
        meta={
          <>
            <StatusBadge status="sudah-dinilai" />
            <span>{classRoom?.name ?? '—'}</span>
            <span>Versi {version.version}</span>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <ScoreDisplay score={score} size="xl" label="Nilai Akhir" />
          <dl className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-meta">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Pengajar</dt>
              <dd className="text-ink">{assessment.reviewedBy ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Kelas</dt>
              <dd className="text-ink">{classRoom?.name ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-2">Tanggal Penilaian</dt>
              <dd className="text-ink">{assessment.reviewedAt ? formatDate(assessment.reviewedAt) : '—'}</dd>
            </div>
            {assessment.adjustedScore !== undefined && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Nilai AI</dt>
                <dd className="text-ink">{formatScore(assessment.aiScore)}</dd>
              </div>
            )}
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-body font-medium text-ink">Nilai per Kriteria</h2>
          <CriteriaScores className="mt-6" criteria={assessment.criteria} />
          <div className="mt-8 border-t border-line pt-6">
            <Accordion
              items={assessment.criteria.map((criterion) => ({
                id: criterion.id,
                title: `${criterion.name} — ${formatScore(criterion.score)}`,
                content: <p className="text-meta text-ink-2">{criterion.description ?? 'Tidak ada deskripsi kriteria.'}</p>,
              }))}
            />
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-body font-medium text-ink">Feedback</h2>
        <FeedbackPanel className="mt-6" feedback={assessment.feedback} />
      </Card>

      <Card>
        <h2 className="text-body font-medium text-ink">Perbandingan</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section>
            <h3 className="text-meta font-medium text-ink">Jawaban Anda</h3>
            <p className="mt-3 max-h-80 overflow-y-auto whitespace-pre-wrap text-meta leading-relaxed text-ink-2">
              {version.content}
            </p>
          </section>
          <section>
            <h3 className="text-meta font-medium text-ink">Evaluasi</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {assessment.criteria.map((criterion) => (
                <li key={criterion.id} className="rounded-sm border border-line p-4">
                  <p className="flex items-baseline justify-between gap-4 text-meta">
                    <span className="text-ink">{criterion.name}</span>
                    <span className="tabular-nums text-ink">{formatScore(criterion.score)}</span>
                  </p>
                  {criterion.description && <p className="mt-2 text-caption text-ink-2">{criterion.description}</p>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Card>
    </div>
  );
}
