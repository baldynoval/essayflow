# EssayFlow — Modul 07: Teacher Task Detail

| Item | Keterangan |
|---|---|
| Route | `/teacher/tasks`, `/teacher/tasks/[id]` |

## Berkas baru
- `src/app/teacher/tasks/page.tsx` (daftar tugas)
- `src/app/teacher/tasks/[id]/page.tsx`
- `src/components/teacher/SubmissionTable.tsx`

## Cakupan
Header tugas (judul, status, kelas, tenggat, jumlah mahasiswa), statistik
Mahasiswa / Dikumpulkan / Menunggu Review / Sudah Dinilai, ringkasan rubrik yang dapat
dibuka, tombol Edit Rubrik, serta tabel mahasiswa (Mahasiswa, NIM, Status, Nilai AI,
Tanggal, Aksi) dengan filter Semua / Menunggu Review / Sudah Dinilai / Belum Mengumpulkan
dan pencarian nama atau NIM. Pada layar kecil tabel berubah menjadi daftar kartu.

## Modul berikutnya
08 — Teacher AI Review


---

## MODULE_MANIFEST — 07 Teacher Task Detail

MODULE: 07 — Teacher Task Detail
ROUTES: `/teacher/tasks`, `/teacher/tasks/[id]`
NEW COMPONENTS: `SubmissionTable`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: `SubmissionRow` (lokal komponen)
NEW UTILITIES: `latestVersion`, `finalVersionOf` pada repository
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: repository
INTEGRATION POINTS: kolom Aksi menuju `/teacher/review/[id]` (Modul 08)
NEXT MODULE: 08 — Teacher AI Review
KNOWN ISSUES: perubahan bobot rubrik belum memicu dialog hitung ulang (menunggu persistensi)
