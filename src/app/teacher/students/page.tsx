import type { Metadata } from 'next';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Table, TableWrapper, Td, Th, Tr } from '@/components/ui/Table';
import { requireRole } from '@/lib/auth/guard';
import { listClasses, listStudents } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Mahasiswa — EssayFlow' };

export default async function StudentsPage() {
  await requireRole('pengajar', '/teacher/students');
  const [students, classes] = await Promise.all([listStudents(), listClasses()]);

  const classNames = (studentId: string) =>
    classes.filter((item) => item.studentIds.includes(studentId)).map((item) => item.name).join(', ') || '—';

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Mahasiswa" description="Seluruh mahasiswa pada kelas yang Anda kelola." />
      <Card padding="none">
        <TableWrapper className="rounded-md border-0">
          <Table>
            <thead>
              <tr>
                <Th>Mahasiswa</Th>
                <Th>NIM</Th>
                <Th>Kelas</Th>
                <Th>Email</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <Tr key={student.id}>
                  <Td className="font-medium">{student.name}</Td>
                  <Td className="tabular-nums text-ink-2">{student.nim}</Td>
                  <Td className="text-ink-2">{classNames(student.id)}</Td>
                  <Td className="text-ink-2">{student.email}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Card>
    </div>
  );
}
