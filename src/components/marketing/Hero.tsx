'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { HERO_STRIP } from '@/data/landing';
import { motionTokens } from '@/design/tokens';
import { ICONS } from './icons';
import { MockReview } from './mocks/MockReview';

export function Hero() {
  const reduce = useReducedMotion();

  // The hero is the one orchestrated page-load moment: copy staggers in, then the product settles.
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : motionTokens.stagger, delayChildren: 0.05 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: motionTokens.ease } },
  };
  const product: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0 : 0.9, ease: motionTokens.ease, delay: reduce ? 0 : 0.25 } },
  };

  return (
    <section aria-labelledby="judul-hero" className="pt-12 md:pt-16 lg:pt-20">
      <Container size="marketing">
        <motion.div variants={container} initial="hidden" animate="show" className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <motion.h1 variants={item} id="judul-hero" className="text-display text-balance">
              AI membantu pengajar menilai tugas dengan lebih cepat dan akurat.
            </motion.h1>
            <motion.p variants={item} className="mt-6 max-w-copy text-body-lg text-ink-2">
              EssayFlow adalah platform penilaian tugas akademik berbantuan AI. Menghemat waktu pengajar, memberikan umpan balik yang lebih objektif, dan membantu mahasiswa berkembang lebih baik.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/login" size="lg">
                Mulai Sekarang
              </Button>
              <Button href="#cara-kerja" variant="secondary" size="lg">
                Lihat Cara Kerja
              </Button>
            </motion.div>
            <motion.p variants={item} className="mt-6 flex items-center gap-2 text-meta text-ink-2">
              <Check className="size-4 text-accent" aria-hidden />
              Hasil AI berstatus draf. Pengajar tetap pengambil keputusan akhir.
            </motion.p>
          </div>

          <motion.div variants={product} className="lg:col-span-6 lg:-mr-10">
            <MockReview />
          </motion.div>
        </motion.div>

        <ul className="mt-16 grid gap-8 border-t border-line pt-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {HERO_STRIP.map(({ icon, title, text }) => {
            const Icon = ICONS[icon];
            return (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-sm border border-line bg-surface">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h2 className="text-body-sm font-semibold">{title}</h2>
                  <p className="mt-1 text-meta text-ink-2">{text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
