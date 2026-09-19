import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Lengkapi Profil — EssayFlow' };

/** Shown after a first Google sign-in, before entering a dashboard. */
export default function CompleteProfilePage() {
  return (
    <main id="konten-utama">
      <AuthShell
        title="Lengkapi Profil Anda"
        description="Akun Google Anda sudah terhubung. Pilih peran dan lengkapi data diri sebelum masuk ke dasbor."
      >
        <RegisterForm />
      </AuthShell>
    </main>
  );
}
