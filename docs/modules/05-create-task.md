# EssayFlow — Modul 05: Create Task

| Item | Keterangan |
|---|---|
| Nama | 05 — Create Task |
| Route | `/teacher/tasks/create`, `POST /api/tasks` |

## Berkas baru
- `src/app/teacher/tasks/create/page.tsx`
- `src/app/api/tasks/route.ts`
- `src/components/teacher/CreateTaskForm.tsx`

## Cakupan
Informasi Tugas · Pengumpulan · Rubrik Penilaian · Pengaturan.
Jenis pengumpulan Teks/Kode/PDF/Word, tenggat (tanggal + waktu WIB), tiga kebijakan
keterlambatan (tidak diizinkan, sampai tugas ditutup, batas jam keterlambatan), batas
ukuran berkas, revisi + jumlah maksimum, penilaian AI, penilaian ulang tiap revisi.
Aksi: **Simpan sebagai Draft** dan **Buat Tugas**. Total bobot rubrik wajib 100% sebelum aktif.

## Integrasi
`POST /api/tasks` memvalidasi payload dan mengembalikan tugas. Persistensi menyusul saat basis data dipilih.

## Modul berikutnya
06 — AI Rubric Workspace


---

## MODULE_MANIFEST — 05 Create Task

MODULE: 05 — Create Task
ROUTES: `/teacher/tasks/create`, `POST /api/tasks`
NEW COMPONENTS: `CreateTaskForm`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: dipakai dari `types/domain.ts` (TaskSettings, LatePolicy, SubmissionType)
NEW UTILITIES: `lib/ai/ai-service.ts` (AIService + mock + preset rubrik)
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: `AI_PROVIDER_API_KEY` (opsional, belum wajib)
API/SERVICE INTERFACES: `POST /api/tasks`
INTEGRATION POINTS: tombol "Buat dengan AI" menuju Modul 06
NEXT MODULE: 06 — AI Rubric Workspace
KNOWN ISSUES: tugas belum tersimpan permanen (tanpa basis data)
