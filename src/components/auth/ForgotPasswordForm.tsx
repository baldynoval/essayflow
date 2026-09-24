'use client';

import { useState, type FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEmail } from '@/lib/auth/validation';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { ok: boolean };
      // Shown regardless of result.ok — the route deliberately doesn't reveal
      // whether the email exists, so neither does this form.
      setSent(result.ok || true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {sent ? (
        <Alert tone="success" title="Tautan terkirim.">
          Jika email tersebut terdaftar, tautan pengaturan ulang password sudah dikirim. Cek kotak masuk (dan folder spam) Anda.
        </Alert>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={error}
            required
          />
          <Button type="submit" size="lg" fullWidth disabled={submitting}>
            {submitting ? 'Mengirim…' : 'Kirim Tautan'}
          </Button>
        </form>
      )}
    </div>
  );
}
