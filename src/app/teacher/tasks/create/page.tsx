import type { Metadata } from 'next';
import { CreateTaskForm } from '@/components/teacher/CreateTaskForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { listClasses } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Buat Tugas — EssayFlow' };

export default async function CreateTaskPage() {
  await requireRole('pengajar', '/teacher/tasks/create');
  const classes = await listClasses();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Buat Tugas"
        description="Tentukan informasi tugas, cara pengumpulan, rubrik penilaian, dan pengaturan revisi."
      />
      <CreateTaskForm classes={classes} />
    </div>
  );
}
