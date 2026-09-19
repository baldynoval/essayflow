import { CalendarClock, ClipboardList, GraduationCap, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { TaskCard } from '@/components/app/TaskCard';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { requireRole } from '@/lib/auth/guard';
import { formatDate, formatScore, formatTime } from '@/lib/format';
import {
  listClasses,
  listSubmissions,
  listTasks,
  releasedScore,
  studentStats,
} from '@/lib/data/repository';
import { CURRENT_STUDENT_ID } from '@/data/mock';

export const metadata: Metadata = { title: 'Dasbor Mahasiswa — EssayFlow' };

function daysUntil(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
}

export default async function StudentDashboardPage() {
  const session = await requireRole('mahasiswa', '/student');
  const studentId = CURRENT_STUDENT_ID;

  const [stats, tasks, classes, submissions] = await Promise.all([
    studentStats(studentId),
    listTasks(),
    listClasses(),
    listSubmissions({ studentId }),
  ]);

  const classById = new Map(classes.map((item) => [item.id, item]));
  const submissionByTask = new Map(submissions.map((item) => [item.taskId, item]));
  const activeTasks = tasks.filter((task) => task.status === 'active');
  const closing = activeTasks
    .filter((task) => daysUntil(task.deadline) <= 7)
    .sort((a, b) => (a.deadline < b.deadline ? -1 : 1));

  const results = submissions
    .map((submission) => ({ submission, score: releasedScore(submission) }))
    .filter((item): item is { submission: (typeof submissions)[number]; score: number } => item.score !== null);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Selamat datang, ${session.name}`}
        description="Semoga hari Anda menyenangkan. Berikut ringkasan tugas dan hasil penilaian Anda."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Rata-rata Nilai" value={formatScore(stats.average)} icon={TrendingUp} tone="accent" />
        <MetricCard label="Jumlah Tugas" value={stats.taskCount} icon={ClipboardList} />
        <MetricCard label="Tugas Selesai" value={stats.completed} icon={GraduationCap} />
        <MetricCard label="Nilai Terbaru" value={formatScore(stats.latest)} icon={TrendingUp} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-body font-medium text-ink">Tugas Aktif</h2>
            <Link href="/student/tasks" className="rounded-sm text-meta text-ink-2 hover:text-ink">
              Lihat Semua
            </Link>
          </div>
          {activeTasks.length === 0 ? (
            <EmptyState className="mt-6" icon={ClipboardList} title="Tidak ada tugas aktif" />
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  href={`/student/tasks/${task.id}`}
                  className={classById.get(task.classId)?.name ?? '—'}
                  status={task.status}
                />
              ))}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <h2 className="text-body font-medium text-ink">Hasil Penilaian Terbaru</h2>
            {results.length === 0 ? (
              <p className="mt-6 text-meta text-ink-2">Belum ada hasil yang dirilis pengajar.</p>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {results.map(({ submission, score }) => {
                  const task = tasks.find((item) => item.id === submission.taskId);
                  return (
                    <li key={submission.id} className="flex items-center justify-between gap-4">
                      <Link href={`/student/results/${submission.id}`} className="min-w-0 rounded-sm">
                        <p className="truncate text-meta font-medium text-ink">{task?.title ?? 'Tugas'}</p>
                        <p className="truncate text-caption text-ink-2">
                          {classById.get(task?.classId ?? '')?.name ?? '—'}
                        </p>
                      </Link>
                      <span className="shrink-0 text-body font-semibold tabular-nums text-ink">
                        {formatScore(score)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card>
            <h2 className="text-body font-medium text-ink">Segera Berakhir</h2>
            {closing.length === 0 ? (
              <p className="mt-6 text-meta text-ink-2">Tidak ada tenggat dalam waktu dekat.</p>
            ) : (
              <ul className="mt-6 flex flex-col gap-4">
                {closing.map((task) => {
                  const days = daysUntil(task.deadline);
                  const submission = submissionByTask.get(task.id);
                  return (
                    <li key={task.id} className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-meta font-medium text-ink">{task.title}</p>
                        <p className="mt-1 inline-flex items-center gap-2 text-caption text-ink-2">
                          <CalendarClock className="size-3" aria-hidden />
                          {formatDate(task.deadline)}, {formatTime(task.deadline)}
                        </p>
                      </div>
                      {submission ? (
                        <StatusBadge status={submission.status} />
                      ) : (
                        <Badge tone={days <= 1 ? 'danger' : 'warning'} dot>
                          {days <= 0 ? 'Hari ini' : `${days} hari lagi`}
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
