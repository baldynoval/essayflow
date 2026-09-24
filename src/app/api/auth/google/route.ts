import { NextResponse } from 'next/server';
import { googleRedirectUri, isGoogleConfigured } from '@/lib/auth/google';
import { LOGIN_PATH } from '@/lib/auth/routes';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Starts the Google sign-in flow through Supabase.
 * Without a configured Supabase project the user is returned to /login with a
 * readable message — no fake redirect is generated.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  if (!isGoogleConfigured()) {
    const back = new URL(LOGIN_PATH, url.origin);
    back.searchParams.set('error', 'google-belum-dikonfigurasi');
    return NextResponse.redirect(back);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: googleRedirectUri(url.origin) },
  });

  if (error || !data.url) {
    const back = new URL(LOGIN_PATH, url.origin);
    back.searchParams.set('error', 'google-belum-dikonfigurasi');
    return NextResponse.redirect(back);
  }

  return NextResponse.redirect(data.url);
}
