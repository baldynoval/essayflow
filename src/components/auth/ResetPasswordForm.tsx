'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { validatePassword } from '@/lib/auth/validation';
import { LOGIN_PATH } from '@/lib/auth/routes';

/**
 * The recovery link Supabase emails lands here with an access token in the
 * URL; `createBrowserClient` (src/lib/supabase/client.ts) picks that up
 * automatically and opens a session, which is all `updateUser` then needs.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validatePassword(password);
    setError(validationError);
    if (validationError || submitting) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('Gagal mengubah password. Tautan mungkin kedaluwarsa — minta tautan baru.');
        return;
      }
      setDone(true);
      setTimeout(() => router.push(LOGIN_PATH), 1500);
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) {
    return (
      <Alert tone="warning" title="Tautan tidak valid atau kedaluwarsa.">
        Minta tautan pengaturan ulang password baru dari halaman Lupa Password.
      </Alert>
    );
  }

  if (done) {
    return <Alert tone="success" title="Password berhasil diubah." >Mengalihkan ke halaman Masuk…</Alert>;
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Input
        label="Password Baru"
        type="password"
        revealable
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={error}
        hint="Minimal 8 karakter."
        required
      />
      <Button type="submit" size="lg" fullWidth disabled={submitting}>
        {submitting ? 'Menyimpan…' : 'Simpan Password Baru'}
      </Button>
    </form>
  );
}
