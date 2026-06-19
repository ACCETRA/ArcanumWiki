import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { siteUrl } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <div className="font-display text-7xl text-gold">404</div>
          <h1 className="mt-4 font-display text-2xl">This scroll is blank</h1>
          <p className="mt-2 text-muted-foreground">
            The page you sought has not yet been written — perhaps you are the one to inscribe it.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Link
              to="/"
              className="rounded-md bg-gold text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-gold-soft"
            >
              Return to the hall
            </Link>
            <Link
              to="/wiki/new"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              Write a new page
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center px-4 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl text-destructive">A spell misfired</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error.message || "Something went wrong loading this page."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="rounded-md bg-gold text-primary-foreground px-4 py-2 text-sm font-semibold hover:bg-gold-soft"
            >
              Recast
            </button>
            <a
              href="/"
              className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              Return home
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1a1532" },
      { title: "ArcanumWiki — The community D&D codex" },
      {
        name: "description",
        content:
          "A community-built Dungeons & Dragons wiki. Create, edit and credit every page — classes, races, spells, monsters, lore and homebrew, written by adventurers.",
      },
      { name: "author", content: "ArcanumWiki community" },
      { property: "og:site_name", content: "ArcanumWiki" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "ArcanumWiki — The community D&D codex" },
      {
        property: "og:description",
        content:
          "A community-built Dungeons & Dragons wiki. Every page is written and credited by its authors.",
      },
      { property: "og:image", content: siteUrl("/brand-logo.png") },
      { property: "og:image:alt", content: "ArcanumWiki logo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ArcanumWiki — The community D&D codex" },
      {
        name: "twitter:description",
        content: "Open D&D wiki. Anyone can edit. Every word is credited.",
      },
      { name: "twitter:image", content: siteUrl("/brand-logo.png") },
      // anti-AI-training preference signals (advisory, in addition to robots.txt)
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "googlebot", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: siteUrl("/brand-logo.png") },
      { rel: "apple-touch-icon", href: siteUrl("/brand-logo.png") },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "ArcanumWiki",
          description: "Community-built Dungeons & Dragons wiki.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl("/wiki")}?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
