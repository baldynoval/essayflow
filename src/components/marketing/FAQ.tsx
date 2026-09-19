import { Accordion } from '@/components/ui/Accordion';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FAQ_ITEMS } from '@/data/landing';

export function FAQ() {
  return (
    <section id="faq" aria-labelledby="judul-faq" className="py-24 lg:py-30">
      <Container size="marketing">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading id="judul-faq" title="Pertanyaan yang sering diajukan" description="Hal-hal yang biasanya ditanyakan pengajar sebelum mulai." />
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.05}>
            <Accordion items={FAQ_ITEMS.map((i) => ({ ...i }))} defaultOpenIds={['keputusan']} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
