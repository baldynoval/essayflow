import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/inter';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: 'EssayFlow — Penilaian Tugas Akademik Berbantuan AI',
  description:
    'EssayFlow membantu pengajar menilai tugas akademik lebih cepat dan konsisten dengan rubrik dan umpan balik berbantuan AI. Pengajar tetap pengambil keputusan akhir.',
  openGraph: {
    title: 'EssayFlow — Penilaian Tugas Akademik Berbantuan AI',
    description: 'Platform penilaian tugas akademik berbantuan AI untuk pengajar dan mahasiswa.',
    locale: 'id_ID',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a
          href="#konten-utama"
          className="sr-only rounded-sm bg-ink px-4 py-2 text-body-sm text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Lewati ke konten utama
        </a>
        {children}
      </body>
    </html>
  );
}
