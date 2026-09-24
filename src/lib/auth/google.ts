/**
 * Google sign-in via Supabase Auth.
 *
 * Supabase (not this file) talks to Google directly — the actual Google Client
 * ID/Secret are configured in the Supabase dashboard under
 * Authentication → Providers → Google, not in this app's env vars.
 * `isGoogleConfigured` only checks that Supabase itself is reachable; if the
 * Google provider isn't enabled in Supabase, the callback route reports that
 * error back to the user instead of failing silently.
 */

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function googleRedirectUri(origin: string): string {
  return process.env.GOOGLE_REDIRECT_URI ?? `${origin}/api/auth/google/callback`;
}
