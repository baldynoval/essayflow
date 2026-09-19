# EssayFlow — Modul 04: Student Dashboard

Paket ini berisi seluruh sumber proyek sampai **Modul 04**.

| Item | Keterangan |
|---|---|
| Nama | 04 — Student Dashboard |
| Route | `/student` |
| Proteksi | `requireRole('mahasiswa')` |

## Berkas baru
- `src/app/student/layout.tsx`, `src/app/student/page.tsx`

## Berkas dipakai ulang
`AppShell`, `Sidebar` (navigasi mahasiswa), `MetricCard`, `TaskCard`, `StatusBadge`, `Badge`, `EmptyState`, repository.

## Statistik dasbor
Rata-rata Nilai · Jumlah Tugas · Tugas Selesai · Nilai Terbaru, ditambah Tugas Aktif, Hasil Penilaian Terbaru, dan Segera Berakhir.

## Privasi
Mahasiswa hanya melihat pengumpulan dan nilai miliknya sendiri. Nilai baru tampil setelah pengajar merilis hasil.

## Menjalankan
Masuk sebagai mahasiswa: andi.pratama@student.kampus.ac.id / essayflow2026

## Keterbatasan
`/student/tasks`, `/student/results`, `/student/history` menyusul pada Modul 10–13.

## Modul berikutnya
05 — Create Task (`/teacher/tasks/create`)


---

## MODULE_MANIFEST — 04 Student Dashboard

MODULE: 04 — Student Dashboard
ROUTES: `/student`
NEW COMPONENTS: tidak ada (seluruhnya memakai ulang komponen Modul 03)
MODIFIED COMPONENTS: tidak ada
NEW TYPES: tidak ada
NEW UTILITIES: `studentStats`, `releasedScore` pada repository
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: sama seperti Modul 02
API/SERVICE INTERFACES: repository
INTEGRATION POINTS: kartu hasil menautkan ke `/student/results/[id]` (Modul 12)
NEXT MODULE: 05 — Create Task
KNOWN ISSUES: tautan hasil/tugas mahasiswa aktif setelah Modul 10–12
