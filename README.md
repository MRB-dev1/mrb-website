# MRB Creator Studio Website

Static HTML/CSS/JS marketing site for a creator-focused UEFN/Fortnite studio, with a small inquiry backend for local Node development and Cloudflare Pages deployment.

## Start here

- High-level project index: `CLAUDE.md`
- Architecture and inquiry flow: `docs/architecture.md`
- Analytics and consent telemetry: `docs/analytics.md`
- Commands: `docs/commands.md`
- Deployment: `docs/deployment.md`
- Conventions: `docs/conventions.md`
- Gotchas: `docs/gotchas.md`

## Public pages

- `index.html` - homepage and the main animation reference
- `work.html` - selected work and case-study proof
- `services.html` - custom development services and package framing
- `shop.html` - digital products listing
- `faq.html` - FAQ page
- `about.html` - studio positioning and values
- `contact.html` - general inquiry form
- `book.html` - larger discovery / booking intake form
- `product-*.html` - product detail pages
- `privacy.html`, `terms.html`, `refund-policy.html`, `license.html` - legal pages

## Core files

- `styles.css` - shared styling, layout, and motion definitions
- `script.js` - shared interactions, reveal motion, homepage scroll logic, inquiry modal, and confetti
- `analytics.js` - cookie consent UI, GA4 loader, click tracking, commerce telemetry, error logging, and Web Vitals
- `analytics-config.js` - GA4 measurement ID and debug toggle
- `server.js` - local static server and local inquiry handler
- `functions/api/contact.js` - Cloudflare Pages inquiry handler
- `api/contact.js` - Vercel-compatible inquiry handler
- `scripts/build-cloudflare.js` - Cloudflare static packaging step
- `_headers` - Cloudflare header rules
- `wrangler.toml` - Cloudflare Pages config
- `vercel.json` - Vercel rewrite for `/api/contact`

## Inquiry backend

The only live backend path in this repo is `/api/contact`.

- `contact.html` and `book.html` both post to `/api/contact`.
- `script.js` intercepts submission, validates the email field, posts with `URLSearchParams`, then shows a confirmation modal and confetti on success.
- The backend can post inquiries to Discord via `DISCORD_WEBHOOK_URL`.
- Email delivery through Resend is present in code but optional.

Current runtime variables used by code:

```txt
PORT=3000
CONTACT_TO_EMAIL=Robin@mrb.ink
CONTACT_FROM_EMAIL=MRB <website@mrb.ink>
RESEND_API_KEY=
DISCORD_WEBHOOK_URL=
DISCORD_MENTION_ROLE_ID=1496844933431037952
```

Local note:

- `server.js` loads `.env` manually if present.
- Local submissions are appended to `data/inquiries.jsonl`.

## Local development

```bash
npm start
```

Then open:

```txt
http://localhost:3000/contact.html
```

Opening `contact.html` or `book.html` directly from disk is not a full backend test.

## Deployment

This repo is set up for Cloudflare Pages:

- Build command: `npm run build:cloudflare`
- Build output directory: `dist-cloudflare`
- Functions directory: `functions`
- Production branch: `main`

Manual deploy command:

```bash
npm run deploy:cloudflare
```

## Current caveats

- Shared header/footer/nav markup is duplicated across the root HTML files.
- `script.js` is only included on `index.html`, `contact.html`, `book.html`, and `faq.html`.
- Shop analytics is wired for product views and selection, but `begin_checkout` / `purchase` need real Lemon Squeezy checkout URLs instead of the current `mailto:` product CTAs.
