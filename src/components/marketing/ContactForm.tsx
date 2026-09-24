'use client';

import { useState, type FormEvent } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { validateEmail } from '@/lib/auth/validation';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    const validationError = validateEmail(email);
    setEmailError(validationError);
    if (validationError || !name.trim() || !message.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!result.ok) {
        setServerError(result.error ?? 'Gagal mengirim pesan. Coba lagi.');
        return;
      }
      setSent(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setServerError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {sent && (
        <Alert tone="success" title="Pesan terkirim.">
          Terima kasih — tim EssayFlow akan membalas melalui email Anda.
        </Alert>
      )}
      {serverError && (
        <Alert tone="danger" title="Gagal mengirim.">
          {serverError}
        </Alert>
      )}
      <form onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Input label="Nama" value={name} onChange={(event) => setName(event.target.value)} required />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={emailError}
          required
        />
        <Textarea label="Pesan" rows={6} value={message} onChange={(event) => setMessage(event.target.value)} required />
        <Button type="submit" size="lg" className="self-start" disabled={submitting}>
          {submitting ? 'Mengirim…' : 'Kirim Pesan'}
        </Button>
      </form>
    </div>
  );
}
