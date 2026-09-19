# EssayFlow — Modul 09: Class Management

| Item | Keterangan |
|---|---|
| Route | `/teacher/classes`, `/teacher/classes/[id]`, `/teacher/students` |

## Berkas baru
- `src/app/teacher/classes/page.tsx`, `src/app/teacher/classes/[id]/page.tsx`
- `src/app/teacher/students/page.tsx`
- `src/components/teacher/ClassGrid.tsx`

## Cakupan
Kartu kelas dengan Program Studi, Semester, Jumlah Mahasiswa, dan Kode Kelas; pencarian
kelas; dialog **Buat Kelas** yang menghasilkan kode kelas. Halaman detail kelas menampilkan
permintaan bergabung (Setujui / Tolak, penolakan dapat disertai alasan) dan daftar mahasiswa.

## Modul berikutnya
10 — Student Task / Submission


---

## MODULE_MANIFEST — 09 Class Management

MODULE: 09 — Class Management
ROUTES: `/teacher/classes`, `/teacher/classes/[id]`, `/teacher/students`
NEW COMPONENTS: `ClassGrid`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: memakai `ClassRoom`, `JoinRequest`
NEW UTILITIES: `listJoinRequests` pada repository
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: repository
INTEGRATION POINTS: kode kelas dipakai mahasiswa untuk mengajukan bergabung
NEXT MODULE: 10 — Student Task / Submission
KNOWN ISSUES: pembuatan kelas dan keputusan permintaan belum tersimpan permanen
