## Site structure

This site is built from hand-authored root-level HTML files. There is no template engine, component build step, or static site generator in the current repo; every public page is a standalone file such as `index.html`, `work.html`, `services.html`, `shop.html`, `about.html`, `faq.html`, `contact.html`, `book.html`, and the `product-*.html` detail pages.

Shared page chrome is duplicated across those files. Header, footer, nav, favicon links, stylesheet references, and most CTA patterns are copied by hand, so a global content or nav change usually means touching multiple HTML files.

## How pages are served

Local development runs through `server.js`:

1. `npm start` launches a Node HTTP server on `http://localhost:3000`.
2. `GET /` serves `index.html`.
3. Other `GET` and `HEAD` requests resolve directly to files under the repo root.
4. `POST /api/contact` is handled in-process by the Node server.

Production is configured for Cloudflare Pages, not a standalone Worker:

1. `npm run build:cloudflare` runs `scripts/build-cloudflare.js`.
2. That script recreates `dist-cloudflare/`.
3. It copies every root `*.html` file plus `styles.css`, `script.js`, `_headers`, and `assets/`.
4. `wrangler.toml` points Cloudflare Pages at `dist-cloudflare/` with `pages_build_output_dir = "dist-cloudflare"`.
5. `functions/api/contact.js` handles `/api/contact` in the deployed Pages environment.

There is also a Vercel-compatible handler at `api/contact.js`, wired by `vercel.json`, but the documented deploy path in this repo is Cloudflare Pages.

## Frontend organization

- `styles.css` is the single shared stylesheet for layout, tokens, components, and motion.
- `script.js` is the single shared interaction script.
- `script.js` is only loaded by `index.html`, `contact.html`, `book.html`, and `faq.html`.
- The rest of the pages are static HTML plus shared CSS only.
- Assets live under `assets/`, and many references use manual `?v=...` cache-busting query strings.

Representative pages:

- `index.html` is the heaviest page and the best reference for the motion system.
- `contact.html` shows the simpler inquiry form shape.
- `book.html` shows the larger intake form that still posts to the same endpoint.
- `work.html`, `services.html`, and `shop.html` are representative static content pages without `script.js`.

## Animation architecture

The animation footprint is real but contained. There is no GSAP, Framer Motion, Anime.js, or similar library in the repo; all motion comes from `script.js` plus CSS transitions/keyframes in `styles.css`.

Patterns in `script.js`:

- Scroll progress bar updates `.scroll-progress`.
- Homepage storyline motion updates CSS variables on `[data-storyline]` and parallax cards on `[data-parallax-card]`.
- Reveal timing is attached to `.reveal-sequence` children and `.hero-headline [data-reveal]`.
- Reveal visibility is driven by one `IntersectionObserver` over `[data-reveal]`, `.reveal-sequence > *`, and `.timeline-item`.
- Hero video loading is delayed until `.hero-media-loop` enters view, then skipped entirely when `prefers-reduced-motion` is on.
- Post-submit feedback is a generated `.inquiry-modal` plus `.confetti-layer`.

Patterns in `styles.css`:

- `[data-reveal]` defines the base reveal states.
- `.reveal-sequence` relies on JS-injected `--reveal-delay`.
- `.storyline`, `.timeline-item`, and `.story-visual` define the homepage process section.
- `.pulse-cta` and `.calm-submit` are the named long-running CTA animations.
- `@media (prefers-reduced-motion: reduce)` disables or collapses most motion-heavy behavior.

## Inquiry flow: form submit to Discord

Both inquiry pages use the same backend path:

1. `contact.html` and `book.html` each define a form with `action="/api/contact"`, `method="post"`, `data-contact-form`, and a `data-form-name`.
2. Both forms include a hidden honeypot field named `website`.
3. On submit, `script.js` intercepts the event, disables the submit button, validates `Email`, and serializes the form with `new URLSearchParams(formData)`.
4. If the page was opened directly from disk (`file:`), the script posts to `http://localhost:3000/api/contact`; otherwise it posts to the form action.
5. `server.js`, `functions/api/contact.js`, or `api/contact.js` parse the body and short-circuit successful honeypot hits with `{ ok: true }`.
6. The handlers require `Name`, `Email`, and either `Message` or `Project summary`.
7. Discord delivery uses `DISCORD_WEBHOOK_URL` and optional `DISCORD_MENTION_ROLE_ID`.
8. The webhook payload uses username `MRB Website`, an optional role mention in `content`, and one embed whose fields are the first 12 non-empty form entries except `website`.
9. On the client, a successful response resets the form, updates status text, opens a generated summary modal, and fires confetti.

Runtime differences matter:

- `server.js` writes accepted submissions to `data/inquiries.jsonl` before attempting provider delivery.
- `functions/api/contact.js` and `api/contact.js` do not write to disk.
- The deployed handlers fail if neither Discord nor Resend can deliver.
- The local Node server still returns success even if no delivery provider is configured.

## Directory map

- `about.html` - studio positioning, values, and platform focus
- `book.html` - larger intake form for discovery / creator partnership inquiries
- `contact.html` - general business and support inquiry form
- `faq.html` - FAQ page with reveal motion enabled
- `index.html` - homepage and primary animation reference
- `license.html`, `privacy.html`, `refund-policy.html`, `terms.html` - legal pages
- `product-*.html` - product detail pages with current request-access mailto CTAs
- `services.html` - custom work and package overview
- `shop.html` - product listing grid
- `work.html` - case-study and proof page
- `styles.css` - global styles and motion definitions
- `script.js` - all client-side behavior
- `server.js` - local static server and local inquiry backend
- `api/contact.js` - Vercel-style serverless inquiry handler
- `functions/api/contact.js` - Cloudflare Pages Function inquiry handler
- `scripts/build-cloudflare.js` - static packaging step for Cloudflare Pages
- `scripts/colorgrade_video.py` - offline OpenCV utility for grading video or rendering previews
- `assets/` - screenshots, logos, and homepage video
- `data/inquiries.jsonl` - local append-only inquiry log
- `dist-cloudflare/` - generated deploy output
- `wrangler.toml` - Cloudflare Pages config
- `_headers` - Cloudflare response header rules
- `vercel.json` - `/api/contact` rewrite for Vercel compatibility
