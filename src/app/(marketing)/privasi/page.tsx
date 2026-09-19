import type { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Kebijakan Privasi — EssayFlow' };

const SECTIONS = [
  { title: 'Data yang dikumpulkan', body: 'Data akun (nama, email, NIM atau NIP), kelas yang diikuti, tugas, pengumpulan, serta hasil penilaian.' },
  { title: 'Penggunaan data', body: 'Data dipakai untuk menjalankan proses penilaian, menampilkan hasil, dan mengirim notifikasi sesuai preferensi Anda.' },
  { title: 'Akses antar pengguna', body: 'Mahasiswa hanya melihat pengumpulan dan nilainya sendiri. Nama teman sekelas dapat terlihat, namun nilai dan isi jawaban mereka tidak.' },
  { title: 'Penyimpanan', body: 'Pengumpulan disimpan beserta versinya untuk keperluan riwayat revisi dan peninjauan pengajar.' },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Kebijakan Privasi" as="h1" />
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
