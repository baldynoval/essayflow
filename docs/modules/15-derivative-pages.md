# EssayFlow — Modul 15: Halaman Turunan

| Item | Keterangan |
|---|---|
| Route | `/register`, `/lupa-password`, `/lengkapi-profil`, `/faq`, `/bantuan`, `/kontak`, `/tentang`, `/privasi`, `/ketentuan` |

## Berkas baru
- `src/app/register/page.tsx`, `src/app/lupa-password/page.tsx`, `src/app/lengkapi-profil/page.tsx`
- `src/app/(marketing)/layout.tsx` + `faq`, `bantuan`, `kontak`, `tentang`, `privasi`, `ketentuan`
- `src/components/auth/RegisterForm.tsx`

## Acuan visual
Register, Lupa Password, dan Lengkapi Profil memakai `AuthShell` (acuan Modul 02).
FAQ, Pusat Bantuan, Kontak, Tentang, Privasi, dan Ketentuan memakai navigasi dan footer
halaman landing (acuan Modul 01). Tidak ada identitas visual baru.

Halaman turunan lain sudah tercakup modul sebelumnya: Release Confirmation berupa dialog
konfirmasi pada Modul 08, Class Detail pada Modul 09, Submission Success pada Modul 11,
Student History pada Modul 13.

## Keterbatasan
Pendaftaran, pengaturan ulang password, dan formulir kontak belum terhubung ke layanan nyata.


---

## MODULE_MANIFEST — 15 Derivative Pages

MODULE: 15 — Derivative Pages
ROUTES: `/register`, `/lupa-password`, `/lengkapi-profil`, `/faq`, `/bantuan`, `/kontak`, `/tentang`, `/privasi`, `/ketentuan`
NEW COMPONENTS: `RegisterForm`, layout `(marketing)`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: tidak ada
NEW UTILITIES: tidak ada
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: `GET /api/auth/google` (daftar dengan Google)
INTEGRATION POINTS: `/lengkapi-profil` adalah tujuan pengguna Google baru dari Modul 02
NEXT MODULE: —
KNOWN ISSUES: formulir pada halaman turunan belum terhubung ke layanan email/basis data
