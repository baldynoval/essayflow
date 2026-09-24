/**
 * Demo account list shown on the login page so reviewers can try EssayFlow
 * without a real account. Purely for the "isi otomatis" autofill button in
 * LoginForm.tsx — actual authentication goes through Supabase (auth-service.ts).
 *
 * Seed these two accounts in Supabase (dashboard → Authentication → Users, or
 * supabase.auth.admin.createUser) with this password, and give each a
 * matching row in `profiles` with the right `role`.
 */

export const DEMO_ACCOUNTS = [
  { role: 'pengajar' as const, email: 'budi.santoso@kampus.ac.id', password: 'essayflow2026' },
  { role: 'mahasiswa' as const, email: 'andi.pratama@student.kampus.ac.id', password: 'essayflow2026' },
];
