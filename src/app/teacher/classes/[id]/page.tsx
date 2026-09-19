import { Check, X } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, TableWrapper, Td, Th, Tr } from '@/components/ui/Table';
import { requireRole } from '@/lib/auth/guard';
import { formatDate } from '@/lib/format';
import { getClass, getStudent, listJoinRequests, listStudents, listTasks } from '@/lib/data/repository';

export const metadata: Metadata = { title: 'Detail Kelas — EssayFlow' };

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireRole('pengajar', `/teacher/classes/${id}`);

  const classRoom = await getClass(id);
  if (!classRoom) notFound();

  const [students, tasks, requests] = await Promise.all([
    listStudents(classRoom.studentIds),
    listTasks({ classId: classRoom.id }),
    listJoinRequests(classRoom.id),
  ]);
  const requesters = await Promise.all(requests.map((request) => getStudent(request.studentId)));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={classRoom.name}
        meta={
          <>
            <Badge>{classRoom.code}</Badge>
            <span>{classRoom.program}</span>
            <span>{classRoom.semester}</span>
            <span>{students.length} mahasiswa</span>
            <span>{tasks.length} tugas</span>
          </>
        }
        actions={
          <Button href="/teacher/classes" variant="secondary">
            Kembali ke Kelas
          </Button>
        }
      />

      {requests.length > 0 && (
        <Card>
          <h2 className="text-body font-medium text-ink">Permintaan Bergabung</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {requests.map((request, index) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4 last:border-b-0 last:pb-0">
                <div>
                  <p className="text-body-sm font-medium text-ink">{requesters[index]?.name ?? 'Mahasiswa'}</p>
                  <p className="text-caption text-ink-2">
                    {requesters[index]?.nim} · diajukan {formatDate(request.requestedAt)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" variant="secondary" iconLeft={<X className="size-4" aria-hidden />}>
                    Tolak
                  </Button>
                  <Button size="sm" iconLeft={<Check className="size-4" aria-hidden />}>
                    Setujui
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-caption text-ink-2">Penolakan dapat disertai alasan opsional.</p>
        </Card>
      )}

      <Card padding="none">
        <h2 className="px-6 pt-6 text-body font-medium text-ink">Daftar Mahasiswa</h2>
        <TableWrapper className="mt-6 rounded-none border-0">
          <Table>
            <thead>
              <tr>
                <Th>Mahasiswa</Th>
                <Th>NIM</Th>
                <Th>Email</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <Tr key={student.id}>
                  <Td className="font-medium">{student.name}</Td>
                  <Td className="tabular-nums text-ink-2">{student.nim}</Td>
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
