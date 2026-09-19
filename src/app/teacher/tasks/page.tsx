import { ClipboardList, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import { TaskCard } from '@/components/app/TaskCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { listClasses, listTasks } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Tugas — EssayFlow' };

export default async function TeacherTasksPage() {
  await requireRole('pengajar', '/teacher/tasks');
  const [tasks, classes] = await Promise.all([listTasks(), listClasses()]);
  const classById = new Map(classes.map((item) => [item.id, item]));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Tugas"
        description="Seluruh tugas yang Anda kelola beserta statusnya."
        actions={
          <Button href="/teacher/tasks/create" iconLeft={<Plus className="size-4" aria-hidden />}>
            Buat Tugas
          </Button>
        }
      />
      {tasks.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Belum ada tugas" action={<Button href="/teacher/tasks/create">Buat Tugas</Button>} />
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {tasks.map((task) => (
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
    </div>
  );
}
