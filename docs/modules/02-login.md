# EssayFlow — Modul 02: Login / Authentication

Platform penilaian tugas akademik berbantuan AI. Paket ini berisi seluruh sumber
proyek sampai **Modul 02** (Modul 01 Landing sudah termasuk).

## Modul

| Item | Keterangan |
|---|---|
| Nama | 02 — Login / Authentication |
| Tujuan | Halaman masuk sadar-peran + arsitektur otentikasi & sesi |
| Route | `/login`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/google` |

## Berkas baru

- `src/app/login/page.tsx`
- `src/app/api/auth/login/route.ts`, `logout/route.ts`, `google/route.ts`
- `src/components/auth/AuthShell.tsx`, `AuthVisual.tsx`, `LoginForm.tsx`, `LoginFormSkeleton.tsx`, `GoogleIcon.tsx`
- `src/components/ui/Input.tsx`, `SegmentedControl.tsx`, `Alert.tsx`
- `src/lib/auth/auth-service.ts`, `session.ts`, `routes.ts`, `google.ts`, `validation.ts`, `mock-users.ts`
- `src/types/auth.ts`

## Berkas diubah

- `.env.example` (AUTH_SECRET, GOOGLE_*)

## Komponen dipakai ulang

`Button`, `Logo`, `Reveal`, `Badge`, `ScoreDisplay`, `AIIndicator`, token desain Modul 01.

## Dependensi

Tidak ada dependensi baru.

## Environment variable

| Nama | Wajib | Fungsi |
|---|---|---|
| `AUTH_SECRET` | ya (produksi) | Kunci tanda tangan cookie sesi |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | tidak | Mengaktifkan Masuk dengan Google |

Tanpa kredensial Google, tombol tetap tampil dan mengarahkan kembali ke `/login`
dengan pesan bahwa provider belum tersedia. Tidak ada kredensial palsu di repo.

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi AUTH_SECRET
npm run dev
```

Build: `npm run build && npm start` · Typecheck: `npm run typecheck` · Lint: `npm run lint`

## Akun demo

| Peran | Email | Password |
|---|---|---|
| Pengajar | budi.santoso@kampus.ac.id | essayflow2026 |
| Mahasiswa | andi.pratama@student.kampus.ac.id | essayflow2026 |

## Integrasi

- Ganti backend nyata cukup dengan mengimplementasikan `AuthService` lalu menukar
  instance di `getAuthService()`. Halaman dan komponen tidak perlu diubah.
- Sesi dibaca dengan `readSession()` (cookie httpOnly bertanda tangan HMAC).
- Redirect per peran memakai `dashboardPathFor()` di `src/lib/auth/routes.ts`.

## Keterbatasan

- `/teacher`, `/student` dibuat pada Modul 03–04; `/register`, `/lupa-password`,
  `/lengkapi-profil` dibuat pada Modul 15.
- Password akun demo masih plaintext (khusus mock); implementasi nyata wajib hashing.

## Modul berikutnya

03 — Teacher Dashboard (`/teacher`)


---

## MODULE_MANIFEST — 02 Login / Authentication

MODULE
02 — Login / Authentication

ROUTES
- `/login` (halaman)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/google`

NEW COMPONENTS
- ui: `Input`, `SegmentedControl`, `Alert`
- auth: `AuthShell`, `AuthVisual`, `LoginForm`, `LoginFormSkeleton`, `GoogleIcon`

MODIFIED COMPONENTS
- tidak ada (komponen Modul 01 dipakai apa adanya)

NEW TYPES
- `src/types/auth.ts`: `AuthUser`, `Session`, `Credentials`, `AuthError`, `AuthResult`, `AuthProvider`

NEW UTILITIES
- `lib/auth/validation.ts`, `lib/auth/routes.ts`, `lib/auth/session.ts`, `lib/auth/google.ts`, `lib/auth/mock-users.ts`

NEW DEPENDENCIES
- tidak ada

ENVIRONMENT VARIABLES
- `AUTH_SECRET` (wajib di produksi), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

API/SERVICE INTERFACES
- `AuthService`: `signInWithPassword`, `signInWithGoogle`, `getUserById`
- Implementasi aktif: `MockAuthService` (data `mock-users.ts`)

INTEGRATION POINTS
- `readSession()` untuk proteksi rute modul berikutnya
- `dashboardPathFor(role)` untuk redirect pasca-login
- `safeRedirect()` menolak redirect eksternal via `?next=`

NEXT MODULE
03 — Teacher Dashboard

KNOWN ISSUES
- Tujuan redirect `/teacher` dan `/student` belum ada sampai Modul 03–04
- `/register`, `/lupa-password`, `/lengkapi-profil` menyusul di Modul 15
