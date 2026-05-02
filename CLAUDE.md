## Overview

MRB Creator Studio is a hand-authored static marketing and sales site for a creator-focused UEFN/Fortnite studio. The stack is root-level HTML pages, one global stylesheet (`styles.css`), sitewide analytics/bootstrap scripts (`analytics-config.js`, `analytics.js`), a page-scoped interaction layer (`script.js`), and a small contact backend for local Node plus Cloudflare Pages. The distinctive parts are the cinematic homepage/storyline treatment, the shared inquiry flow, and the deploy split between static Pages assets and a serverless `/api/contact` endpoint.

## Architecture & data flow

There is no templating system and no generated HTML source. Each page is a standalone document at the repo root: `index.html`, `work.html`, `services.html`, `shop.html`, `about.html`, `faq.html`, `book.html`, `contact.html`, `product-*.html`, and the legal pages. Local development runs through `server.js`, which serves `/` as `index.html`, serves other root files directly, and handles `GET/POST /api/contact`.

Production is configured for Cloudflare Pages, not a standalone Worker. `scripts/build-cloudflare.js` recreates `dist-cloudflare/` by copying all root `*.html`, `styles.css`, `script.js`, `analytics.js`, `analytics-config.js`, `_headers`, and `assets/`. `wrangler.toml` points Pages at that output with `pages_build_output_dir = "dist-cloudflare"`. Form traffic on Cloudflare goes through `functions/api/contact.js`. The repo also keeps a Vercel-compatible path in `api/contact.js` plus `vercel.json`, but the primary hosting setup in this codebase is Cloudflare Pages.

Styles, content, and scripts are organized very flatly. `styles.css` is the global design-token, layout, and component stylesheet. `analytics-config.js` holds the GA4 measurement ID/config, and `analytics.js` is loaded sitewide to manage consent UI, conditional GA boot, and CTA/outbound/download/scroll-depth tracking. `script.js` is not loaded on every page; it is currently included only by `index.html`, `book.html`, `contact.html`, and `faq.html`.

Animations are custom vanilla JS plus CSS, with no animation library dependency. `script.js` sets stagger delays for `.reveal-sequence` groups and headline spans, uses `IntersectionObserver` to toggle `.is-visible` on `[data-reveal]`, `.reveal-sequence > *`, and `.timeline-item`, drives the homepage scroll-progress bar and storyline/parallax CSS variables, lazy-loads the homepage hero video when it enters view, smooth-scrolls `[data-scroll-center]` links, and triggers the inquiry modal/confetti after successful form posts. The CSS side lives in `styles.css`: reveal transitions for `[data-reveal]`, keyframes like `cta-breathe`, `cta-calm`, and `confetti-fall`, plus reduced-motion overrides under `@media (prefers-reduced-motion: reduce)`.

Inquiry data flow is shared across local and deployed backends. `contact.html` and `book.html` both post to `/api/contact`; `contact.html` includes the Turnstile widget placeholders, while `book.html` does not. Frontend submission logic in `script.js` validates email format, hydrates topic chips, optionally fetches Turnstile config from `GET /api/contact`, and submits via `URLSearchParams`. Spam filtering, disposable-domain checks, blocked-name checks, and in-memory rate limiting live in `contact-security.js`. Local `server.js` additionally appends accepted submissions to `data/inquiries.jsonl` before attempting Resend email and/or Discord webhook delivery; the serverless handlers send email/Discord but do not write back into repo files.

Short directory map:

- `assets/` - shared logo/favicon, project screenshots, and homepage video media.
- `api/` - Vercel-style serverless `contact.js`.
- `functions/api/` - Cloudflare Pages Function `contact.js`.
- `data/` - disposable email blocklist and local submission log.
- `scripts/` - Cloudflare packaging script plus `colorgrade_video.py`.
- `audit-screenshots/` - audit JSON/PNG artifacts.
- `_video_probe/` - sampled and graded video preview frames.

## Commands & workflows

- `npm install` - normal project setup; there are no declared dependencies, but Node/npm are still the expected tooling entry point.
- `npm start` - runs `server.js` locally on `http://localhost:3000`, serving the site and `/api/contact` from one process.
- `start-local-server.cmd` - Windows helper that runs `C:\Program Files\nodejs\node.exe server.js`.
- `npm run build:cloudflare` - rebuilds `dist-cloudflare/` from the allowlist in `scripts/build-cloudflare.js`.
- `npm run deploy:cloudflare` - runs the Cloudflare build, then `npx wrangler pages deploy dist-cloudflare`.
- Preview - there is no separate preview script; local preview is `npm start`.
- Lint / format / typecheck - none are configured. `package.json` has no scripts for them, and the repo has no ESLint, Prettier, or TypeScript config files.
- Deploy trigger - there are no `.github/workflows/` files in-repo. `README.md` documents Cloudflare Pages Git integration with `main` as the production branch, and the codebase also supports manual deploys via `npm run deploy:cloudflare`.

## Where to look

- Animations and interactive behavior: `script.js`.
- Motion/reveal/confetti/Turnstile styling: `styles.css`.
- Analytics and consent gating: `analytics-config.js`, `analytics.js`.
- Page templates/content: root `*.html`; `work.html` is the one page with extra inline `<style>` in its `<head>`.
- Contact backend and spam controls: `server.js`, `contact-security.js`, `functions/api/contact.js`, `api/contact.js`.
- Static assets/media: `assets/`.
- Hosting/build config: `package.json`, `scripts/build-cloudflare.js`, `wrangler.toml`, `_headers`, `vercel.json`.

## Gotchas

- There is no partial/include system. Header, footer, nav, and repeated metadata are copied across the root HTML files, so shared content edits are multi-file edits.
- `script.js` is opt-in, not global. If you add `data-reveal`, form behavior, storyline markup, or hero-loop markup to a page that does not already load `script.js`, nothing will happen until that page includes it.
- `scripts/build-cloudflare.js` copies a strict allowlist. New frontend files or folders will not reach `dist-cloudflare/` unless you update that script.
- `contact.html` and `book.html` need a backend. Opening them directly from disk will not submit forms; use `npm start` and test through `http://localhost:3000`.
- Turnstile is only wired in the `contact.html` markup. If `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are enabled globally, `book.html` will still submit without a token and the backend will reject it until that page gets matching Turnstile UI or the backend logic is scoped differently.
- `analytics-config.js` ships with an empty `measurementId`, so the consent banner and GA tracking stay dormant until a real GA4 `G-...` ID is set.
- `work.html` has page-local CSS in a `<style>` block as well as shared rules in `styles.css`, so work-page layout changes may require edits in both places.
