# Setup Supabase untuk EssayFlow

1. **Buat project** di https://supabase.com/dashboard (gratis).
2. **Jalankan schema**: Supabase dashboard → SQL Editor → tempel isi `supabase/schema.sql` → Run.
   Ini membuat semua tabel (`profiles`, `classes`, `tasks`, `submissions`, dst), RLS policy,
   dan trigger yang otomatis bikin baris `profiles` setiap ada user baru (termasuk dari Google).
3. **Ambil kredensial**: Project Settings → API → salin `Project URL` dan `anon public` key
   ke `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
4. **(Opsional) Aktifkan Google login**: Authentication → Providers → Google.
   Butuh Client ID + Secret dari Google Cloud Console (OAuth consent screen +
   credentials, authorized redirect URI: `https://xxxx.supabase.co/auth/v1/callback`).
   Tanpa ini, tombol "Lanjutkan dengan Google" tetap tampil error yang jelas,
   bukan gagal diam-diam.
5. **Buat 2 akun demo** (biar tombol autofill di halaman login jalan) —
   Authentication → Users → Add user, untuk tiap akun di `src/lib/auth/mock-users.ts`
   (`DEMO_ACCOUNTS`), pakai password `essayflow2026`. Lalu di SQL Editor:
   ```sql
   update public.profiles set role = 'pengajar', profile_complete = true,
     name = 'Dr. Budi Santoso', identity_number = 'NIP 198203142008011003'
   where email = 'budi.santoso@kampus.ac.id';

   update public.profiles set role = 'mahasiswa', profile_complete = true,
     name = 'Andi Pratama', identity_number = '26231001'
   where email = 'andi.pratama@student.kampus.ac.id';
   ```
6. **Jalankan migrasi tambahan**: SQL Editor → tempel isi `supabase/schema_additions.sql` → Run.
   Ini menambahkan `identity_number` ke trigger signup, tabel `contact_messages`
   untuk form kontak, dan bucket Storage `submissions` (untuk upload PDF/Word)
   beserta policy-nya.
7. **(Untuk AI grading)** Isi `AI_PROVIDER_API_KEY` di `.env.local` dengan Anthropic API key.
   Tanpa ini, saran rubrik & penilaian tetap jalan tapi pakai mock deterministik.
8. `npm install && npm run dev`.

## Catatan

- Password di-hash oleh Supabase sendiri — `bcryptjs` sudah dihapus dari project ini,
  tidak dipakai lagi.
- `essayflow_session` (cookie lama, HMAC-signed) masih dipakai untuk state login
  di seluruh app — `AuthService` cuma jembatan ke Supabase, halaman lain tidak berubah.
- RLS policy di `schema.sql` adalah titik awal yang masuk akal, bukan audit keamanan
  lengkap — review lagi sebelum dipakai produksi. Dua hal yang perlu diperhatikan:
  - `profiles` bisa dibaca semua user yang login (perlu untuk nama pengajar/mahasiswa
    muncul di berbagai halaman).
  - `submission_versions: student manages own` pakai `for all`, artinya secara teori
    seorang mahasiswa yang memanggil Supabase langsung (bukan lewat API route ini)
    bisa menulis kolom `assessment`/`status` miliknya sendiri. API route di app ini
    tidak pernah membiarkan itu terjadi, tapi kalau RLS ini penting sebagai lapisan
    pertahanan kedua, pertimbangkan mempersempitnya jadi read-only untuk mahasiswa.
- Data (tasks/classes/submissions/dll) sudah disambungkan ke Supabase lewat
  `repository.ts` — `src/data/mock` tidak lagi dipakai oleh halaman manapun.
