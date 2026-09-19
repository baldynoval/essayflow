import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth/AuthShell';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Daftar — EssayFlow' };

export default function RegisterPage() {
  return (
    <main id="konten-utama">
      <AuthShell
        title="Buat Akun EssayFlow"
        description="Pilih peran Anda, lalu lengkapi data diri. Pengajar mengelola tugas dan rubrik; mahasiswa mengumpulkan tugas dan melihat hasil penilaian."
      >
        <RegisterForm />
      </AuthShell>
    </main>
  );
}
