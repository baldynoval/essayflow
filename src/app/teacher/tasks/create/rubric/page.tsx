import type { Metadata } from 'next';
import { RubricWorkspace } from '@/components/teacher/RubricWorkspace';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { requireRole } from '@/lib/auth/guard';

export const metadata: Metadata = { title: 'Rubrik AI — EssayFlow' };

export default async function RubricWorkspacePage() {
  await requireRole('pengajar', '/teacher/tasks/create/rubric');
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Rubrik Penilaian"
        description="Susun rubrik secara manual atau minta saran AI, lalu terapkan kriteria yang sesuai. Hasil AI tetap dapat diubah."
        actions={
          <Button href="/teacher/tasks/create" variant="secondary">
            Kembali ke Formulir Tugas
          </Button>
        }
      />
      <RubricWorkspace taskTitle="Analisis Algoritma Pencarian" />
    </div>
  );
}
