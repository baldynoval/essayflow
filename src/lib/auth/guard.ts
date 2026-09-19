import { redirect } from 'next/navigation';
import { LOGIN_PATH, dashboardPathFor } from './routes';
import { readSession } from './session';
import type { Session } from '@/types/auth';
import type { Role } from '@/types/domain';

/**
 * Guards an application route. Sends unauthenticated visitors to /login with a
 * `next` parameter, and users with the wrong role to their own dashboard.
 */
export async function requireRole(role: Role, currentPath: string): Promise<Session> {
  const session = await readSession();
  if (!session) redirect(`${LOGIN_PATH}?next=${encodeURIComponent(currentPath)}`);
  if (session.role !== role) redirect(dashboardPathFor(session.role));
  return session;
}

export async function requireSession(currentPath: string): Promise<Session> {
  const session = await readSession();
  if (!session) redirect(`${LOGIN_PATH}?next=${encodeURIComponent(currentPath)}`);
  return session;
}
