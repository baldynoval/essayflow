import { NextResponse } from 'next/server';
import { LOGIN_PATH } from '@/lib/auth/routes';
import { destroySession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true, redirectTo: LOGIN_PATH });
}
