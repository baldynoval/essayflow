import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { LoginFormSkeleton } from '@/components/auth/LoginFormSkeleton';
import { dashboardPathFor } from '@/lib/auth/routes';
import { readSession } from '@/lib/auth/session';

export const metadata: Metadata = {
  title: 'Masuk — EssayFlow',
  description: 'Masuk ke EssayFlow untuk mengelola tugas, rubrik, dan hasil penilaian akademik.',
};

export default async function LoginPage() {
  const session = await readSession();
  if (session) redirect(dashboardPathFor(session.role));

  return (
    <main id="konten-utama">
      <AuthShell
        title="Selamat Datang Kembali"
        description="Masuk untuk melanjutkan ke akun Anda. Pilih peran Anda terlebih dahulu agar EssayFlow menampilkan ruang kerja yang sesuai."
      >
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </main>
  );
}
