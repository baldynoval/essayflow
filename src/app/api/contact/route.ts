import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/auth/validation';

export const runtime = 'nodejs';

/** Stores the message in contact_messages (supabase/schema_additions.sql) — no email provider is wired up yet. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ ok: false, error: 'Nama wajib diisi.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email : '';
  const emailError = validateEmail(email);
  if (emailError) return NextResponse.json({ ok: false, error: emailError }, { status: 400 });
  if (typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json({ ok: false, error: 'Pesan wajib diisi.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name: body.name.trim(), email, message: body.message.trim() });
  if (error) return NextResponse.json({ ok: false, error: 'Gagal mengirim pesan. Coba lagi.' }, { status: 500 });

  return NextResponse.json({ ok: true });
}
