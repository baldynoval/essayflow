# EssayFlow — Modul 10: Student Task / Submission

| Item | Keterangan |
|---|---|
| Route | `/student/tasks`, `/student/tasks/[id]`, `POST /api/submissions` |

## Berkas baru
- `src/app/student/tasks/page.tsx`, `src/app/student/tasks/[id]/page.tsx`
- `src/app/api/submissions/route.ts`
- `src/components/student/SubmissionForm.tsx`

## Cakupan
Judul tugas, status, kelas, tenggat, instruksi, dan rubrik. Mode pengumpulan Teks, Kode, PDF, dan Word: editor teks dengan hitungan kata, editor kode dengan pemilih bahasa dan nomor baris, serta unggah berkas dengan pratinjau, ganti, hapus, dan pesan "File gagal diunggah" plus tombol Coba Lagi. Tombol **Kumpulkan Tugas** selalu memunculkan dialog konfirmasi. Bila tenggat lewat dan keterlambatan dilarang, tombol nonaktif dan alasannya dijelaskan.

## Modul berikutnya
11 — Submission Status / AI Processing


---

## MODULE_MANIFEST — 10 Student Task / Submission

MODULE: 10 — Student Task / Submission
ROUTES: `/student/tasks`, `/student/tasks/[id]`, `POST /api/submissions`
NEW COMPONENTS: SubmissionForm
MODIFIED COMPONENTS: tidak ada
NEW TYPES: memakai tipe pada `types/domain.ts`
NEW UTILITIES: fungsi repository terkait
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: `POST /api/submissions`
INTEGRATION POINTS: sukses mengarahkan ke `/student/submissions/[id]`
NEXT MODULE: 11 — Submission Status / AI Processing
KNOWN ISSUES: data belum tersimpan permanen sampai basis data dipilih
