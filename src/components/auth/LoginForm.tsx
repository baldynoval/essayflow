'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Mail, Presentation } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { Alert } from '@/components/ui/Alert';
import { Button, buttonClasses } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { motionTokens } from '@/design/tokens';
import { DEMO_ACCOUNTS } from '@/lib/auth/mock-users';
import { FORGOT_PASSWORD_PATH, REGISTER_PATH } from '@/lib/auth/routes';
import { validateCredentials, type FieldErrors } from '@/lib/auth/validation';
import type { AuthResult } from '@/types/auth';
import type { Role } from '@/types/domain';

type Status = 'idle' | 'submitting' | 'success';

const ROLE_OPTIONS = [
  { value: 'pengajar' as Role, label: 'Pengajar', icon: <Presentation className="size-4" aria-hidden /> },
  { value: 'mahasiswa' as Role, label: 'Mahasiswa', icon: <GraduationCap className="size-4" aria-hidden /> },
];

const PROVIDER_MESSAGES: Record<string, string> = {
  'google-belum-dikonfigurasi':
    'Masuk dengan Google belum tersedia pada lingkungan ini. Gunakan email dan password, atau hubungi administrator.',
  sesi_berakhir: 'Sesi Anda telah berakhir. Silakan masuk kembali.',
};

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const [role, setRole] = useState<Role>('pengajar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const next = params.get('next');

  useEffect(() => {
    const code = params.get('error');
    if (code) setNotice(PROVIDER_MESSAGES[code] ?? 'Terjadi kesalahan saat proses masuk.');
  }, [params]);

  const submitting = status === 'submitting';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setNotice(null);

    const errors = validateCredentials({ email, password });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus('submitting');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, remember, next }),
      });
      const result = (await response.json()) as AuthResult;

      if (!result.ok) {
        setStatus('idle');
        setFieldErrors(result.error.fields ?? {});
        setFormError(result.error.message);
        return;
      }

      setStatus('success');
      router.push(result.redirectTo);
      router.refresh();
    } catch {
      setStatus('idle');
      setFormError('Tidak dapat terhubung ke server. Periksa koneksi Anda lalu coba lagi.');
    }
  }

  function fillDemo() {
    const account = DEMO_ACCOUNTS.find((item) => item.role === role);
    if (!account) return;
    setEmail(account.email);
    setPassword(account.password);
    setFieldErrors({});
    setFormError(null);
  }

  return (
    <div>
      <div className="lg:hidden">
        <h1 className="text-sub text-ink">Selamat Datang Kembali</h1>
        <p className="mt-2 text-body-sm text-ink-2">Masuk untuk melanjutkan ke akun Anda.</p>
      </div>

      <SegmentedControl
        options={ROLE_OPTIONS}
        value={role}
        onChange={(value) => {
          setRole(value);
          setFormError(null);
        }}
        ariaLabel="Pilih peran"
        className="mt-6 lg:mt-0"
      />

      <AnimatePresence initial={false}>
        {(formError || notice) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: reduce ? 0 : motionTokens.duration.base, ease: motionTokens.ease }}
            className="overflow-hidden"
          >
            <Alert tone={formError ? 'danger' : 'info'} className="mt-6">
              {formError ?? notice}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col gap-5">
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="nama@email.com"
          iconLeft={<Mail className="size-4" />}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          disabled={submitting || status === 'success'}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Masukkan password"
          revealable
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
          disabled={submitting || status === 'success'}
          required
          labelAddon={
            <Link
              href={FORGOT_PASSWORD_PATH}
              className="rounded-sm text-meta text-ink-2 underline-offset-4 transition-colors duration-200 hover:text-ink hover:underline motion-reduce:transition-none"
            >
              Lupa Password?
            </Link>
          }
        />

        <label className="inline-flex cursor-pointer select-none items-center gap-3 text-meta text-ink-2">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            disabled={submitting || status === 'success'}
            className="size-4 rounded-sm border-line text-accent accent-accent"
          />
          Tetap masuk di perangkat ini
        </label>

        <Button type="submit" size="lg" fullWidth loading={submitting} disabled={status === 'success'}>
          {status === 'success' ? 'Berhasil masuk…' : 'Masuk'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        <span className="text-meta text-ink-3">atau</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Full page navigation: the OAuth flow leaves the app, so this is an anchor, not a router link. */}
      <a href="/api/auth/google" className={buttonClasses({ variant: 'secondary', size: 'lg', fullWidth: true })}>
        <GoogleIcon />
        Lanjutkan dengan Google
      </a>

      <div className="mt-6 rounded-sm border border-line bg-surface px-4 py-3">
        <p className="text-meta text-ink-2">
          Lingkungan demo menggunakan data contoh.{' '}
          <button
            type="button"
            onClick={fillDemo}
            className="rounded-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Isi akun demo {role === 'pengajar' ? 'pengajar' : 'mahasiswa'}
          </button>
        </p>
      </div>

      <p className="mt-8 text-center text-meta text-ink-2">
        Belum memiliki akun?{' '}
        <Link
          href={REGISTER_PATH}
          className="rounded-sm font-medium text-ink underline-offset-4 transition-colors duration-200 hover:underline motion-reduce:transition-none"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}
