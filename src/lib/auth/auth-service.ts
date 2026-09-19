/**
 * Authentication service contract.
 *
 * Module 02 ships a mock implementation so the UI is fully testable.
 * A real provider (database + hashed passwords, or an external identity service)
 * only has to implement `AuthService` — no page or component changes required.
 */

import type { AuthResult, AuthUser, Credentials } from '@/types/auth';
import type { Role } from '@/types/domain';
import { findUserByEmail } from './mock-users';
import { dashboardPathFor, ONBOARDING_PATH } from './routes';
import { validateCredentials } from './validation';

export interface AuthService {
  signInWithPassword(credentials: Credentials): Promise<AuthResult>;
  /** Exchanges a provider profile for an EssayFlow account. */
  signInWithGoogle(profile: { email: string; name: string; sub: string }): Promise<AuthResult>;
  getUserById(id: string): Promise<AuthUser | null>;
}

function redirectFor(user: AuthUser): string {
  return user.profileComplete ? dashboardPathFor(user.role) : ONBOARDING_PATH;
}

function publicUser(user: AuthUser & { password?: string }): AuthUser {
  const { id, name, email, role, identityNumber, avatarUrl, provider, profileComplete } = user;
  return { id, name, email, role, identityNumber, avatarUrl, provider, profileComplete };
}

class MockAuthService implements AuthService {
  async signInWithPassword(credentials: Credentials): Promise<AuthResult> {
    const fields = validateCredentials(credentials);
    if (Object.keys(fields).length > 0) {
      return { ok: false, error: { code: 'validasi', message: 'Periksa kembali data yang Anda masukkan.', fields } };
    }

    // Simulates network/database latency so loading states are visible in development.
    await new Promise((resolve) => setTimeout(resolve, 650));

    const user = findUserByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      return {
        ok: false,
        error: { code: 'kredensial-salah', message: 'Email atau password salah. Silakan periksa kembali.' },
      };
    }

    if (user.role !== credentials.role) {
      return {
        ok: false,
        error: {
          code: 'peran-tidak-sesuai',
          message: `Akun ini terdaftar sebagai ${roleLabel(user.role)}. Pilih tab ${roleLabel(user.role)} untuk masuk.`,
        },
      };
    }

    const authUser = publicUser(user);
    return { ok: true, user: authUser, redirectTo: redirectFor(authUser) };
  }

  async signInWithGoogle(profile: { email: string; name: string; sub: string }): Promise<AuthResult> {
    const existing = findUserByEmail(profile.email);
    if (existing) {
      const authUser = publicUser(existing);
      return { ok: true, user: authUser, redirectTo: redirectFor(authUser) };
    }

    // New Google account: role and profile data are collected before entering a dashboard.
    const authUser: AuthUser = {
      id: `usr-google-${profile.sub}`,
      name: profile.name,
      email: profile.email,
      role: 'mahasiswa',
      identityNumber: '',
      provider: 'google',
      profileComplete: false,
    };
    return { ok: true, user: authUser, redirectTo: ONBOARDING_PATH };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const user = (await import('./mock-users')).MOCK_USERS.find((candidate) => candidate.id === id);
    return user ? publicUser(user) : null;
  }
}

export function roleLabel(role: Role): string {
  return role === 'pengajar' ? 'Pengajar' : 'Mahasiswa';
}

let instance: AuthService | null = null;

/** Single entry point. Swap the implementation here when a real backend exists. */
export function getAuthService(): AuthService {
  if (!instance) instance = new MockAuthService();
  return instance;
}
