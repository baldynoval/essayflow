# EssayFlow — Modul 03: Teacher Dashboard

Paket ini berisi seluruh sumber proyek sampai **Modul 03**.

| Item | Keterangan |
|---|---|
| Nama | 03 — Teacher Dashboard |
| Route | `/teacher` |
| Proteksi | `requireRole('pengajar')` — pengunjung tanpa sesi diarahkan ke `/login?next=` |

## Berkas baru
- `src/app/teacher/layout.tsx`, `src/app/teacher/page.tsx`
- `src/components/layout/AppShell.tsx`, `Sidebar.tsx`
- `src/components/app/GlobalSearch.tsx`, `NotificationBell.tsx`, `TaskCard.tsx`, `ActivityItem.tsx`, `RubricSummary.tsx`, `CriteriaScores.tsx`
- `src/components/ui/PageHeader.tsx`, `MetricCard.tsx`, `EmptyState.tsx`, `Skeleton.tsx`, `SearchInput.tsx`, `Select.tsx`, `Textarea.tsx`, `Toggle.tsx`, `Modal.tsx`, `Table.tsx`, `Timeline.tsx`, `FeedbackPanel.tsx`
- `src/data/mock.ts`, `src/lib/data/repository.ts`, `src/lib/auth/guard.ts`
- `src/types/domain.ts` diperluas (Task, ClassRoom, Student, Submission, Assessment, Feedback, dll.)

## Statistik dasbor
Tugas Aktif · Menunggu Review · Sudah Dinilai · Mahasiswa, ditambah Tugas Terbaru dan Aktivitas Terbaru.

## Menjalankan
`npm install` → `cp .env.example .env.local` (isi `AUTH_SECRET`) → `npm run dev`
Masuk sebagai pengajar: budi.santoso@kampus.ac.id / essayflow2026

## Integrasi
Semua data lewat `src/lib/data/repository.ts`. Mengganti ke database cukup menulis ulang berkas itu.

## Keterbatasan
`/teacher/tasks`, `/teacher/classes`, `/teacher/students` menyusul pada Modul 05–09.

## Modul berikutnya
04 — Student Dashboard (`/student`)


---

## MODULE_MANIFEST — 03 Teacher Dashboard

MODULE: 03 — Teacher Dashboard
ROUTES: `/teacher`
NEW COMPONENTS: AppShell, Sidebar, MobileNav, GlobalSearch, NotificationBell, TaskCard, ActivityItem, RubricSummary, CriteriaScores, PageHeader, MetricCard, EmptyState, Skeleton, SearchInput, Select, Textarea, Toggle, Modal, Table, Timeline, FeedbackPanel
MODIFIED COMPONENTS: tidak ada
NEW TYPES: Teacher, Student, ClassRoom, JoinRequest, Task, TaskSettings, Submission, SubmissionVersion, Assessment, Feedback, ActivityItemData
NEW UTILITIES: `lib/data/repository.ts`, `lib/auth/guard.ts`, `data/mock.ts`
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: sama seperti Modul 02
API/SERVICE INTERFACES: fungsi repository (listTasks, listClasses, listSubmissions, teacherStats, studentStats, …)
INTEGRATION POINTS: `AppShell` dipakai seluruh halaman aplikasi; navigasi sidebar per peran
NEXT MODULE: 04 — Student Dashboard
KNOWN ISSUES: rute tugas/kelas/mahasiswa belum ada sampai Modul 05–09
