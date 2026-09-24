import { NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth-service';
import { LOGIN_PATH } from '@/lib/auth/routes';
import { createSession } from '@/lib/auth/session';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Supabase redirects here with `?code=...` after Google sign-in completes.
 * We exchange it for a Supabase session, then translate that into
 * EssayFlow's own `essayflow_session` cookie so every other page keeps
 * reading `readSession()` exactly as before.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const errorFromGoogle = url.searchParams.get('error');

  const failed = (reason: string) => {
    const back = new URL(LOGIN_PATH, url.origin);
    back.searchParams.set('error', reason);
    return NextResponse.redirect(back);
  };

  if (errorFromGoogle || !code) {
    return failed('google-belum-dikonfigurasi');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return failed('google-belum-dikonfigurasi');
  }

  const result = await getAuthService().signInWithGoogle({
    id: data.user.id,
    email: data.user.email ?? '',
    name: (data.user.user_metadata?.name as string | undefined) ?? data.user.email ?? '',
  });

  if (!result.ok) {
    return failed('tidak-diketahui');
  }

  await createSession(result.user);
  return NextResponse.redirect(new URL(result.redirectTo, url.origin));
}
