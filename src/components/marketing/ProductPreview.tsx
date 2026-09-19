import { LayoutDashboard, ListChecks, Award } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tabs } from '@/components/ui/Tabs';
import { MockDashboard } from './mocks/MockDashboard';
import { MockResult } from './mocks/MockResult';
import { MockRubric } from './mocks/MockRubric';

const Caption = ({ children }: { children: string }) => <p className="mb-6 max-w-copy-lg text-body text-ink-2">{children}</p>;

export function ProductPreview() {
  return (
    <section id="produk" aria-labelledby="judul-produk" className="py-24 lg:py-30">
      <Container size="marketing">
        <Reveal>
          <SectionHeading
            id="judul-produk"
            title="Satu ruang kerja untuk seluruh proses penilaian"
            description="Pengajar menyusun tugas dan rubrik, meninjau hasil AI, lalu merilis nilai. Mahasiswa hanya melihat hasil yang sudah disetujui."
          />
        </Reveal>
        <Reveal className="mt-10" delay={0.05}>
          <Tabs
            ariaLabel="Tampilan produk"
            items={[
              {
                id: 'dasbor',
                label: 'Dasbor Pengajar',
                icon: <LayoutDashboard className="size-4" aria-hidden />,
                content: (
                  <>
                    <Caption>Lihat tugas aktif, pengumpulan yang menunggu review, dan aktivitas terbaru tiap kelas dalam satu layar.</Caption>
                    <MockDashboard />
                  </>
                ),
              },
              {
                id: 'rubrik',
                label: 'Rubrik AI',
                icon: <ListChecks className="size-4" aria-hidden />,
                content: (
                  <>
                    <Caption>Minta saran kriteria dari AI, terapkan satu per satu atau sekaligus, lalu sunting bobotnya hingga total 100%.</Caption>
                    <MockRubric />
                  </>
                ),
              },
              {
                id: 'hasil',
                label: 'Hasil Mahasiswa',
                icon: <Award className="size-4" aria-hidden />,
                content: (
                  <>
                    <Caption>Setelah dirilis, mahasiswa melihat nilai akhir, nilai per kriteria, dan umpan balik yang terstruktur.</Caption>
                    <MockResult />
                  </>
                ),
              },
            ]}
          />
        </Reveal>
      </Container>
    </section>
  );
}
