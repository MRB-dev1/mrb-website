## Overview

MRB Creator Studio is a hand-authored static marketing site for a creator-focused UEFN/Fortnite studio. The live stack today is HTML + CSS + selective client-side animation JS, deployed through GitHub to Cloudflare Pages, with one backend path: `/api/contact` posting inquiries to Discord through a webhook-backed serverless handler.

## Current stack

- Root-level static HTML pages such as `index.html`, `work.html`, `services.html`, `shop.html`, `contact.html`, and `book.html`
- Shared styling in `styles.css`
- Shared interaction and animation code in `script.js`
- Local development server in `server.js`
- Cloudflare Pages Function in `functions/api/contact.js`
- Vercel-compatible fallback handler in `api/contact.js`

## Top-level map

- `assets/` - images and the homepage hero video used by the marketing pages
- `data/` - local inquiry log written by `server.js`
- `docs/` - deeper project documentation split by concern
- `functions/` - Cloudflare Pages Functions, currently only the inquiry endpoint
- `api/` - alternate serverless handler layout for Vercel compatibility
- `scripts/` - build packaging and one offline video utility script
- `dist-cloudflare/` - generated Cloudflare deploy output
- `_video_probe/` - video preview artifacts for grading work
- Root `*.html` files - page source for all public routes
- Root config files - `package.json`, `wrangler.toml`, `_headers`, `vercel.json`

## Where to find detail

- [`docs/architecture.md`](docs/architecture.md) - page assembly, serving model, animation system, inquiry flow, and a fuller directory map
- [`docs/commands.md`](docs/commands.md) - every npm command and custom script worth knowing
- [`docs/deployment.md`](docs/deployment.md) - Cloudflare Pages setup, GitHub integration path, env vars, previews, and rollback
- [`docs/conventions.md`](docs/conventions.md) - non-obvious project patterns for file layout, naming, animation hooks, and form wiring
- [`docs/gotchas.md`](docs/gotchas.md) - the time-saving caveats that are easy to miss on a first pass

## Future structure

When a dedicated backend is added, it should live in its own folder with its own `CLAUDE.md`, and frontend code should get the same treatment when it becomes large enough to deserve a local index. Anyone adding a major subsystem should create a `CLAUDE.md` inside that subsystem's folder instead of expanding this root file.
