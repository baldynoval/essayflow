import { Quote } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FEATURES, TESTIMONIAL } from '@/data/landing';
import { ICONS } from './icons';

export function Features() {
  return (
    <section aria-labelledby="judul-fitur" className="py-24 lg:py-30">
      <Container size="marketing">
        <Reveal>
          <SectionHeading id="judul-fitur" title="Fitur Unggulan" description="Yang Anda perlukan untuk menilai dengan cepat, tanpa melepaskan kendali." />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
            {FEATURES.map(({ icon, title, text }, i) => {
              const Icon = ICONS[icon];
              return (
                <Reveal key={title} delay={i * 0.05} className="h-full">
                  <Card as="li" padding="lg" className="h-full">
                    <span className="grid size-10 place-items-center rounded-sm bg-accent-soft text-accent">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-6 text-body-lg font-semibold">{title}</h3>
                    <p className="mt-2 text-body-sm text-ink-2">{text}</p>
                  </Card>
                </Reveal>
              );
            })}
          </ul>

          <Reveal className="lg:col-span-4" delay={0.1}>
            <Card as="article" variant="subtle" padding="lg" className="flex h-full flex-col">
              <h3 className="text-body-lg font-semibold">Testimoni</h3>
              <figure className="mt-6 flex flex-1 flex-col">
                <Quote className="size-6 text-ink-3" aria-hidden />
                <blockquote className="mt-4 flex-1 text-body text-ink">{TESTIMONIAL.quote}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-6">
                  <Avatar name={TESTIMONIAL.name} size="lg" />
                  <div>
                    <p className="text-body-sm font-medium">{TESTIMONIAL.name}</p>
                    <p className="text-meta text-ink-2">{TESTIMONIAL.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
