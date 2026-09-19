/** Authentication + session types. Shared by every authenticated module. */

import type { Role } from './domain';

export type AuthProvider = 'password' | 'google';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** NIM (mahasiswa) or staff ID (pengajar). */
  identityNumber: string;
  avatarUrl?: string;
  provider: AuthProvider;
  /** False for a fresh Google account that has not chosen a role yet. */
  profileComplete: boolean;
}

export interface Session {
  userId: string;
  role: Role;
  name: string;
  email: string;
  profileComplete: boolean;
  /** Epoch seconds. */
  expiresAt: number;
}

export interface Credentials {
  email: string;
  password: string;
  /** Role the user selected on the form; used to reject a role mismatch. */
  role: Role;
  remember?: boolean;
}

export type AuthErrorCode =
  | 'kredensial-salah'
  | 'peran-tidak-sesuai'
  | 'akun-terkunci'
  | 'validasi'
  | 'provider-tidak-tersedia'
  | 'jaringan'
  | 'tidak-diketahui';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  /** Field-level messages for form validation. */
  fields?: Partial<Record<'email' | 'password', string>>;
}

export type AuthResult =
  | { ok: true; user: AuthUser; redirectTo: string }
  | { ok: false; error: AuthError };
