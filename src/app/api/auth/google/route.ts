import { randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { googleAuthUrl, isGoogleConfigured } from '@/lib/auth/google';
import { LOGIN_PATH } from '@/lib/auth/routes';

export const runtime = 'nodejs';

/**
 * Starts the Google authorization flow.
 * Without configured credentials the user is returned to /login with a readable
 * message — no fake client id is generated.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);

  if (!isGoogleConfigured()) {
    const back = new URL(LOGIN_PATH, url.origin);
    back.searchParams.set('error', 'google-belum-dikonfigurasi');
    return NextResponse.redirect(back);
  }

  const state = randomBytes(16).toString('hex');
  const response = NextResponse.redirect(googleAuthUrl(url.origin, state));
  response.cookies.set('essayflow_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  });
  return response;
}
