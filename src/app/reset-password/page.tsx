import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = { title: 'Atur Password Baru — EssayFlow' };

export default function ResetPasswordPage() {
  return (
    <main id="konten-utama">
      <AuthShell title="Atur Password Baru" description="Masukkan password baru untuk akun Anda.">
        <ResetPasswordForm />
      </AuthShell>
    </main>
  );
}
