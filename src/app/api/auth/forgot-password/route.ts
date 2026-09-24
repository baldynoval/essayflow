import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/auth/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === 'string' ? body.email : '';
  const emailError = validateEmail(email);
  if (emailError) return NextResponse.json({ ok: false, error: emailError }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${url.origin}/reset-password`,
  });

  // Always respond ok — Supabase itself does not reveal whether the email
  // exists, and neither should this route (avoids leaking who has an account).
  if (error) {
    return NextResponse.json({ ok: false, error: 'Gagal mengirim tautan. Coba lagi.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
