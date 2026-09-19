import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Ketentuan Layanan — EssayFlow' };

const SECTIONS = [
  { title: 'Penggunaan layanan', body: 'EssayFlow ditujukan untuk kegiatan akademik. Akun bersifat pribadi dan tidak dapat dipindahtangankan.' },
  { title: 'Peran penilaian AI', body: 'Penilaian AI bersifat draf. Pengajar adalah pengambil keputusan akhir atas nilai dan umpan balik yang dirilis.' },
  { title: 'Kejujuran akademik', body: 'Pengumpulan harus merupakan karya sendiri sesuai ketentuan institusi masing-masing.' },
  { title: 'Perubahan ketentuan', body: 'Ketentuan dapat diperbarui. Perubahan penting akan diberitahukan melalui notifikasi aplikasi.' },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Ketentuan Layanan" as="h1" />
      <ol className="flex flex-col gap-6">
        {SECTIONS.map((section) => (
          <li key={section.title}>
            <h2 className="text-body font-medium text-ink">{section.title}</h2>
            <p className="mt-2 text-body-sm text-ink-2">{section.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
