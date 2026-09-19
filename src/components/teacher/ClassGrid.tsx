'use client';

import { BookOpen, Copy, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { Select } from '@/components/ui/Select';
import type { ClassRoom } from '@/types/domain';

/** Generates a readable class code; the server generates the real one on save. */
function draftCode(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 3);
  return `${initials || 'KLS'}-${Math.floor(100 + Math.random() * 900)}`;
}

export function ClassGrid({ classes }: { classes: ClassRoom[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [program, setProgram] = useState('Teknik Informatika');
  const [semester, setSemester] = useState('Semester 3');
  const [created, setCreated] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return classes;
    return classes.filter(
      (item) => item.name.toLowerCase().includes(needle) || item.code.toLowerCase().includes(needle),
    );
  }, [classes, query]);

  return (
    <div className="flex flex-col gap-6">
      {created && (
        <Alert tone="success" title="Kelas berhasil dibuat.">
          Bagikan kode kelas <strong>{created}</strong> kepada mahasiswa agar mereka dapat mengajukan
          permintaan bergabung.
        </Alert>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchInput
          label="Cari kelas"
          placeholder="Cari kelas…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          containerClassName="md:w-1/2"
        />
        <Button onClick={() => setOpen(true)} iconLeft={<Plus className="size-4" aria-hidden />}>
          Buat Kelas
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={BookOpen} title="Kelas tidak ditemukan" description="Ubah kata kunci pencarian atau buat kelas baru." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <Card as="li" key={item.id} interactive className="list-none">
              <Link href={`/teacher/classes/${item.id}`} className="block rounded-sm">
                <p className="text-body font-medium text-ink">{item.name}</p>
                <dl className="mt-4 flex flex-col gap-2 text-meta text-ink-2">
                  <div className="flex justify-between gap-4">
                    <dt>Program Studi</dt>
                    <dd className="text-ink">{item.program}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Semester</dt>
                    <dd className="text-ink">{item.semester}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Jumlah Mahasiswa</dt>
                    <dd className="tabular-nums text-ink">{item.studentIds.length}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Kode Kelas</dt>
                    <dd className="inline-flex items-center gap-2 font-medium text-ink">
                      <Copy className="size-3 text-ink-3" aria-hidden />
                      {item.code}
                    </dd>
                  </div>
                </dl>
              </Link>
            </Card>
          ))}
        </ul>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Buat Kelas"
        description="Sistem membuat kode kelas otomatis yang dapat dibagikan kepada mahasiswa."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              disabled={!name.trim()}
              onClick={() => {
                setCreated(draftCode(name));
                setOpen(false);
                setName('');
              }}
            >
              Buat Kelas
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input label="Nama Kelas" value={name} onChange={(event) => setName(event.target.value)} placeholder="Pemrograman Dasar" required />
          <Select label="Program Studi" value={program} onChange={(event) => setProgram(event.target.value)}>
            <option>Teknik Informatika</option>
            <option>Sistem Informasi</option>
            <option>Teknik Informatika Multimedia</option>
          </Select>
          <Select label="Semester" value={semester} onChange={(event) => setSemester(event.target.value)}>
            {['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6'].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
}
