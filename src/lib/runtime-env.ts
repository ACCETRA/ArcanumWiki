export type RuntimeEnv = Partial<{
  SITE_URL: string;
  SUPABASE_PROJECT_ID: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_URL: string;
  VITE_SITE_URL: string;
  VITE_SUPABASE_PROJECT_ID: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
  VITE_SUPABASE_URL: string;
}>;

declare global {
  // Populated by the Worker entry before HTML is returned.
  var __ARCANUM_WORKER_ENV__: RuntimeEnv | undefined;
}

function readRuntimeEnv(): RuntimeEnv {
  return globalThis.__ARCANUM_WORKER_ENV__ ?? {};
}

export function runtimeEnvValue(key: keyof RuntimeEnv): string {
  const value = readRuntimeEnv()[key];
  return typeof value === "string" ? value : "";
}
