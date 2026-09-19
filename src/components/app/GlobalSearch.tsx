'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motionTokens } from '@/design/tokens';
import { CLASSES, STUDENTS, TASKS } from '@/data/mock';
import { cn } from '@/lib/cn';
import type { Role } from '@/types/domain';

interface Result {
  id: string;
  label: string;
  kind: string;
  href: string;
}

/** Role-aware global search: tasks and classes for both roles, students for teachers only. */
export function GlobalSearch({ role }: { role: Role }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();

  const results = useMemo<Result[]>(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];

    const base = role === 'pengajar' ? '/teacher' : '/student';
    const tasks: Result[] = TASKS.filter((task) => task.title.toLowerCase().includes(needle)).map((task) => ({
      id: task.id,
      label: task.title,
      kind: 'Tugas',
      href: `${base}/tasks/${task.id}`,
    }));

    const classes: Result[] = CLASSES.filter((item) => item.name.toLowerCase().includes(needle)).map((item) => ({
      id: item.id,
      label: item.name,
      kind: 'Kelas',
      href: role === 'pengajar' ? `/teacher/classes/${item.id}` : `${base}/tasks`,
    }));

    const students: Result[] =
      role === 'pengajar'
        ? STUDENTS.filter(
            (student) => student.name.toLowerCase().includes(needle) || student.nim.includes(needle),
          ).map((student) => ({
            id: student.id,
            label: `${student.name} — ${student.nim}`,
            kind: 'Mahasiswa',
            href: '/teacher/students',
          }))
        : [];

    return [...tasks, ...classes, ...students].slice(0, 6);
  }, [query, role]);

  const open = focused && query.trim().length >= 2;

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="pencarian-global" className="sr-only">
        {role === 'pengajar' ? 'Cari tugas, kelas, atau mahasiswa' : 'Cari tugas atau hasil penilaian'}
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
      <input
        id="pencarian-global"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder={role === 'pengajar' ? 'Cari tugas, kelas, atau mahasiswa…' : 'Cari tugas atau hasil…'}
        role="combobox"
        aria-expanded={open}
        aria-controls="hasil-pencarian-global"
        className={cn(
          'h-10 w-full rounded-sm border border-line bg-surface pl-12 pr-4 text-body-sm text-ink placeholder:text-ink-3',
          'transition-[border-color,background-color] duration-200 focus:border-accent focus:bg-bg focus:outline-none focus:ring-4 focus:ring-accent/10 motion-reduce:transition-none',
        )}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            id="hasil-pencarian-global"
            role="listbox"
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.fast, ease: motionTokens.ease }}
            className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-sm border border-line bg-bg shadow-panel"
          >
            {results.length === 0 ? (
              <p className="px-4 py-3 text-meta text-ink-2">Tidak ada hasil untuk “{query}”.</p>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={`${result.kind}-${result.id}`}>
                    <Link
                      href={result.href}
                      role="option"
                      aria-selected={false}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-body-sm text-ink transition-colors duration-200 hover:bg-muted motion-reduce:transition-none"
                    >
                      <span className="truncate">{result.label}</span>
                      <span className="shrink-0 text-caption text-ink-2">{result.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
