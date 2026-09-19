# EssayFlow — Modul 08: Teacher AI Review

| Item | Keterangan |
|---|---|
| Route | `/teacher/review/[id]` |

## Berkas baru
- `src/app/teacher/review/[id]/page.tsx`
- `src/components/teacher/ReviewWorkspace.tsx`

## Cakupan
Ruang kerja tiga panel: **Data Mahasiswa** (kiri), **Jawaban Mahasiswa** (tengah),
**Evaluasi AI** (kanan). Menampilkan nilai AI, nilai per kriteria, dan feedback
(Yang sudah baik / Yang perlu diperbaiki / Saran).

Aksi: Edit Nilai, Edit Feedback, Sesuaikan Nilai Akhir, Simpan sebagai Draft,
Setujui & Rilis. Penyesuaian nilai akhir manual **wajib dikonfirmasi** melalui dialog,
begitu pula perilisan hasil.

Bila belum ada draf AI, halaman menampilkan status proses atau status
"AI gagal menilai" beserta tombol Coba Lagi; pengumpulan tidak ditandai selesai dinilai.

## Privasi
Ruang tinjauan hanya menampilkan jawaban mahasiswa yang sedang ditinjau.

## Modul berikutnya
09 — Class Management


---

## MODULE_MANIFEST — 08 Teacher AI Review

MODULE: 08 — Teacher AI Review
ROUTES: `/teacher/review/[id]`
NEW COMPONENTS: `ReviewWorkspace`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: tidak ada
NEW UTILITIES: memakai `weightedScore`
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: `AIService.evaluate` (Modul 06) untuk draf penilaian
INTEGRATION POINTS: status rilis menentukan apa yang dilihat mahasiswa pada Modul 12
NEXT MODULE: 09 — Class Management
KNOWN ISSUES: keputusan rilis belum tersimpan permanen
