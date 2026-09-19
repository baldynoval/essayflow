import { ClipboardList } from 'lucide-react';
import type { Metadata } from 'next';
import { TaskCard } from '@/components/app/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { listClasses, listTasks } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Tugas — EssayFlow' };

export default async function StudentTasksPage() {
  await requireRole('mahasiswa', '/student/tasks');
  const [tasks, classes] = await Promise.all([listTasks(), listClasses()]);
  const classById = new Map(classes.map((item) => [item.id, item]));
  const visible = tasks.filter((task) => task.status !== 'draft');

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Tugas" description="Seluruh tugas dari kelas yang Anda ikuti." />
      {visible.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Belum ada tugas" />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {visible.map((task) => (
            <TaskCard key={task.id} task={task} href={`/student/tasks/${task.id}`} className={classById.get(task.classId)?.name ?? '—'} />
          ))}
        </ul>
      )}
    </div>
  );
}
