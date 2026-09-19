'use client';

import { GraduationCap, Mail, Presentation } from 'lucide-react';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { Alert } from '@/components/ui/Alert';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { LOGIN_PATH } from '@/lib/auth/routes';
import { validateCredentials, type FieldErrors } from '@/lib/auth/validation';
import type { Role } from '@/types/domain';

const ROLE_OPTIONS = [
  { value: 'pengajar' as Role, label: 'Pengajar', icon: <Presentation className="size-4" aria-hidden /> },
  { value: 'mahasiswa' as Role, label: 'Mahasiswa', icon: <GraduationCap className="size-4" aria-hidden /> },
];

/** Registration reuses the Module 02 authentication layout and components. */
export function RegisterForm() {
  const [role, setRole] = useState<Role>('mahasiswa');
  const [name, setName] = useState('');
  const [identity, setIdentity] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [done, setDone] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validateCredentials({ email, password });
    setErrors(next);
    if (Object.keys(next).length === 0 && name.trim()) setDone(true);
  }

  return (
    <div>
      <SegmentedControl options={ROLE_OPTIONS} value={role} onChange={setRole} ariaLabel="Pilih peran" />

      {done && (
        <Alert tone="success" className="mt-6" title="Pendaftaran diterima.">
          Akun akan aktif setelah layanan otentikasi terhubung. Untuk sementara gunakan akun demo pada halaman Masuk.
        </Alert>
      )}

      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-5">
        <Input label="Nama Lengkap" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input
          label={role === 'mahasiswa' ? 'NIM' : 'NIP'}
          value={identity}
          onChange={(event) => setIdentity(event.target.value)}
          inputMode="numeric"
        />
        <Input
          label="Email"
          type="email"
          iconLeft={<Mail className="size-4" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          revealable
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
          hint="Minimal 8 karakter."
          required
        />
        <Button type="submit" size="lg" fullWidth>
          Daftar
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-meta text-ink-3">atau</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <a href="/api/auth/google" className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}>
        <GoogleIcon />
        Daftar dengan Google
      </a>

      <p className="mt-8 text-center text-meta text-ink-2">
        Sudah memiliki akun?{' '}
        <Link href={LOGIN_PATH} className="rounded-sm font-medium text-ink hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
