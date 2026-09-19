import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReviewWorkspace } from '@/components/teacher/ReviewWorkspace';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { DEFAULT_RUBRIC } from '@/data/mock';
import {
  getClass,
  getStudent,
  getSubmission,
  getTask,
  latestVersion,
} from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Tinjau Penilaian AI — EssayFlow' };

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('pengajar', `/teacher/review/${id}`);

  const submission = await getSubmission(id);
  if (!submission) notFound();

  const [student, task] = await Promise.all([getStudent(submission.studentId), getTask(submission.taskId)]);
  if (!student || !task) notFound();

  const classRoom = await getClass(task.classId);
  const version = latestVersion(submission);

  if (!version.assessment) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title={task.title} description={`Pengumpulan ${student.name}`} />
        <Alert
          tone={submission.status === 'ai-gagal' ? 'danger' : 'info'}
          title={submission.status === 'ai-gagal' ? 'AI gagal menilai' : 'Penilaian AI sedang diproses'}
          action={<Button size="sm" variant="secondary">Coba Lagi</Button>}
        >
          {submission.status === 'ai-gagal'
            ? 'Sistem telah mencoba ulang secara otomatis namun tetap gagal. Pengumpulan belum ditandai selesai dinilai.'
            : 'Draf penilaian akan muncul di sini setelah proses AI selesai.'}
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Tinjau Penilaian"
        description={`${task.title} — ${student.name}`}
        actions={
          <Button href={`/teacher/tasks/${task.id}`} variant="secondary">
            Kembali ke Tugas
          </Button>
        }
      />
      <ReviewWorkspace
        student={{
          name: student.name,
          nim: student.nim,
          email: student.email,
          className: classRoom?.name ?? '—',
        }}
        taskTitle={task.title}
        version={version}
        initialCriteria={version.assessment.criteria.length ? version.assessment.criteria : DEFAULT_RUBRIC.map((c) => ({ ...c, score: 0 }))}
        initialFeedback={version.assessment.feedback}
      />
    </div>
  );
}
