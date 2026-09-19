import { NextResponse } from 'next/server';
import { getAuthService } from '@/lib/auth/auth-service';
import { safeRedirect } from '@/lib/auth/routes';
import { createSession } from '@/lib/auth/session';
import { isRole } from '@/lib/auth/validation';
import type { AuthResult } from '@/types/auth';

export const runtime = 'nodejs';

export async function POST(request: Request): Promise<NextResponse<AuthResult>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'validasi', message: 'Permintaan tidak valid.' } },
      { status: 400 },
    );
  }

  const { email, password, role, remember, next } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== 'string' || typeof password !== 'string' || !isRole(role)) {
    return NextResponse.json(
      { ok: false, error: { code: 'validasi', message: 'Lengkapi email, password, dan peran Anda.' } },
      { status: 400 },
    );
  }

  const result = await getAuthService().signInWithPassword({
    email,
    password,
    role,
    remember: Boolean(remember),
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: result.error.code === 'validasi' ? 400 : 401 });
  }

  try {
    await createSession(result.user, Boolean(remember));
  } catch {
    // e.g. AUTH_SECRET missing in production — never sign a session with a known key.
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'tidak-diketahui',
          message: 'Konfigurasi server belum lengkap sehingga sesi tidak dapat dibuat. Hubungi administrator.',
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ...result,
    redirectTo: safeRedirect(typeof next === 'string' ? next : null, result.redirectTo),
  });
}
