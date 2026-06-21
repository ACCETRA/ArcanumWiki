# Deployment

ArcanumWiki is configured for a static Cloudflare Pages launch.

## Build settings

- Build command: `npm run build`
- Output directory: `dist`

## Launch posture

- No auth required
- No backend functions required
- No private API keys required
- Public pages only

## Suggested flow

1. Push the repository to GitHub.
2. Create a Cloudflare Pages project from that repository.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Set `SITE_URL` in the Pages project if you want canonical URLs to use a custom origin.

## Optional public variables

- `SITE_URL`
- `PUBLIC_DONATE_URL`

Both are safe to expose because they are public-facing values.
