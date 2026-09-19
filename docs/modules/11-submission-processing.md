# EssayFlow — Modul 11: Submission Status / AI Processing

| Item | Keterangan |
|---|---|
| Route | `/student/submissions/[id]` |

## Berkas baru
- `src/app/student/submissions/[id]/page.tsx`
- `src/components/student/AIProcessing.tsx`

## Cakupan
Konfirmasi "Tugas berhasil dikumpulkan", waktu pengumpulan, dan linimasa Dikumpulkan → AI Menilai → Menunggu Review → Sudah Dinilai. Tahapan AI: Menganalisis Jawaban, Mencocokkan Rubrik, Membuat Feedback, Selesai. **Nilai belum ditampilkan**; pesan yang tampil: penilaian AI sedang diproses dan hasil tersedia setelah ditinjau pengajar. Mahasiswa boleh meninggalkan halaman — proses berjalan di latar belakang. Status "AI gagal menilai" disertai tombol Coba Lagi.

## Modul berikutnya
12 — Student Result


---

## MODULE_MANIFEST — 11 Submission Status / AI Processing

MODULE: 11 — Submission Status / AI Processing
ROUTES: `/student/submissions/[id]`
NEW COMPONENTS: AIProcessing
MODIFIED COMPONENTS: tidak ada
NEW TYPES: memakai tipe pada `types/domain.ts`
NEW UTILITIES: fungsi repository terkait
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: repository
INTEGRATION POINTS: status rilis menentukan tautan ke Modul 12
NEXT MODULE: 12 — Student Result
KNOWN ISSUES: data belum tersimpan permanen sampai basis data dipilih
