import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Lupa Password — EssayFlow' };

export default function ForgotPasswordPage() {
  return (
    <main id="konten-utama">
      <AuthShell
        title="Atur Ulang Password"
        description="Masukkan email akun Anda. Tautan pengaturan ulang password akan dikirim ke email tersebut."
      >
        <ForgotPasswordForm />
        <p className="mt-8 text-center text-meta text-ink-2">
          <Link href="/login" className="rounded-sm text-ink hover:underline">
            Kembali ke halaman Masuk
          </Link>
        </p>
      </AuthShell>
    </main>
  );
}
