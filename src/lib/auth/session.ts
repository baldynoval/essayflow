/**
 * Session handling — signed, httpOnly cookie.
 *
 * Deliberately storage-agnostic: no database is required to read a session,
 * so this survives the eventual choice of database. If a server-side session
 * store is later preferred, only `createSession` / `readSession` change.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { AuthUser, Session } from '@/types/auth';

export const SESSION_COOKIE = 'essayflow_session';

const DEFAULT_MAX_AGE = 60 * 60 * 8; // 8 hours
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * In development a fixed fallback keeps the flow working without a .env.local.
 * In production AUTH_SECRET is required — fail loudly rather than sign with a known key.
 */
function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET belum dikonfigurasi.');
  }
  return 'essayflow-development-secret';
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export function serializeSession(session: Session): string {
  const payload = base64url(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function parseSession(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    if (typeof session.expiresAt !== 'number' || session.expiresAt * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export function sessionFromUser(user: AuthUser, remember = false): { session: Session; maxAge: number } {
  const maxAge = remember ? REMEMBER_MAX_AGE : DEFAULT_MAX_AGE;
  return {
    session: {
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      profileComplete: user.profileComplete,
      expiresAt: Math.floor(Date.now() / 1000) + maxAge,
    },
    maxAge,
  };
}

export async function createSession(user: AuthUser, remember = false): Promise<void> {
  const { session, maxAge } = sessionFromUser(user, remember);
  const store = await cookies();
  store.set(SESSION_COOKIE, serializeSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

export async function readSession(): Promise<Session | null> {
  const store = await cookies();
  return parseSession(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
