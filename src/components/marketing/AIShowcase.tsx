'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { AIEvaluationPanel } from '@/components/ai/AIEvaluationPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AI_STAGES } from '@/data/landing';

const STAGE_MS = 1400;
const POINTS = [
  'Membaca jawaban dan memetakannya ke setiap kriteria rubrik',
  'Menyusun skor per kriteria dan umpan balik dalam tiga bagian',
  'Menandai seluruh hasil sebagai draf sampai pengajar menyetujuinya',
];

export function AIShowcase() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [run, setRun] = useState(0);
  const last = AI_STAGES.length - 1;

  // One run when the panel first scrolls into view; "Putar Ulang" starts another.
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setActiveIndex(last);
      return;
    }
    setActiveIndex(0);
    const timers = AI_STAGES.slice(1).map((_, i) => window.setTimeout(() => setActiveIndex(i + 1), (i + 1) * STAGE_MS));
    return () => timers.forEach(window.clearTimeout);
  }, [inView, reduce, run, last]);

  const finished = activeIndex >= last;

  return (
    <section aria-labelledby="judul-ai" className="py-24 lg:py-30">
      <Container size="marketing">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              id="judul-ai"
              title="Analisis AI yang terstruktur dan mudah ditelusuri"
              description="EssayFlow membaca jawaban, mencocokkannya dengan rubrik, lalu menyusun skor dan umpan balik. Setiap tahap terlihat, sehingga hasilnya dapat diperiksa."
            />
            <ul className="mt-8 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex gap-3 text-body-sm text-ink-2">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {p}
                </li>
              ))}
            </ul>
            {finished && !reduce && (
              <Button variant="ghost" size="sm" className="-ml-3 mt-6" iconLeft={<RotateCcw className="size-4" aria-hidden />} onClick={() => setRun((r) => r + 1)}>
                Putar Ulang
              </Button>
            )}
          </Reveal>
          <div ref={ref} className="lg:col-span-7">
            <AIEvaluationPanel activeIndex={activeIndex} className="mx-auto max-w-copy-lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
