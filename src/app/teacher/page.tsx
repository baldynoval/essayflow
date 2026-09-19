import { ClipboardList, FileCheck2, Plus, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ActivityItem } from '@/components/app/ActivityItem';
import { TaskCard } from '@/components/app/TaskCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { listActivities, listClasses, listTasks, teacherStats } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Dasbor Pengajar — EssayFlow' };

export default async function TeacherDashboardPage() {
  const session = await requireRole('pengajar', '/teacher');
  const [stats, tasks, classes, activities] = await Promise.all([
    teacherStats(),
    listTasks(),
    listClasses(),
    listActivities(),
  ]);

  const classById = new Map(classes.map((item) => [item.id, item]));
  const recentTasks = tasks.filter((task) => task.status !== 'archived').slice(0, 3);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Selamat datang kembali, ${session.name}`}
        description="Berikut ringkasan aktivitas Anda hari ini."
        actions={
          <Button href="/teacher/tasks/create" iconLeft={<Plus className="size-4" aria-hidden />}>
            Buat Tugas
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tugas Aktif" value={stats.activeTasks} icon={ClipboardList} />
        <MetricCard label="Menunggu Review" value={stats.waitingReview} icon={FileCheck2} tone="accent" />
        <MetricCard label="Sudah Dinilai" value={stats.graded} icon={FileCheck2} />
        <MetricCard label="Mahasiswa" value={stats.students} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-body font-medium text-ink">Tugas Terbaru</h2>
            <Link href="/teacher/tasks" className="rounded-sm text-meta text-ink-2 hover:text-ink">
              Lihat Semua
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={ClipboardList}
              title="Belum ada tugas"
              description="Buat tugas pertama Anda untuk mulai menggunakan penilaian berbantuan AI."
              action={<Button href="/teacher/tasks/create">Buat Tugas</Button>}
            />
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {recentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  href={`/teacher/tasks/${task.id}`}
                  className={classById.get(task.classId)?.name ?? '—'}
                  studentCount={classById.get(task.classId)?.studentIds.length}
                />
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="text-body font-medium text-ink">Aktivitas Terbaru</h2>
          <ul className="mt-6">
            {activities.slice(0, 5).map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
