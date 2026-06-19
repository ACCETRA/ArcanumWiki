# Free Deployment

ArcanumWiki is intended to be committed to GitHub and deployed from that repo to a free Cloudflare Workers plan.

## What you need

- A GitHub account
- A Cloudflare account
- Your Supabase project URL
- Your Supabase publishable key
- A production site URL set in `VITE_SITE_URL` and `SITE_URL`

## Environment variables

Set these in your deployment environment:

- `SUPABASE_SERVICE_ROLE_KEY`

The public values below are now pinned in `wrangler.toml` so Cloudflare keeps them during deploy:

- `SITE_URL`
- `SUPABASE_PROJECT_ID`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `VITE_SITE_URL`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

Keep this one in Cloudflare as a secret:

- `SUPABASE_SERVICE_ROLE_KEY`

`VITE_SITE_URL` and `SITE_URL` should point to the final public origin, for example your `workers.dev` URL or a custom domain.

## Build

```bash
npm install
npm run build
```

## Deploy

1. Push the code to GitHub.
2. In Cloudflare, create a new Workers project from the GitHub repository.
3. Set the deploy command to `npm run deploy:cloudflare`.
4. Add the environment variables above in the Cloudflare dashboard.
5. Deploy on the free plan.

`wrangler.toml` tells Cloudflare where the Worker entrypoint and static assets live after the build. The deploy script builds first, then sends the compiled app to Cloudflare.

## SEO checklist

- Keep `public/robots.txt` live
- Keep `src/routes/sitemap[.]xml.ts` deployed
- Set `VITE_SITE_URL` to the production origin
- Re-seed content after any database reset with `npm run seed:public`
