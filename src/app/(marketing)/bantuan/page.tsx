import type { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const metadata: Metadata = { title: 'Pusat Bantuan — EssayFlow' };

const TOPICS = [
  { title: 'Memulai sebagai pengajar', body: 'Membuat kelas, menyusun rubrik, dan membuat tugas pertama Anda.' },
  { title: 'Memulai sebagai mahasiswa', body: 'Bergabung ke kelas dengan kode kelas, mengumpulkan tugas, dan melihat hasil.' },
  { title: 'Penilaian AI', body: 'Tahapan analisis, arti status Menunggu Review, dan apa yang terjadi bila AI gagal menilai.' },
  { title: 'Revisi', body: 'Batas revisi, versi terbaru sebagai versi utama, dan akses ke versi lama.' },
];

export default function HelpCenterPage() {
  return (
    <div className="flex flex-col gap-10">
      <SectionHeading title="Pusat Bantuan" description="Panduan singkat penggunaan EssayFlow untuk pengajar dan mahasiswa." as="h1" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <Card as="li" key={topic.title} className="list-none">
            <p className="text-body font-medium text-ink">{topic.title}</p>
            <p className="mt-2 text-body-sm text-ink-2">{topic.body}</p>
          </Card>
        ))}
      </ul>
      <p className="text-body-sm text-ink-2">
        Tidak menemukan jawaban?{' '}
        <Link href="/kontak" className="rounded-sm text-ink hover:underline">
          Hubungi tim dukungan
        </Link>
        .
      </p>
    </div>
  );
}
