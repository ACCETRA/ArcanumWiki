import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { serverEnvValue } from '@/lib/runtime-env';

export function bearerTokenFromRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice('Bearer '.length).trim() || null;
}

export async function requireSupabaseAuth(request: Request) {
  const SUPABASE_URL = serverEnvValue("SUPABASE_URL");
  const SUPABASE_PUBLISHABLE_KEY = serverEnvValue("SUPABASE_PUBLISHABLE_KEY");

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(', ')}`);
  }

  const token = bearerTokenFromRequest(request);
  if (!token) {
    throw new Error('Unauthorized: Bearer token required');
  }

  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    throw new Error('Unauthorized: Invalid token');
  }

  return {
    supabase,
    userId: data.claims.sub,
    claims: data.claims,
  };
}
