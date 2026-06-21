import { supabase } from './client';

export async function getSupabaseAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function withSupabaseAuth(init: RequestInit = {}) {
  const authHeaders = await getSupabaseAuthHeaders();
  return {
    ...init,
    headers: {
      ...Object.fromEntries(new Headers(init.headers).entries()),
      ...authHeaders,
    },
  };
}
