import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BENEFITS } from '@/data/landing';

export function Benefits() {
  return (
    <section id="tentang" aria-labelledby="judul-manfaat" className="border-y border-line bg-surface py-24 lg:py-30">
      <Container size="marketing">
        <Reveal>
          <SectionHeading
            id="judul-manfaat"
            title="Dirancang untuk pengajar dan mahasiswa"
            description="Kedua pihak membutuhkan kejelasan: apa yang dinilai, bagaimana nilainya dihitung, dan apa langkah berikutnya."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {Object.values(BENEFITS).map((group, i) => (
            <Reveal key={group.title} delay={i * 0.05} className="h-full">
              <Card padding="lg" className="h-full">
                <h3 className="text-sub">{group.title}</h3>
                <p className="mt-2 text-body text-ink-2">{group.intro}</p>
                <ul className="mt-6 space-y-4">
                  {group.points.map((point) => (
                    <li key={point} className="flex gap-3 text-body-sm">
                      <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
