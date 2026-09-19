import type { ScoredCriterion } from '@/types/domain';

export const NAV_LINKS = [
  { label: 'Produk', href: '#produk' },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'FAQ', href: '#faq' },
  // Module 15 will repoint this to /about.
  { label: 'Tentang', href: '#tentang' },
] as const;

export const AI_STAGES = ['Menganalisis Jawaban', 'Mencocokkan Rubrik', 'Membuat Feedback', 'Selesai'] as const;

/** Weights 20/25/30/25 with these scores give a weighted final of 87,5. */
export const DEMO_CRITERIA: ScoredCriterion[] = [
  { id: 'topik', name: 'Kesesuaian dengan Topik', weight: 20, score: 90 },
  { id: 'argumentasi', name: 'Struktur Argumentasi', weight: 25, score: 88 },
  { id: 'analisis', name: 'Kedalaman Analisis', weight: 30, score: 85 },
  { id: 'bahasa', name: 'Penggunaan Bahasa', weight: 25, score: 88 },
];

export const DEMO_ANSWER =
  'Algoritma pencarian adalah metode untuk menemukan data tertentu dalam suatu kumpulan data. Dalam penelitian ini, penulis membandingkan pencarian linear dan pencarian biner berdasarkan kompleksitas waktu dan kebutuhan memori pada data terurut.';

export const HERO_STRIP = [
  { icon: 'clock', title: 'Masalah', text: 'Menilai tugas secara manual memakan waktu dan sulit dijaga konsistensinya.' },
  { icon: 'sparkles', title: 'Solusi', text: 'AI menganalisis jawaban, mencocokkan rubrik, dan menyusun draf nilai serta umpan balik.' },
  { icon: 'workflow', title: 'Alur Kerja', text: 'Dari pengumpulan tugas hingga hasil dirilis, semuanya dalam satu alur.' },
  { icon: 'target', title: 'Hasil', text: 'Penilaian yang lebih cepat, objektif, dan tetap berada di tangan pengajar.' },
] as const;

export const WORKFLOW_STEPS = [
  { icon: 'file-plus', title: 'Buat Tugas & Rubrik', text: 'Tentukan instruksi, tenggat, dan kriteria penilaian berbobot 100%.' },
  { icon: 'send', title: 'Kumpulkan Tugas', text: 'Mahasiswa mengirim jawaban berupa teks, kode, PDF, atau Word.' },
  { icon: 'sparkles', title: 'AI Menganalisis & Menilai', text: 'AI mencocokkan jawaban dengan rubrik dan menyusun draf skor.' },
  { icon: 'clipboard', title: 'Tinjau & Edit oleh Pengajar', text: 'Pengajar memeriksa, mengubah, lalu menyetujui hasil penilaian.' },
  { icon: 'award', title: 'Hasil Dirilis ke Mahasiswa', text: 'Mahasiswa menerima nilai dan umpan balik, lalu dapat merevisi bila diizinkan.' },
] as const;

export const FEATURES = [
  { icon: 'sparkles', title: 'Penilaian Berbantuan AI', text: 'Draf skor per kriteria dan umpan balik tersusun otomatis dari analisis jawaban.' },
  { icon: 'sliders', title: 'Rubrik Fleksibel', text: 'Susun rubrik sendiri atau minta saran AI. Bobot dapat diubah dan totalnya selalu 100%.' },
  { icon: 'layers', title: 'Mudah Digunakan', text: 'Antarmuka ringkas untuk pengajar dan mahasiswa, di komputer maupun ponsel.' },
  { icon: 'shield', title: 'Data Terjaga', text: 'Mahasiswa hanya melihat nilai dan jawabannya sendiri, dan hanya setelah pengajar merilisnya.' },
] as const;

export const BENEFITS = {
  pengajar: {
    title: 'Untuk Pengajar',
    intro: 'Kurangi pekerjaan berulang, pertahankan penilaian akhir.',
    points: [
      'Draf skor dan umpan balik siap ditinjau begitu tugas dikumpulkan',
      'Ubah nilai, umpan balik, atau nilai akhir sebelum dirilis',
      'Rubrik yang sama dipakai untuk seluruh mahasiswa dalam satu tugas',
      'Pantau status pengumpulan dan penilaian tiap kelas dari satu dasbor',
    ],
  },
  mahasiswa: {
    title: 'Untuk Mahasiswa',
    intro: 'Tahu apa yang dinilai, dan apa yang perlu diperbaiki.',
    points: [
      'Rubrik terlihat sejak awal, sebelum jawaban dikumpulkan',
      'Nilai per kriteria disertai umpan balik yang spesifik',
      'Revisi dan riwayat versi tersimpan bila pengajar mengizinkan',
      'Status pengumpulan dan penilaian selalu terlihat jelas',
    ],
  },
} as const;

export const TESTIMONIAL = {
  quote:
    'Waktu menilai berkurang banyak, tetapi keputusan akhir tetap di tangan saya. Umpan balik dari AI menjadi titik awal yang rapi untuk saya sunting.',
  name: 'Dr. Sari Wulandari',
  role: 'Dosen Informatika',
} as const;

export const FAQ_ITEMS = [
  {
    id: 'keputusan',
    title: 'Apakah AI menentukan nilai akhir?',
    content:
      'Tidak. Hasil AI berstatus draf. Pengajar meninjau, mengubah nilai atau umpan balik, lalu menyetujui sebelum hasil dirilis kepada mahasiswa.',
  },
  {
    id: 'jenis',
    title: 'Jenis jawaban apa yang dapat dikumpulkan?',
    content: 'Teks, kode, berkas PDF, dan dokumen Word. Pengajar menentukan jenis yang diizinkan serta batas ukuran berkas untuk setiap tugas.',
  },
  {
    id: 'hasil',
    title: 'Kapan mahasiswa dapat melihat nilai?',
    content:
      'Setelah pengajar merilis hasil. Sebelum itu, mahasiswa hanya melihat status penilaian, bukan skor, nilai per kriteria, maupun umpan balik.',
  },
  {
    id: 'rubrik',
    title: 'Bisakah rubrik diubah setelah ada pengumpulan?',
    content:
      'Bisa. Pengajar memilih apakah penilaian yang sudah ada dihitung ulang mengikuti perubahan rubrik atau tetap dipertahankan.',
  },
  {
    id: 'revisi',
    title: 'Apakah mahasiswa dapat merevisi jawaban?',
    content:
      'Jika pengajar mengaktifkan revisi, mahasiswa dapat mengumpulkan versi baru sampai batas revisi. Semua versi tetap tersimpan dan versi terbaru menjadi versi utama.',
  },
  {
    id: 'gagal',
    title: 'Bagaimana jika AI gagal menilai?',
    content:
      'Sistem mencoba ulang secara otomatis. Bila tetap gagal, status berubah menjadi “AI gagal menilai”, pengajar diberi tahu, dan penilaian dapat dicoba kembali.',
  },
] as const;
