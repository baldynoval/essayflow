# EssayFlow — Modul 14: Profile / Settings

| Item | Keterangan |
|---|---|
| Route | `/settings` (pengajar dan mahasiswa) |

## Berkas baru
- `src/app/settings/layout.tsx`, `src/app/settings/page.tsx`
- `src/components/app/SettingsView.tsx`

## Cakupan
**Profil**: Nama, Email, NIM/NIP, Role, avatar (fallback inisial). NIM tidak dapat diubah mahasiswa.
**Keamanan**: Password saat ini, Password baru, Konfirmasi password beserta validasinya.
**Notifikasi**: preferensi per aktivitas (tugas baru, deadline, pengumpulan mahasiswa, hasil AI selesai,
menunggu review, hasil dirilis) dengan kanal App dan Email.
**Preferensi**: Light / Dark (disimpan di perangkat, atribut `data-theme`), Bahasa Indonesia.
**Dukungan**: FAQ, Pusat Bantuan, Kontak. **Logout**.

## Modul berikutnya
15 — Halaman turunan


---

## MODULE_MANIFEST — 14 Profile / Settings

MODULE: 14 — Profile / Settings
ROUTES: `/settings`
NEW COMPONENTS: `SettingsView`
MODIFIED COMPONENTS: tidak ada
NEW TYPES: tidak ada
NEW UTILITIES: memakai `requireSession`
NEW DEPENDENCIES: tidak ada
ENVIRONMENT VARIABLES: tidak ada tambahan
API/SERVICE INTERFACES: `POST /api/auth/logout`
INTEGRATION POINTS: token tema gelap sudah tersedia sejak Modul 01 (`[data-theme="dark"]`)
NEXT MODULE: 15 — Derivative Pages
KNOWN ISSUES: perubahan profil, password, dan preferensi notifikasi belum tersimpan permanen
