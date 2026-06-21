# ArcanumWiki

ArcanumWiki is now a static Astro build shaped around a human-made D&D toolkit:

- Public HTML first
- No auth in the launch runtime
- No backend or API keys required for launch
- Browser-side generators fed by curated tables
- Search powered by Pagefind
- Deployment targeted at Cloudflare Pages

## Stack

- Astro static output
- Tailwind CSS v4
- Preact islands for the interactive tools
- Astro content collections for guides
- Pagefind for static search

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

That produces the static site in `dist/` and then builds the Pagefind search index.
