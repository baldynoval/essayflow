import { CircleCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AIProcessing } from '@/components/student/AIProcessing';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Timeline } from '@/components/ui/Timeline';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatTime } from '@/lib/format';
import { getSubmission, getTask, latestVersion, releasedScore } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Status Pengumpulan — EssayFlow' };

const STEPS = ['Dikumpulkan', 'AI Menilai', 'Menunggu Review', 'Sudah Dinilai'];

function stepIndex(status: string): number {
  if (status === 'sudah-dinilai') return 3;
  if (status === 'menunggu-review') return 2;
  if (status === 'ai-menilai' || status === 'ai-gagal') return 1;
  return 1;
}

export default async function SubmissionStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('mahasiswa', `/student/submissions/${id}`);

  const submission = await getSubmission(id);
  if (!submission) notFound();
  const task = await getTask(submission.taskId);
  const version = latestVersion(submission);
  const released = releasedScore(submission);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Tugas berhasil dikumpulkan" description={task?.title} />

      <Card>
        <div className="flex items-start gap-3">
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
            <CircleCheck className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-body font-medium text-ink">Dikumpulkan pada {formatDate(version.submittedAt)}, {formatTime(version.submittedAt)}</p>
            <p className="mt-1 text-meta text-ink-2">
              {version.late ? 'Pengumpulan ditandai terlambat sesuai kebijakan tugas.' : 'Pengumpulan tercatat tepat waktu.'}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-line pt-8">
          <Timeline steps={STEPS.map((label) => ({ label }))} activeIndex={stepIndex(submission.status)} />
        </div>
      </Card>

      <Card>
        <h2 className="text-body font-medium text-ink">Status Penilaian</h2>
        <div className="mt-6">
          {submission.status === 'ai-gagal' ? (
            <Alert tone="danger" title="AI gagal menilai" action={<Button size="sm" variant="secondary">Coba Lagi</Button>}>
              Sistem sudah mencoba ulang secara otomatis. Pengajar telah diberi tahu dan pengumpulan Anda tetap tersimpan.
            </Alert>
          ) : released !== null ? (
            <Alert tone="success" title="Hasil penilaian sudah dirilis.">
              Anda dapat melihat nilai akhir dan feedback pada halaman Hasil Penilaian.
            </Alert>
          ) : submission.status === 'menunggu-review' ? (
            <Alert tone="info" title="Penilaian AI selesai. Menunggu review pengajar.">
              Nilai dan feedback ditampilkan setelah pengajar meninjau dan merilis hasil.
            </Alert>
          ) : (
            <>
              <AIProcessing />
              <Alert tone="info" className="mt-6">
                Penilaian AI sedang diproses. Hasil akan tersedia setelah ditinjau oleh pengajar.
                Anda dapat meninggalkan halaman ini; proses berjalan di latar belakang dan Anda akan diberi tahu.
              </Alert>
            </>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/student/tasks" variant="secondary">
            Kembali ke Tugas
          </Button>
          {released !== null && <Button href={`/student/results/${submission.id}`}>Lihat Hasil Penilaian</Button>}
        </div>
      </Card>
    </div>
  );
}
