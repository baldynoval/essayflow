/** Role-aware route map. Modules 03+ extend this instead of hardcoding paths. */

import type { Role } from '@/types/domain';

export const LOGIN_PATH = '/login';
export const REGISTER_PATH = '/register';
export const FORGOT_PASSWORD_PATH = '/lupa-password';
/** Where a new Google account completes its role/profile data before a dashboard. */
export const ONBOARDING_PATH = '/lengkapi-profil';

export const DASHBOARD_PATH: Record<Role, string> = {
  pengajar: '/teacher',
  mahasiswa: '/student',
};

export function dashboardPathFor(role: Role): string {
  return DASHBOARD_PATH[role];
}

/** Only allow internal redirects (blocks open-redirect via ?next=). */
export function safeRedirect(next: string | null | undefined, fallback: string): string {
  if (!next) return fallback;
  if (!next.startsWith('/') || next.startsWith('//')) return fallback;
  return next;
}
