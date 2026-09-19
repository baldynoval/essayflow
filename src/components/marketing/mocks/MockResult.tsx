import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_CRITERIA } from '@/data/landing';
import { weightedScore } from '@/lib/scoring';
import { MockWindow } from './MockWindow';

const FEEDBACK = [
  { title: 'Yang sudah baik', text: 'Argumentasi runtut dan didukung perbandingan kompleksitas yang jelas.' },
  { title: 'Yang perlu diperbaiki', text: 'Referensi pendukung belum dicantumkan pada bagian kesimpulan.' },
  { title: 'Saran', text: 'Tambahkan contoh kasus data tak terurut untuk memperkuat analisis.' },
];

/** Student result view, condensed. */
export function MockResult() {
  return (
    <MockWindow title="Hasil Penilaian · Analisis Algoritma Pencarian">
      <div className="p-4 sm:p-6">
        <div className="grid gap-6 sm:grid-cols-[14rem_1fr]">
          <div className="rounded-sm border border-line p-4">
            <StatusBadge status="sudah-dinilai" />
            <ScoreDisplay score={weightedScore(DEMO_CRITERIA)} size="xl" className="mt-4" />
          </div>
          <ul className="divide-y divide-line rounded-sm border border-line">
            {DEMO_CRITERIA.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 text-meta">
                <span>{c.name}</span>
                <span className="font-semibold tabular-nums">{c.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {FEEDBACK.map((f) => (
            <div key={f.title} className="rounded-sm bg-surface p-4">
              <p className="text-meta font-semibold">{f.title}</p>
              <p className="mt-2 text-caption text-ink-2">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </MockWindow>
  );
}
