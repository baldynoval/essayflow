import { Check } from 'lucide-react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { buttonClasses } from '@/components/ui/Button';
import { DEMO_CRITERIA } from '@/data/landing';
import { totalWeight } from '@/lib/scoring';
import { MockWindow } from './MockWindow';

const SUGGESTIONS = ['Analisis data dan bukti', 'Struktur penulisan', 'Kreativitas ide'];

/** Rubric workspace with AI suggestions, condensed. */
export function MockRubric() {
  return (
    <MockWindow title="Rubrik Penilaian · Analisis Algoritma Pencarian">
      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-2">
        <div className="rounded-sm border border-line">
          <p className="border-b border-line px-4 py-3 text-meta font-semibold">Rubrik Penilaian</p>
          <ul className="divide-y divide-line">
            {DEMO_CRITERIA.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-3 text-meta">
                <span>{c.name}</span>
                <span className="rounded-sm bg-muted px-2 py-1 tabular-nums">{c.weight}%</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-4 py-3 text-meta font-semibold">Total: {totalWeight(DEMO_CRITERIA)}%</p>
        </div>

        <div className="rounded-sm border border-accent-line bg-accent-soft/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-meta font-semibold">AI EssayFlow</p>
            <AIIndicator label="Saran Rubrik" />
          </div>
          <ul className="mt-4 space-y-2">
            {SUGGESTIONS.map((s, i) => (
              <li key={s} className="flex items-center gap-3 rounded-sm bg-bg px-3 py-2 text-meta">
                <span className="grid size-4 place-items-center rounded-sm bg-accent text-on-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                <span className="flex-1">{s}</span>
                <span className="tabular-nums text-ink-2">{[15, 15, 10][i]}%</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2">
            <span className={buttonClasses({ variant: 'primary', size: 'sm' })}>Terapkan Semua</span>
            <span className={buttonClasses({ variant: 'secondary', size: 'sm' })}>Buat Ulang</span>
          </div>
        </div>
      </div>
    </MockWindow>
  );
}
