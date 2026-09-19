import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WORKFLOW_STEPS } from '@/data/landing';
import { ICONS } from './icons';

export function Workflow() {
  return (
    <section id="cara-kerja" aria-labelledby="judul-alur" className="border-y border-line bg-surface py-24 lg:py-30">
      <Container size="marketing">
        <Reveal>
          <SectionHeading id="judul-alur" title="Bagaimana EssayFlow Bekerja?" description="Lima langkah dari pembuatan tugas hingga hasil sampai ke mahasiswa." />
        </Reveal>

        <ol className="mt-12 lg:mt-16 lg:grid lg:grid-cols-5 lg:gap-6">
          {WORKFLOW_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon];
            const last = i === WORKFLOW_STEPS.length - 1;
            return (
              <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0 lg:block lg:pb-0">
                {!last && <span aria-hidden className="absolute bottom-0 left-5 top-10 w-px bg-line lg:hidden" />}
                <div className="flex items-center self-start lg:mb-6 lg:self-auto">
                  <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-line bg-bg text-body-sm font-semibold tabular-nums">
                    {i + 1}
                  </span>
                  {!last && <span aria-hidden className="ml-4 hidden h-px flex-1 bg-line lg:block" />}
                </div>
                <div>
                  <Icon className="hidden size-6 text-accent lg:block" strokeWidth={1.75} aria-hidden />
                  <h3 className="text-body font-semibold lg:mt-4">{step.title}</h3>
                  <p className="mt-2 text-body-sm text-ink-2">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
