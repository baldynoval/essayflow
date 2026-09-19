import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

export function FinalCTA() {
  return (
    <section aria-labelledby="judul-cta" className="pb-24 lg:pb-30">
      <Container size="marketing">
        <Reveal>
          <div className="flex flex-col gap-8 rounded-xl border border-line bg-surface p-8 md:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
            <div className="max-w-copy-lg">
              <h2 id="judul-cta" className="text-section text-balance">
                Siap meningkatkan kualitas penilaian tugas Anda?
              </h2>
              <p className="mt-4 text-body-lg text-ink-2">Mulai dari satu kelas dan satu tugas. Rubrik, penilaian, dan hasil ada dalam satu alur.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button href="/login" size="lg">
                Mulai Sekarang
              </Button>
              <Button href="#produk" variant="secondary" size="lg">
                Lihat Produk
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
