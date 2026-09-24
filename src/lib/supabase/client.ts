/**
 * Supabase client for use in Client Components (browser).
 * Server Components / Route Handlers must use `./server.ts` instead —
 * they need cookie access, which this client doesn't have.
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
