type RuntimeEnvValue = string | number | boolean | null | undefined;
type RuntimeEnv = Record<string, RuntimeEnvValue>;

declare global {
  // Allows adapters or edge runtimes to expose request/runtime envs without
  // coupling the Supabase helpers to a specific hosting platform.
  // eslint-disable-next-line no-var
  var __ARCANUMWIKI_ENV__: RuntimeEnv | undefined;

  interface Window {
    __ARCANUMWIKI_ENV__?: RuntimeEnv;
  }
}

function stringifyEnvValue(value: RuntimeEnvValue) {
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function processEnvValue(name: string) {
  if (typeof process === "undefined") return undefined;
  return stringifyEnvValue(process.env?.[name]);
}

function globalEnvValue(name: string) {
  const globalEnv = globalThis.__ARCANUMWIKI_ENV__;
  return stringifyEnvValue(globalEnv?.[name]);
}

export function runtimeEnvValue(name: string) {
  return globalEnvValue(name) ?? processEnvValue(name);
}

export function serverEnvValue(name: string) {
  return processEnvValue(name) ?? globalEnvValue(name);
}
