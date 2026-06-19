# Free Deployment

ArcanumWiki is intended to be committed to GitHub and deployed from that repo to a free Cloudflare hosting plan.

## What you need

- A GitHub account
- A Cloudflare account
- Your Supabase project URL
- Your Supabase publishable key
- A production site URL set in `VITE_SITE_URL` and `SITE_URL`

## Environment variables

Set these in your deployment environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SITE_URL`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

`VITE_SITE_URL` and `SITE_URL` should point to the final public origin, for example your `workers.dev` URL or a custom domain.

## Build

```bash
npm install
npm run build
```

## Deploy

1. Push the code to GitHub.
2. In Cloudflare, create a new Workers project from the GitHub repository.
3. Add the environment variables above in the Cloudflare dashboard.
4. Deploy on the free plan.

## SEO checklist

- Keep `public/robots.txt` live
- Keep `src/routes/sitemap[.]xml.ts` deployed
- Set `VITE_SITE_URL` to the production origin
- Re-seed content after any database reset with `npm run seed:public`
