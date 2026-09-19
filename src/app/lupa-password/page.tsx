import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const metadata: Metadata = { title: 'Lupa Password — EssayFlow' };

export default function ForgotPasswordPage() {
  return (
    <main id="konten-utama">
      <AuthShell
        title="Atur Ulang Password"
        description="Masukkan email akun Anda. Tautan pengaturan ulang password akan dikirim ke email tersebut."
      >
        <form className="flex flex-col gap-5">
          <Input label="Email" type="email" name="email" placeholder="nama@email.com" required />
          <Button type="submit" size="lg" fullWidth>
            Kirim Tautan
          </Button>
        </form>
        <Alert tone="info" className="mt-6">
          Pengiriman email aktif setelah layanan email terhubung. Lingkungan demo belum mengirim pesan nyata.
        </Alert>
        <p className="mt-8 text-center text-meta text-ink-2">
          <Link href="/login" className="rounded-sm text-ink hover:underline">
            Kembali ke halaman Masuk
          </Link>
        </p>
      </AuthShell>
    </main>
  );
}
