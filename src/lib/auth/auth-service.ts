/**
 * Authentication service contract.
 *
 * Backed by Supabase Auth (auth.users + a `profiles` table for role/identityNumber).
 * `essayflow_session` (src/lib/auth/session.ts) is unchanged: this service still
 * returns a plain `AuthResult`, and the caller (src/app/api/auth/login/route.ts)
 * still calls `createSession()` itself. Every other page/component that only knows
 * about `AuthService` and `readSession()` needed zero changes.
 */

import type { AuthResult, AuthUser, Credentials } from '@/types/auth';
import type { Role } from '@/types/domain';
import { createClient } from '@/lib/supabase/server';
import { dashboardPathFor, ONBOARDING_PATH } from './routes';
import { validateCredentials } from './validation';

export interface AuthService {
  signInWithPassword(credentials: Credentials): Promise<AuthResult>;
  /** Exchanges an already-verified Supabase profile for an EssayFlow session user. */
  signInWithGoogle(profile: { id: string; email: string; name: string }): Promise<AuthResult>;
  getUserById(id: string): Promise<AuthUser | null>;
}

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  identity_number: string;
  avatar_url: string | null;
  provider: 'password' | 'google';
  profile_complete: boolean;
}

function toAuthUser(row: ProfileRow): AuthUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    identityNumber: row.identity_number,
    avatarUrl: row.avatar_url ?? undefined,
    provider: row.provider,
    profileComplete: row.profile_complete,
  };
}

function redirectFor(user: AuthUser): string {
  return user.profileComplete ? dashboardPathFor(user.role) : ONBOARDING_PATH;
}

export function roleLabel(role: Role): string {
  return role === 'pengajar' ? 'Pengajar' : 'Mahasiswa';
}

class SupabaseAuthService implements AuthService {
  async signInWithPassword(credentials: Credentials): Promise<AuthResult> {
    const fields = validateCredentials(credentials);
    if (Object.keys(fields).length > 0) {
      return { ok: false, error: { code: 'validasi', message: 'Periksa kembali data yang Anda masukkan.', fields } };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.user) {
      return {
        ok: false,
        error: { code: 'kredensial-salah', message: 'Email atau password salah. Silakan periksa kembali.' },
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single<ProfileRow>();

    if (profileError || !profile) {
      return {
        ok: false,
        error: { code: 'tidak-diketahui', message: 'Profil pengguna tidak ditemukan. Hubungi administrator.' },
      };
    }

    if (profile.role !== credentials.role) {
      return {
        ok: false,
        error: {
          code: 'peran-tidak-sesuai',
          message: `Akun ini terdaftar sebagai ${roleLabel(profile.role)}. Pilih tab ${roleLabel(profile.role)} untuk masuk.`,
        },
      };
    }

    const authUser = toAuthUser(profile);
    return { ok: true, user: authUser, redirectTo: redirectFor(authUser) };
  }

  /**
   * Called after `/api/auth/google/callback` has already exchanged Supabase's
   * OAuth code for a session (supabase.auth.exchangeCodeForSession). The
   * `handle_new_user` trigger (supabase/schema.sql) has already created a
   * `profiles` row for first-time Google sign-ins, defaulting to
   * role='mahasiswa', profileComplete=false — this just reads it back.
   */
  async signInWithGoogle(profile: { id: string; email: string; name: string }): Promise<AuthResult> {
    const authUser = await this.getUserById(profile.id);
    if (!authUser) {
      return {
        ok: false,
        error: { code: 'tidak-diketahui', message: 'Profil Google tidak dapat dibuat. Coba lagi.' },
      };
    }
    return { ok: true, user: authUser, redirectTo: redirectFor(authUser) };
  }

  async getUserById(id: string): Promise<AuthUser | null> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single<ProfileRow>();
    if (error || !data) return null;
    return toAuthUser(data);
  }
}

let instance: AuthService | null = null;

/** Single entry point. Swap the implementation here when a real backend exists. */
export function getAuthService(): AuthService {
  if (!instance) instance = new SupabaseAuthService();
  return instance;
}
