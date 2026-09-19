import { AIIndicator } from '@/components/ui/AIIndicator';
import { Avatar } from '@/components/ui/Avatar';
import { buttonClasses } from '@/components/ui/Button';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DEMO_ANSWER, DEMO_CRITERIA } from '@/data/landing';
import { weightedScore } from '@/lib/scoring';
import { MockWindow } from './MockWindow';

/** Teacher AI review workspace, condensed. */
export function MockReview({ className }: { className?: string }) {
  return (
    <MockWindow title="Tinjauan · Analisis Algoritma Pencarian" className={className}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name="Rizky Pratama" size="md" />
          <div>
            <p className="text-meta font-medium">Rizky Pratama</p>
            <p className="text-caption text-ink-2">NIM 23101001 · Pemrograman Dasar</p>
          </div>
        </div>
        <StatusBadge status="menunggu-review" />
      </div>

      <div className="grid gap-4 p-4 sm:grid-cols-[1fr_15rem]">
        <div>
          <p className="text-caption font-medium text-ink-2">Jawaban Mahasiswa</p>
          <p className="mt-2 text-meta text-ink">{DEMO_ANSWER}</p>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-full rounded-full bg-muted" />
            <div className="h-2 w-11/12 rounded-full bg-muted" />
            <div className="h-2 w-2/3 rounded-full bg-muted" />
          </div>
        </div>

        <div className="rounded-sm border border-accent-line bg-accent-soft/50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-caption font-medium">Evaluasi AI</p>
            <AIIndicator />
          </div>
          <ScoreDisplay score={weightedScore(DEMO_CRITERIA)} label="Draf Penilaian" size="lg" className="mt-3" />
          <ul className="mt-4 space-y-2 border-t border-accent-line pt-3">
            {DEMO_CRITERIA.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 text-caption">
                <span className="truncate text-ink-2">{c.name}</span>
                <span className="font-semibold tabular-nums">{c.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-line px-4 py-3">
        <span className={buttonClasses({ variant: 'secondary', size: 'sm' })}>Simpan sebagai Draft</span>
        <span className={buttonClasses({ variant: 'primary', size: 'sm' })}>Setujui &amp; Rilis</span>
      </div>
    </MockWindow>
  );
}
