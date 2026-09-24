import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isRole, validateCredentials } from '@/lib/auth/validation';

export const runtime = 'nodejs';

/**
 * Password sign-up. Supabase's `handle_new_user` trigger (see
 * supabase/schema_additions.sql) creates the matching `profiles` row from
 * the metadata sent here, with profile_complete = true (unlike Google
 * sign-up, we already have name/role/identity by the time this succeeds).
 */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.name !== 'string' || !body.name.trim()) {
    return NextResponse.json({ ok: false, error: 'Nama wajib diisi.' }, { status: 400 });
  }
  if (!isRole(body.role)) {
    return NextResponse.json({ ok: false, error: 'Peran tidak valid.' }, { status: 400 });
  }
  const email = typeof body.email === 'string' ? body.email : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const fieldErrors = validateCredentials({ email, password });
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json({ ok: false, error: 'Periksa kembali data yang dimasukkan.', fields: fieldErrors }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: body.name.trim(),
        role: body.role,
        identity_number: typeof body.identity === 'string' ? body.identity : '',
        profile_complete: true,
      },
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes('already registered')
      ? 'Email sudah terdaftar. Silakan masuk.'
      : 'Gagal mendaftar. Coba lagi.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
  if (!data.user) {
    return NextResponse.json({ ok: false, error: 'Gagal mendaftar. Coba lagi.' }, { status: 500 });
  }

  // Email confirmation may be required depending on the Supabase project's
  // auth settings — if so there's no session yet, so tell the caller to
  // send the person to /login instead of trying to sign them in here.
  return NextResponse.json({
    ok: true,
    needsEmailConfirmation: !data.session,
  });
}
