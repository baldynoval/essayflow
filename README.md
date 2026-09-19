# EssayFlow

Frontend MVP platform penilaian esai akademik untuk **pengajar** dan **mahasiswa**, dengan bantuan AI.
Saat ini semua data dan layanan AI masih **mock** (belum ada basis data atau AI sungguhan).

Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3.4 · Framer Motion · Lucide.

## Menjalankan

Butuh Node 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # isi AUTH_SECRET (wajib di production)
npm run dev                  # http://localhost:3000
```

Skrip lain: `npm run typecheck`, `npm run lint`, `npm run build`, `npm start`.

## Akun demo

Kata sandi semua akun: `essayflow2026`

| Peran | Email |
|---|---|
| Pengajar | `budi.santoso@kampus.ac.id` |
| Mahasiswa | `andi.pratama@student.kampus.ac.id` |

## Struktur folder

```
essayflow/
├── docs/                  Dokumentasi progres dan catatan per modul
│   ├── PROGRESS_MANIFEST.md
│   └── modules/           01-landing.md … 15-derivative-pages.md
├── public/
├── src/
│   ├── app/               Route (App Router) + API route
│   │   ├── (marketing)/   faq, bantuan, kontak, tentang, privasi, ketentuan
│   │   ├── teacher/       Area pengajar
│   │   ├── student/       Area mahasiswa
│   │   ├── settings/      Pengaturan (bersama)
│   │   ├── login/ register/ lupa-password/ lengkapi-profil/
│   │   └── api/           auth, tasks, ai/rubric, submissions
│   ├── components/
│   │   ├── ui/            Komponen dasar (Button, Card, Modal, Table, …)
│   │   ├── layout/        TopNavigation, Sidebar, AppShell, MarketingFooter
│   │   ├── app/           Komponen bersama area login (TaskCard, SettingsView, …)
│   │   ├── auth/  teacher/  student/  ai/  marketing/
│   ├── data/              Data contoh (landing.ts, mock.ts)
│   ├── design/            Design token (tokens.ts → tailwind.config.ts)
│   ├── lib/
│   │   ├── auth/          Sesi (cookie httpOnly, HMAC), guard, AuthService mock
│   │   ├── ai/            AIService mock
│   │   └── data/          repository.ts — satu-satunya akses data
│   └── types/
├── .env.example
└── (konfigurasi: next, tailwind, postcss, eslint, tsconfig)
```

## Rute

- **Publik:** `/`, `/login`, `/register`, `/lupa-password`, `/lengkapi-profil`, `/faq`, `/bantuan`, `/kontak`, `/tentang`, `/privasi`, `/ketentuan`
- **Pengajar:** `/teacher`, `/teacher/tasks`, `/teacher/tasks/[id]`, `/teacher/tasks/create`, `/teacher/tasks/create/rubric`, `/teacher/review/[id]`, `/teacher/classes`, `/teacher/classes/[id]`, `/teacher/students`
- **Mahasiswa:** `/student`, `/student/tasks`, `/student/tasks/[id]`, `/student/tasks/[id]/revisions`, `/student/submissions/[id]`, `/student/results`, `/student/results/[id]`, `/student/history`
- **Bersama:** `/settings`

## Status dan keterbatasan

- Ke-15 modul UI sudah selesai (lihat `docs/PROGRESS_MANIFEST.md`).
- Belum ada persistensi: data yang dibuat (tugas, kelas, pengumpulan, keputusan rilis) kembali ke data contoh setelah muat ulang.
- Login Google dan layanan AI nyata menunggu kredensial di environment (lihat `.env.example`).
- Formulir di halaman turunan (register, lupa password, kontak) belum terhubung ke layanan email atau basis data.
