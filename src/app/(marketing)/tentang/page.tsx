import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Tentang — EssayFlow' };

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Tentang EssayFlow" description="Platform penilaian tugas akademik berbantuan AI." as="h1" />
      <div className="flex flex-col gap-6 text-body-sm leading-relaxed text-ink-2">
        <p>
          EssayFlow membantu pengajar menilai tugas akademik lebih cepat dan lebih konsisten. AI menganalisis
          jawaban mahasiswa, mencocokkannya dengan rubrik, lalu menyusun draf nilai beserta umpan balik.
        </p>
        <p>
          Draf tersebut bukan keputusan akhir. Pengajar meninjau, menyunting nilai dan feedback, menyesuaikan
          nilai akhir bila perlu, lalu memutuskan kapan hasil dirilis kepada mahasiswa.
        </p>
        <p>
          Mahasiswa memperoleh umpan balik yang terstruktur: apa yang sudah baik, apa yang perlu diperbaiki,
          dan saran perbaikan yang dapat ditindaklanjuti pada revisi berikutnya.
        </p>
      </div>
    </div>
  );
}
