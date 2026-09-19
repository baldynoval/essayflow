import { Check, PenLine, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { buttonClasses } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ScoreDisplay } from '@/components/ui/ScoreDisplay';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DEMO_CRITERIA } from '@/data/landing';
import { weightedScore } from '@/lib/scoring';

const STEPS = [
  { icon: Check, title: 'Tinjau', text: 'Periksa skor tiap kriteria dan umpan balik yang disusun AI.' },
  { icon: PenLine, title: 'Sunting', text: 'Ubah nilai, umpan balik, atau nilai akhir. Penyesuaian nilai akhir meminta konfirmasi.' },
  { icon: ShieldCheck, title: 'Setujui & Rilis', text: 'Mahasiswa baru melihat hasil setelah Anda merilisnya.' },
];

export function ReviewShowcase() {
  return (
    <section aria-labelledby="judul-tinjau" className="border-y border-line bg-surface py-24 lg:py-30">
      <Container size="marketing">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:order-2 lg:col-span-5">
            <SectionHeading
              id="judul-tinjau"
              title="Pengajar memegang keputusan akhir"
              description="AI mempercepat penilaian, bukan menggantikan pertimbangan Anda. Setiap hasil melewati tinjauan pengajar sebelum sampai ke mahasiswa."
            />
            <ol className="mt-8 space-y-6">
              {STEPS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-line bg-bg">
                    <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-body font-semibold">{title}</h3>
                    <p className="mt-1 text-body-sm text-ink-2">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="lg:order-1 lg:col-span-7" delay={0.05}>
            <div aria-hidden className="select-none rounded-md border border-line bg-bg p-6 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <ScoreDisplay score={weightedScore(DEMO_CRITERIA)} label="Nilai Akhir" size="xl" />
                <Badge tone="warning" dot>
                  Draf Penilaian
                </Badge>
              </div>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {DEMO_CRITERIA.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-4 py-3 text-body-sm">
                    <span>{c.name}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold tabular-nums">{c.score}</span>
                      <PenLine className="size-4 text-ink-3" aria-hidden />
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['Yang sudah baik', 'Argumentasi runtut dan jelas.'],
                  ['Yang perlu diperbaiki', 'Sumber rujukan belum lengkap.'],
                  ['Saran', 'Tambahkan contoh kasus pembanding.'],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-sm bg-surface p-4">
                    <p className="text-meta font-semibold">{t}</p>
                    <p className="mt-1 text-caption text-ink-2">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap justify-end gap-2">
                <span className={buttonClasses({ variant: 'secondary', size: 'md' })}>Simpan sebagai Draft</span>
                <span className={buttonClasses({ variant: 'primary', size: 'md' })}>Setujui &amp; Rilis</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
