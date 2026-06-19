import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

function hydrateProcessEnv(env: unknown) {
  if (env == null || typeof env !== "object") return;

  const runtimeEnv = env as Record<string, unknown>;
  const target = (globalThis as typeof globalThis & {
    __ARCANUM_WORKER_ENV__?: Record<string, string>;
  });

  target.__ARCANUM_WORKER_ENV__ = Object.fromEntries(
    Object.entries(runtimeEnv).filter(([, value]) => typeof value === "string"),
  );

  if (typeof process === "undefined" || process.env == null) return;

  for (const [key, value] of Object.entries(runtimeEnv)) {
    if (typeof value !== "string") continue;
    if (process.env[key] == null) {
      process.env[key] = value;
    }
  }
}

function injectRuntimeEnvScript(response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return Promise.resolve(response);

  return response.text().then((html) => {
    const runtimeEnv = (globalThis as typeof globalThis & {
      __ARCANUM_WORKER_ENV__?: Record<string, string>;
    }).__ARCANUM_WORKER_ENV__ ?? {};

    const script = `<script>globalThis.__ARCANUM_WORKER_ENV__=${JSON.stringify(runtimeEnv)};</script>`;
    const injected = html.includes("</head>")
      ? html.replace("</head>", `${script}</head>`)
      : `${script}${html}`;

    const headers = new Headers(response.headers);
    headers.set("content-type", "text/html; charset=utf-8");
    return new Response(injected, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      hydrateProcessEnv(env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return await injectRuntimeEnvScript(normalized);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
