import { CalendarClock, FileCheck2, Send, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RubricSummary } from '@/components/app/RubricSummary';
import { SubmissionTable, type SubmissionRow } from '@/components/teacher/SubmissionTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatTime } from '@/lib/format';
import { getClass, getTask, latestVersion, listStudents, listSubmissions } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Detail Tugas — EssayFlow' };

export default async function TeacherTaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('pengajar', `/teacher/tasks/${id}`);

  const task = await getTask(id);
  if (!task) notFound();

  const classRoom = await getClass(task.classId);
  const students = await listStudents(classRoom?.studentIds);
  const submissions = await listSubmissions({ taskId: task.id });
  const submissionByStudent = new Map(submissions.map((item) => [item.studentId, item]));

  const rows: SubmissionRow[] = students.map((student) => {
    const submission = submissionByStudent.get(student.id);
    if (!submission) {
      return {
        studentName: student.name,
        nim: student.nim,
        status: 'belum-mengumpulkan',
        aiScore: null,
        submittedAt: null,
      };
    }
    const version = latestVersion(submission);
    return {
      submissionId: submission.id,
      studentName: student.name,
      nim: student.nim,
      status: submission.status,
      aiScore: version.assessment?.aiScore ?? null,
      submittedAt: version.submittedAt,
    };
  });

  const stats = {
    students: students.length,
    submitted: submissions.length,
    waiting: submissions.filter((item) => item.status === 'menunggu-review').length,
    graded: submissions.filter((item) => item.status === 'sudah-dinilai').length,
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={task.title}
        meta={
          <>
            <StatusBadge status={task.status} />
            <span>{classRoom?.name ?? '—'}</span>
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="size-3" aria-hidden />
              {formatDate(task.deadline)}, {formatTime(task.deadline)}
            </span>
            <span>{students.length} mahasiswa</span>
          </>
        }
        actions={
          <Button href="/teacher/tasks/create/rubric" variant="secondary">
            Edit Rubrik
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Mahasiswa" value={stats.students} icon={Users} />
        <MetricCard label="Dikumpulkan" value={stats.submitted} icon={Send} />
        <MetricCard label="Menunggu Review" value={stats.waiting} icon={FileCheck2} tone="accent" />
        <MetricCard label="Sudah Dinilai" value={stats.graded} icon={FileCheck2} />
      </div>

      <Card>
        <h2 className="text-body font-medium text-ink">Rubrik Penilaian</h2>
        <div className="mt-6">
          <RubricSummary criteria={task.rubric} />
        </div>
      </Card>

      <Card>
        <h2 className="text-body font-medium text-ink">Daftar Mahasiswa</h2>
        <div className="mt-6">
          <SubmissionTable rows={rows} />
        </div>
      </Card>
    </div>
  );
}
