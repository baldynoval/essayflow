import type { Metadata } from 'next';
import { ClassGrid } from '@/components/teacher/ClassGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';
import { listClasses } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Kelas — EssayFlow' };

export default async function ClassesPage() {
  await requireRole('pengajar', '/teacher/classes');
  const classes = await listClasses();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Kelas" description="Kelola kelas, kode kelas, dan permintaan bergabung mahasiswa." />
      <ClassGrid classes={classes} />
    </div>
  );
}
