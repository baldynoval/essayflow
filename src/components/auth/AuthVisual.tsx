import { Check } from 'lucide-react';
import { AIIndicator } from '@/components/ui/AIIndicator';
import { Badge } from '@/components/ui/Badge';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';

const criteria = [
  { name: 'Kesesuaian dengan Topik', weight: 30 },
  { name: 'Struktur Argumentasi', weight: 25 },
  { name: 'Kedalaman Analisis', weight: 25 },
  { name: 'Penggunaan Bahasa', weight: 20 },
];

/**
 * Decorative composition for the authentication panel — the same visual language
 * as the landing preview. Not interactive, hidden from assistive technology.
 */
export function AuthVisual() {
  return (
    <div aria-hidden className="relative">
      <div className="rounded-lg border border-line bg-bg p-6 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-meta text-ink-2">Analisis Algoritma Pencarian</p>
            <p className="mt-1 text-body font-medium text-ink">Hasil Penilaian</p>
          </div>
          <Badge tone="warning" dot>
            Menunggu Review
          </Badge>
        </div>

        <div className="mt-6 flex items-end justify-between gap-6 border-t border-line pt-6">
          <ScoreDisplay score={87.5} size="lg" aside={<AIIndicator label="Draf AI" />} />
          <ul className="hidden w-1/2 flex-col gap-2 xl:flex">
            {criteria.map((criterion) => (
              <li key={criterion.name} className="flex items-center justify-between gap-3 text-caption text-ink-2">
                <span className="truncate">{criterion.name}</span>
                <span className="tabular-nums text-ink">{criterion.weight}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 ml-8 inline-flex items-center gap-3 rounded-md border border-line bg-bg px-4 py-3 shadow-lift">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-success-soft text-success">
          <Check className="size-4" />
        </span>
        <div>
          <p className="text-meta font-medium text-ink">Ditinjau pengajar</p>
          <p className="text-caption text-ink-2">Nilai akhir dirilis 19 September 2026, 15.30 WIB</p>
        </div>
      </div>
    </div>
  );
}
