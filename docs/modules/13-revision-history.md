# EssayFlow — Modul 13: Revision / Version History

| Item | Keterangan |
|---|---|
| Route | `/student/tasks/[id]/revisions`, `/student/history` |

## Berkas baru
- `src/app/student/tasks/[id]/revisions/page.tsx`
- `src/app/student/history/page.tsx`

## Cakupan
Riwayat Revisi dengan penanda Revisi Diizinkan, kartu Batas Revisi / Revisi Digunakan / Deadline Revisi, dan daftar versi (Versi 1, Versi 2, …) berisi waktu pengumpulan, status, serta nilai bila sudah dirilis. Versi terbaru menjadi versi utama; versi lama tetap dapat diakses. Halaman Riwayat merangkum seluruh pengumpulan beserta versinya.

## Modul berikutnya
14 — Profile / Settings


---

## MODULE_MANIFEST — 13 Revision / Version History

MODULE: 13 — Revision / Version History
ROUTES: `/student/tasks/[id]/revisions`, `/student/history`
NEW COMPONENTS: tidak ada
MODIFIED COMPONENTS: tidak ada
NEW TYPES: memakai tipe pada `types/domain.ts`
NEW UTILITIES: fungsi repository terkait
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: repository
INTEGRATION POINTS: pengajar memilih versi final pada Modul 08
NEXT MODULE: 14 — Profile / Settings
KNOWN ISSUES: data belum tersimpan permanen sampai basis data dipilih
