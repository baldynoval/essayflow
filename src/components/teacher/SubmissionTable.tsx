'use client';

import { Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchInput } from '@/components/ui/SearchInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Table, TableWrapper, Td, Th, Tr } from '@/components/ui/Table';
import { formatDate, formatScore, formatTime } from '@/lib/format';
import type { SubmissionStatus } from '@/types/domain';
import { cn } from '@/lib/cn';

export interface SubmissionRow {
  submissionId?: string;
  studentName: string;
  nim: string;
  status: SubmissionStatus;
  aiScore: number | null;
  submittedAt: string | null;
}

const FILTERS = [
  { id: 'semua', label: 'Semua' },
  { id: 'menunggu-review', label: 'Menunggu Review' },
  { id: 'sudah-dinilai', label: 'Sudah Dinilai' },
  { id: 'belum-mengumpulkan', label: 'Belum Mengumpulkan' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

export function SubmissionTable({ rows }: { rows: SubmissionRow[] }) {
  const [filter, setFilter] = useState<FilterId>('semua');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchFilter = filter === 'semua' || row.status === filter;
      const matchQuery =
        !needle || row.studentName.toLowerCase().includes(needle) || row.nim.includes(needle);
      return matchFilter && matchQuery;
    });
  }, [rows, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Filter status pengumpulan" className="-mx-1 flex gap-2 overflow-x-auto px-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                'inline-flex h-8 shrink-0 items-center rounded-full border px-3 text-caption transition-colors duration-200 motion-reduce:transition-none',
                filter === item.id ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-2 hover:border-ink/20',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <SearchInput
          label="Cari mahasiswa atau NIM"
          placeholder="Cari mahasiswa…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          containerClassName="md:w-1/3"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState className="mt-6" icon={Users} title="Tidak ada data" description="Ubah filter atau kata kunci pencarian." />
      ) : (
        <>
          {/* Desktop: tabel. Mobile: daftar kartu. */}
          <TableWrapper className="mt-6 hidden md:block">
            <Table>
              <thead>
                <tr>
                  <Th>Mahasiswa</Th>
                  <Th>NIM</Th>
                  <Th>Status</Th>
                  <Th>Nilai AI</Th>
                  <Th>Tanggal</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <Tr key={row.nim}>
                    <Td className="font-medium">{row.studentName}</Td>
                    <Td className="tabular-nums text-ink-2">{row.nim}</Td>
                    <Td>
                      <StatusBadge status={row.status} />
                    </Td>
                    <Td className="tabular-nums">{row.aiScore === null ? '—' : formatScore(row.aiScore)}</Td>
                    <Td className="text-ink-2">
                      {row.submittedAt ? `${formatDate(row.submittedAt)}, ${formatTime(row.submittedAt)}` : '—'}
                    </Td>
                    <Td>
                      {row.submissionId ? (
                        <Link href={`/teacher/review/${row.submissionId}`} className="rounded-sm text-accent hover:underline">
                          Tinjau
                        </Link>
                      ) : (
                        <span className="text-ink-3">—</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          <ul className="mt-6 flex flex-col gap-3 md:hidden">
            {filtered.map((row) => (
              <li key={row.nim} className="rounded-md border border-line bg-bg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-ink">{row.studentName}</p>
                    <p className="text-caption tabular-nums text-ink-2">{row.nim}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-caption text-ink-2">
                  <span>Nilai AI: {row.aiScore === null ? '—' : formatScore(row.aiScore)}</span>
                  {row.submissionId && (
                    <Link href={`/teacher/review/${row.submissionId}`} className="rounded-sm text-accent hover:underline">
                      Tinjau
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
