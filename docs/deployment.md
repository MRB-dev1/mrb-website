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

## Stale-live troubleshooting

The most recent "it pushed to GitHub but not to live" incident on `2026-05-13` was not a failed Cloudflare publish. The GitHub -> Cloudflare Pages flow worked, and the live homepage text updated, but the page still referenced an older `styles.css?v=...` URL. That left the mobile scaling fix invisible on the public site because Cloudflare and browsers kept serving the older cached stylesheet.

What fixed it:

1. Confirmed `main` had the expected commit and that the live HTML had updated.
2. Compared the live homepage asset URLs against the repo versions.
3. Confirmed the repo and `dist-cloudflare/` already contained the right mobile CSS rules.
4. Bumped the shared asset query strings across the root HTML files:
   - `styles.css?v=20260513a`
   - `script.js?v=20260513a`
5. Kept `/styles.css` and `/script.js` on `must-revalidate` in `_headers` instead of `immutable`.
6. Rebuilt `dist-cloudflare/`, pushed `main`, and then verified the live HTML and live CSS directly.

Use this same checklist any time content appears live but styling or shared JS changes do not:

1. Fetch the live HTML and inspect the `styles.css?v=` and `script.js?v=` values.
2. Fetch that exact live asset URL and verify the expected selector or script change is present.
3. If the repo has the fix but the live asset URL is old, bump the version query string across every root HTML file that references the shared asset.
4. Rebuild `dist-cloudflare/`.
5. Push `main` again and verify the live page is referencing the new asset version.
