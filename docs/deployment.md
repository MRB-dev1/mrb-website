## Hosting model

The production-oriented config in this repo targets Cloudflare Pages, not a standalone Cloudflare Worker:

- `wrangler.toml` uses `pages_build_output_dir = "dist-cloudflare"`.
- `functions/api/contact.js` is the Pages Function for `/api/contact`.
- `_headers` provides Cloudflare response header rules for HTML, CSS, JS, assets, and `/api/*`.
- There is no committed `_redirects` file.

There is also Vercel compatibility in the repo:

- `api/contact.js` is a Vercel-style serverless handler.
- `vercel.json` rewrites `/api/contact` to `/api/contact.js`.

The live deployment path described in the repo is GitHub -> Cloudflare Pages.

## GitHub -> Cloudflare flow

There are no `.github/workflows/*` files in this repo. Deployment is expected to come from Cloudflare Pages Git integration rather than from GitHub Actions.

The repo and README point to this Pages setup:

- Framework preset: `None`
- Build command: `npm run build:cloudflare`
- Deploy command: leave empty
- Build output directory: `dist-cloudflare`
- Functions directory: `functions`
- Production branch: `main`

Build contents are defined by `scripts/build-cloudflare.js`:

- all root `*.html`
- `styles.css`
- `script.js`
- `analytics.js`
- `analytics-config.js`
- `_headers`
- `assets/`

## Branch and environment mapping

- `main` is the documented production branch for Cloudflare Pages.
- No other branch mapping is committed in the repo.
- No environment-specific config files or GitHub Actions are present.

## Environment variables

Current code paths use these variables:

- `DISCORD_WEBHOOK_URL` - required for Discord delivery from the inquiry endpoint.
- `DISCORD_MENTION_ROLE_ID` - optional role mention appended to Discord inquiry notifications.
- `RESEND_API_KEY` - optional; enables email delivery through Resend.
- `CONTACT_FROM_EMAIL` - optional unless email delivery is enabled.
- `CONTACT_TO_EMAIL` - optional unless email delivery is enabled; defaults to `Robin@mrb.ink` in code.
- `PORT` - local-only port for `server.js`, default `3000`.

Where they are set:

- Local Node server: `.env`, loaded manually by `server.js`
- Cloudflare Pages: project environment variable settings
- Vercel, if used as an alternate host: project environment variable settings

## Preview deploys

No preview-deploy logic is committed in the repo. If preview deploys exist for the live site, they are managed by Cloudflare Pages Git integration, not by GitHub Actions or custom branch scripts in this codebase.

The only in-repo clue is the README note that the non-production branch deploy command should be left empty in Cloudflare Pages settings.

## Rollback

No scripted rollback flow is committed in this repo.

Repo-grounded rollback options are:

1. Re-run the production deploy path from a known-good commit by making that commit the state of `main` for Cloudflare Git integration.
2. Check out a known-good commit locally and run `npm run deploy:cloudflare` from that checkout.

## Cache and header behavior

`_headers` sets these key deployment behaviors:

- `/assets/*` is cached as `public, max-age=31536000, immutable`
- `/styles.css` and `/script.js` are `must-revalidate`
- `/*.html` is `must-revalidate`
- `/api/*` is `no-store`

Because assets are immutable at the header layer, any asset replacement should be paired with an updated `?v=` query string in the HTML that references it.
